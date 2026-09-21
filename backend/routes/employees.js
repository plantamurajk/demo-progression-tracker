const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { notifyRequestEvent } = require('../lib/notify');
const router = express.Router();

// All /api routes require a session
router.use(requireAuth);

// ─── Employee list (supervisor view) ─────────────────────────────────────────

router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, rank, level, primary_station, start_date,
              rank_start_date, current_stage, language, status
       FROM employees
       WHERE status = 'active'
       ORDER BY name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Single employee full profile ─────────────────────────────────────────────

router.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [emp, stageProgress, stationExp, certs, skills, devSuggestions,
           assessments, violations, requests] = await Promise.all([
      pool.query('SELECT * FROM employees WHERE id = $1', [id]),
      pool.query('SELECT stage, item_id, completed, completed_at FROM stage_progress WHERE employee_id = $1', [id]),
      pool.query('SELECT station_id, hours, qualified, positions FROM station_experience WHERE employee_id = $1', [id]),
      pool.query('SELECT name, status, earned, expires FROM certifications WHERE employee_id = $1', [id]),
      pool.query(`SELECT id, name_en, name_es, level, category, station_id, notes_en, notes_es,
                        endorsed_by, date_added
                 FROM skills WHERE employee_id = $1 ORDER BY date_added`, [id]),
      pool.query('SELECT id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es FROM dev_suggestions WHERE employee_id = $1 ORDER BY id', [id]),
      pool.query(`SELECT station_id, module_id, type, result, date, evaluator_id
                 FROM assessments WHERE employee_id = $1 ORDER BY date DESC`, [id]),
      pool.query(`SELECT type, date, note, level FROM violations
                 WHERE employee_id = $1 ORDER BY date DESC`, [id]),
      pool.query(`SELECT id, type, station_id, module_id, requested_at, status, response
                 FROM requests WHERE employee_id = $1 ORDER BY requested_at DESC`, [id]),
    ]);

    if (emp.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });

    // Reshape stage_progress into { stage: { item_id: bool } }
    const progressByStage = {};
    for (const row of stageProgress.rows) {
      if (!progressByStage[row.stage]) progressByStage[row.stage] = {};
      progressByStage[row.stage][row.item_id] = row.completed;
    }

    res.json({
      ...emp.rows[0],
      stageProgress: progressByStage,
      stationExperience: stationExp.rows,
      certifications: certs.rows,
      skills: skills.rows,
      devSuggestions: devSuggestions.rows,
      assessments: assessments.rows,
      violations: violations.rows,
      requests: requests.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Stage progress ───────────────────────────────────────────────────────────

router.patch('/employees/:id/stage-progress', async (req, res) => {
  const { id } = req.params;
  const { stage, itemId, completed } = req.body;

  if (!stage || !itemId || completed === undefined) {
    return res.status(400).json({ error: 'stage, itemId, and completed are required' });
  }

  try {
    await pool.query(
      `INSERT INTO stage_progress (employee_id, stage, item_id, completed, completed_at, completed_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (employee_id, stage, item_id) DO UPDATE SET
         completed    = EXCLUDED.completed,
         completed_at = EXCLUDED.completed_at,
         completed_by = EXCLUDED.completed_by`,
      [id, stage, itemId, completed, completed ? new Date() : null, req.session.employeeId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Requests ─────────────────────────────────────────────────────────────────

router.post('/employees/:id/requests', async (req, res) => {
  const { id } = req.params;
  const { type, stationId, moduleId } = req.body;

  if (!type) return res.status(400).json({ error: 'type is required' });

  try {
    const result = await pool.query(
      `INSERT INTO requests (employee_id, type, station_id, module_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, type, station_id, module_id, requested_at, status`,
      [id, type, stationId || null, moduleId || null]
    );
    notifyRequestEvent({
      kind: 'created',
      request: result.rows[0],
      employeeId: id,
      actorId: req.session.employeeId,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status, response } = req.body;

  try {
    const result = await pool.query(
      `UPDATE requests SET status = $1, response = $2, responded_by = $3, responded_at = now()
       WHERE id = $4 RETURNING *`,
      [status, response || null, req.session.employeeId, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
    notifyRequestEvent({
      kind: 'responded',
      request: result.rows[0],
      employeeId: result.rows[0].employee_id,
      actorId: req.session.employeeId,
    });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Skills ───────────────────────────────────────────────────────────────────

router.post('/employees/:id/skills', async (req, res) => {
  const { id } = req.params;
  const { nameEn, nameEs, level, category, stationId, notesEn, notesEs } = req.body;

  if (!nameEn || !level || !category) {
    return res.status(400).json({ error: 'nameEn, level, and category are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id,
                           notes_en, notes_es, endorsed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, nameEn, nameEs || null, level, category, stationId || null,
       notesEn || null, notesEs || null, req.session.employeeId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/skills/:id', async (req, res) => {
  const { id } = req.params;
  const { level, notesEn, notesEs } = req.body;

  try {
    const result = await pool.query(
      `UPDATE skills SET level = COALESCE($1, level),
                         notes_en = COALESCE($2, notes_en),
                         notes_es = COALESCE($3, notes_es)
       WHERE id = $4 RETURNING *`,
      [level || null, notesEn || null, notesEs || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/skills/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Development suggestions ──────────────────────────────────────────────────

router.post('/employees/:id/dev-suggestions', async (req, res) => {
  const { id } = req.params;
  const { skillEn, skillEs, stationId, reasonEn, reasonEs } = req.body;

  if (!skillEn) return res.status(400).json({ error: 'skillEn is required' });

  try {
    const result = await pool.query(
      `INSERT INTO dev_suggestions (employee_id, skill_en, skill_es, station_id,
                                    suggested_by, reason_en, reason_es)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es`,
      [id, skillEn, skillEs || null, stationId || null,
       req.session.employeeId, reasonEn || null, reasonEs || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/dev-suggestions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM dev_suggestions WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Daily log + station hours ────────────────────────────────────────────────

router.post('/employees/:id/log', async (req, res) => {
  const { id } = req.params;
  const { date, stationId, position, hours } = req.body;

  if (!date || !stationId || !position || !hours) {
    return res.status(400).json({ error: 'date, stationId, position, and hours are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO daily_log_entries (employee_id, date, station_id, position, hours,
                                      confirmed_by, confirmed_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       RETURNING *`,
      [id, date, stationId, position, hours, req.session.employeeId]
    );

    // Rebuild cached station_experience hours for this station
    await pool.query(
      `INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions)
       VALUES ($1, $2,
         (SELECT COALESCE(SUM(hours), 0) FROM daily_log_entries WHERE employee_id = $1 AND station_id = $2),
         (SELECT COALESCE(SUM(hours), 0) FROM daily_log_entries WHERE employee_id = $1 AND station_id = $2) >= 80,
         ARRAY(SELECT DISTINCT position FROM daily_log_entries WHERE employee_id = $1 AND station_id = $2)
       )
       ON CONFLICT (employee_id, station_id) DO UPDATE SET
         hours     = EXCLUDED.hours,
         qualified = EXCLUDED.qualified,
         positions = EXCLUDED.positions`,
      [id, stationId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
