const express = require('express');
const axios = require('axios');
const pool = require('../db');
const router = express.Router();

// Step 1: redirect browser to Slack's OAuth screen
router.get('/slack', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID,
    user_scope: 'identity.basic,identity.email,identity.avatar',
    redirect_uri: process.env.SLACK_REDIRECT_URI,
  });
  res.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
});

// Step 2: Slack sends code here after user approves
router.get('/slack/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) {
    return res.redirect(`${process.env.FRONTEND_URL}?auth=failed`);
  }

  try {
    // Exchange code for token
    const tokenRes = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    });

    if (!tokenRes.data.ok) throw new Error(tokenRes.data.error);

    const { id: slackUserId, access_token: accessToken } = tokenRes.data.authed_user;

    // Fetch Slack identity (name, email, avatar)
    const identityRes = await axios.get('https://slack.com/api/users.identity', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!identityRes.data.ok) throw new Error(identityRes.data.error);

    const { email, image_72: avatarUrl } = identityRes.data.user;

    // Match to an employee record by email
    const empResult = await pool.query(
      'SELECT id FROM employees WHERE email = $1',
      [email]
    );

    if (empResult.rows.length === 0) {
      // Slack user has no matching employee — reject
      return res.redirect(`${process.env.FRONTEND_URL}?auth=unauthorized`);
    }

    const employeeId = empResult.rows[0].id;

    // Upsert user_accounts row
    await pool.query(
      `INSERT INTO user_accounts (employee_id, slack_user_id, email, avatar_url, access_token, last_login)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (slack_user_id) DO UPDATE SET
         access_token = EXCLUDED.access_token,
         avatar_url   = EXCLUDED.avatar_url,
         last_login   = now()`,
      [employeeId, slackUserId, email, avatarUrl, accessToken]
    );

    req.session.employeeId = employeeId;
    req.session.slackUserId = slackUserId;

    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (err) {
    console.error('Slack auth error:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
});

// Returns the logged-in employee's profile
router.get('/me', async (req, res) => {
  if (!req.session?.employeeId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const result = await pool.query(
      `SELECT e.id, e.name, e.email, e.rank, e.level, e.primary_station,
              e.current_stage, e.language, e.start_date, ua.avatar_url
       FROM employees e
       LEFT JOIN user_accounts ua ON ua.employee_id = e.id
       WHERE e.id = $1`,
      [req.session.employeeId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

module.exports = router;
