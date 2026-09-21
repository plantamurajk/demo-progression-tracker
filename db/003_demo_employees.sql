-- Demo employees: FICTIONAL people only (Maria Santos, Diego Reyes,
-- Priya Patel, Carlos Rivera, Jamie Chen) with invented progression data.
-- For dev/demo databases — never run against production.
-- Apply with: SEED_DEMO=true npm run migrate --prefix backend

-- employees
INSERT INTO employees (id, name, rank, level, primary_station, start_date, rank_start_date, current_stage, language, status) VALUES ('emp_001', 'Maria Santos', 'Farmhand', NULL, 'Packaging', '2026-01-01', '2026-01-01', 'proficiency', 'en', 'active');
INSERT INTO employees (id, name, rank, level, primary_station, start_date, rank_start_date, current_stage, language, status) VALUES ('emp_005', 'Jamie Chen', 'Farmhand', NULL, 'Seeding', '2026-04-28', '2026-04-28', 'foundations', 'en', 'active');
INSERT INTO employees (id, name, rank, level, primary_station, start_date, rank_start_date, current_stage, language, status) VALUES ('emp_002', 'Diego Reyes', 'Farmer', 'L2', 'Harvest', '2025-03-01', '2025-11-01', NULL, 'en', 'active');
INSERT INTO employees (id, name, rank, level, primary_station, start_date, rank_start_date, current_stage, language, status) VALUES ('emp_003', 'Priya Patel', 'Senior Farmer', 'L4', 'Harvest', '2024-04-01', '2025-01-15', NULL, 'en', 'active');
INSERT INTO employees (id, name, rank, level, primary_station, start_date, rank_start_date, current_stage, language, status) VALUES ('emp_004', 'Carlos Rivera', 'Supervisor', 'L3', 'Harvest', '2023-06-01', '2024-09-01', NULL, 'en', 'active');

-- stage_progress
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'onboarding', 'hr_complete', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'onboarding', 'safety_training', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'onboarding', 'station_tour', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'onboarding', 'emergency_procedures', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'onboarding', 'station_shadow', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'foundations', 'independent_tasks', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'foundations', 'safety_quiz', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'foundations', 'clean_safety_record', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'foundations', 'attendance_satisfactory', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'foundations', 'working_at_pace', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'proficiency', 'multi_station', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'proficiency', 'production_schedule', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'proficiency', 'good_attendance', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_001', 'proficiency', 'cross_training', FALSE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'onboarding', 'hr_complete', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'onboarding', 'safety_training', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'onboarding', 'station_tour', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'onboarding', 'emergency_procedures', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'onboarding', 'station_shadow', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'foundations', 'independent_tasks', TRUE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'foundations', 'safety_quiz', FALSE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'foundations', 'clean_safety_record', FALSE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'foundations', 'attendance_satisfactory', FALSE);
INSERT INTO stage_progress (employee_id, stage, item_id, completed) VALUES ('emp_005', 'foundations', 'working_at_pace', FALSE);

-- station_experience
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_001', 'Packaging', 320, TRUE, ARRAY['Runner','Catcher','Tamper']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_001', 'Washing', 72, FALSE, ARRAY['Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_001', 'Dirt Removal', 16, FALSE, ARRAY['Lead']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_005', 'Seeding', 18, FALSE, ARRAY['Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'Seeding', 97, TRUE, ARRAY['Feeder','Stacker']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'Inserts', 34, FALSE, ARRAY['Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'ASRS', 0, FALSE, ARRAY[]::TEXT[]);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'Harvest', 320, TRUE, ARRAY['Lead','Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'Washing', 91, FALSE, ARRAY['Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'Dirt Removal', 0, FALSE, ARRAY[]::TEXT[]);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_002', 'Packaging', 186, TRUE, ARRAY['Runner','Tamper']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'Harvest', 580, TRUE, ARRAY['Lead','Feeder','Catcher']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'Packaging', 320, TRUE, ARRAY['Lead','Runner','Tamper']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'Seeding', 240, TRUE, ARRAY['Lead','Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'Inserts', 185, TRUE, ARRAY['Lead','Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'ASRS', 160, TRUE, ARRAY['Pilot']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'Washing', 130, TRUE, ARRAY['Feeder','Catcher']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_003', 'Dirt Removal', 95, TRUE, ARRAY['Lead','Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'Harvest', 720, TRUE, ARRAY['Lead','Feeder','Catcher','Corner']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'Packaging', 440, TRUE, ARRAY['Lead','Runner','Case Packer']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'Seeding', 310, TRUE, ARRAY['Lead','Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'ASRS', 220, TRUE, ARRAY['Pilot']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'Inserts', 195, TRUE, ARRAY['Lead','Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'Washing', 70, FALSE, ARRAY['Feeder']);
INSERT INTO station_experience (employee_id, station_id, hours, qualified, positions) VALUES ('emp_004', 'Dirt Removal', 20, FALSE, ARRAY[]::TEXT[]);

-- certifications
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_001', 'Forklift', 'active', '2026-03-15', '2028-03-15');
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_002', 'Forklift', 'active', '2025-10-15', '2027-10-15');
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_002', 'Hazardous Chemical', 'not-started', NULL, NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_002', 'FSMA', 'not-started', NULL, NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_003', 'Forklift', 'active', '2024-09-15', '2026-09-15');
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_003', 'HACCP', 'active', '2025-03-10', NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_003', 'CPR/AED', 'active', '2025-06-20', '2027-06-20');
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'Forklift', 'active', '2023-12-10', '2025-12-10');
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'Hazardous Chemical', 'active', '2024-03-15', NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'FSMA', 'active', '2024-04-20', NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'HACCP', 'active', '2024-07-08', NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'CPR/AED', 'active', '2024-10-12', '2026-10-12');
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'SQF Practitioner', 'not-started', NULL, NULL);
INSERT INTO certifications (employee_id, name, status, earned, expires) VALUES ('emp_004', 'OSHA 10 Hour', 'not-started', NULL, NULL);

-- skills
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_001', 'Case Packing (speed)', 'Velocidad de Empaque', 'proficient', 'technique', 'Packaging', 'Can pack cases at a rate of 28ppm', 'Alcanza consistentemente 40+ cajas/hora', 'Jack P.', '2026-03-28');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_001', 'Scale Calibration', 'Calibración de Báscula', 'competent', 'machine', 'Packaging', 'Can properly calibrate Yamato scale under 10 minutes', NULL, 'Jack P.', '2026-02-14');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_001', 'Tray Washing SOP', 'PNO de Lavado de Bandejas', 'learning', 'technique', 'Washing', NULL, NULL, 'Jack P.', '2026-04-01');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_001', 'Forklift', 'Montacargas', 'certified', 'certification', NULL, 'Passed on first attempt', 'Aprobó en el primer intento', 'Jack P.', '2026-03-15');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_002', 'Harvester Operation', 'Operación de Cosechadora', 'proficient', 'machine', 'Harvest', 'Very confident with corner position', 'Muy seguro en la posición de esquina', 'Jack P.', '2026-02-20');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_002', 'Case Packing', 'Empaque de Cajas', 'competent', 'technique', 'Packaging', NULL, NULL, 'Jack P.', '2026-01-10');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_002', 'Tray Washing SOP', 'PNO de Lavado de Bandejas', 'competent', 'technique', 'Washing', NULL, NULL, 'Jack P.', '2026-03-05');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_002', 'Forklift Operation', 'Operación de Montacargas', 'certified', 'certification', NULL, NULL, NULL, 'Jack P.', '2025-10-15');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'Harvester Operation', 'Operación de Cosechadora', 'proficient', 'machine', 'Harvest', 'Strong lead presence on harvest line', 'Fuerte presencia de liderazgo en la línea de cosecha', 'Jack P.', '2024-08-01');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'ASRS Operation', 'Operación del ASRS', 'proficient', 'machine', 'ASRS', NULL, NULL, 'Jack P.', '2025-02-10');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'Case Packing (speed)', 'Velocidad de Empaque', 'proficient', 'technique', 'Packaging', NULL, NULL, 'Jack P.', '2024-10-05');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'Forklift Operation', 'Operación de Montacargas', 'certified', 'certification', NULL, NULL, NULL, 'Jack P.', '2024-09-15');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'HACCP Principles', 'Principios HACCP', 'certified', 'certification', NULL, NULL, NULL, 'Jack P.', '2025-03-10');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'Training & Coaching', 'Capacitación y Coaching', 'proficient', 'leadership', NULL, 'Excellent at breaking down steps for new hires', 'Excelente para explicar los pasos a los nuevos empleados', 'Jack P.', '2025-02-01');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_003', 'Shift Lead', 'Líder de Turno', 'competent', 'leadership', NULL, NULL, NULL, 'Jack P.', '2025-04-01');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'Harvester Operation', 'Operación de Cosechadora', 'proficient', 'machine', 'Harvest', 'Can train others on corner position', 'Puede capacitar a otros en la posición de esquina', 'Jack P.', '2024-08-15');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'ASRS Operation', 'Operación del ASRS', 'proficient', 'machine', 'ASRS', 'Certified pilot, trains relief pilots', NULL, 'Jack P.', '2024-11-20');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'Forklift Operation', 'Operación de Montacargas', 'certified', 'certification', NULL, NULL, NULL, 'Jack P.', '2023-12-10');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'HACCP Principles', 'Principios HACCP', 'certified', 'certification', NULL, NULL, NULL, 'Jack P.', '2024-07-08');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'Shift Lead', 'Líder de Turno', 'proficient', 'leadership', NULL, 'Handles full-shift lead independently', 'Maneja el liderazgo de turno completo de forma independiente', 'Jack P.', '2025-01-10');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'Corrective Action', 'Acción Correctiva', 'competent', 'leadership', NULL, 'Documenting CAs with coaching notes', NULL, 'Jack P.', '2025-03-05');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', 'Spanish (Basic Phrases)', 'Español (Frases Básicas)', 'competent', 'leadership', NULL, 'Can give safety instructions in Spanish', 'Puede dar instrucciones de seguridad en español', 'Jack P.', '2024-10-01');
INSERT INTO skills (employee_id, name_en, name_es, level, category, station_id, notes_en, notes_es, endorsed_by, date_added) VALUES ('emp_004', '5S Methodology', 'Metodología 5S', 'learning', 'technique', NULL, NULL, NULL, 'Jack P.', '2025-04-01');

-- dev_suggestions
INSERT INTO dev_suggestions (employee_id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es) VALUES ('emp_001', 'Wash Line Operation', 'Operación de Línea de Lavado', 'Washing', 'Jack P.', '8h from qualification, showing strong interest', 'A 8h de calificarse, muestra mucho interés');
INSERT INTO dev_suggestions (employee_id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es) VALUES ('emp_005', 'Food Safety & Hygiene', 'Inocuidad Alimentaria e Higiene', NULL, 'Jack P.', 'Complete by Day 30 — required for advancement', 'Completar antes del Día 30 — requerido para avanzar');
INSERT INTO dev_suggestions (employee_id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es) VALUES ('emp_002', 'Seeding Lead Procedures', 'Procedimientos de Líder de Siembra', 'Seeding', 'Jack P.', 'Ready for Lead position at Seeding', NULL);
INSERT INTO dev_suggestions (employee_id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es) VALUES ('emp_003', 'Conflict Resolution', 'Resolución de Conflictos', NULL, 'Jack P.', 'Key gap before Supervisor promotion', 'Brecha clave antes de la promoción a Supervisor');
INSERT INTO dev_suggestions (employee_id, skill_en, skill_es, station_id, suggested_by, reason_en, reason_es) VALUES ('emp_004', '5S Audit Procedures', 'Procedimientos de Auditoría 5S', NULL, 'Jack P.', 'Next step toward AGM readiness', NULL);

-- assessments
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_001', 'mod-01', NULL, 'Written', 'Pass', 'Jan 8');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_001', 'mod-02', NULL, 'Written', 'Pass', 'Jan 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_001', 'mod-04', NULL, 'Written', 'Pass', 'Jan 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_001', NULL, 'Packaging', 'Practical', 'Pass', 'Feb 20');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_001', NULL, 'Packaging', 'Written', 'Pass', 'Feb 22');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', 'mod-01', NULL, 'Written', 'Pass', 'Mar 8');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', 'mod-02', NULL, 'Written', 'Pass', 'Mar 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', 'mod-04', NULL, 'Written', 'Pass', 'Mar 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Harvest', 'Practical', 'Pass', 'Nov 18');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Harvest', 'Written', 'Pass', 'Nov 20');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Packaging', 'Practical', 'Pass', 'Dec 10');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Packaging', 'Written', 'Pass', 'Dec 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Seeding', 'Practical', 'Pass', 'Feb 3');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Seeding', 'Written', 'Pass', 'Feb 5');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_002', NULL, 'Washing', 'Practical', 'Pass', 'Mar 28');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', 'mod-01', NULL, 'Written', 'Pass', 'Apr 8');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', 'mod-02', NULL, 'Written', 'Pass', 'Apr 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', 'mod-04', NULL, 'Written', 'Pass', 'Apr 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Harvest', 'Practical', 'Pass', 'Jun 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Harvest', 'Written', 'Pass', 'Jun 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Packaging', 'Practical', 'Pass', 'Jul 8');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Packaging', 'Written', 'Pass', 'Jul 10');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Seeding', 'Practical', 'Pass', 'Aug 5');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Seeding', 'Written', 'Pass', 'Aug 7');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Inserts', 'Practical', 'Pass', 'Sep 22');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Inserts', 'Written', 'Pass', 'Sep 24');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'ASRS', 'Practical', 'Pass', 'Oct 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'ASRS', 'Written', 'Pass', 'Oct 16');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Washing', 'Practical', 'Pass', 'Nov 18');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Washing', 'Written', 'Pass', 'Nov 20');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Dirt Removal', 'Practical', 'Pass', 'Dec 9');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_003', NULL, 'Dirt Removal', 'Written', 'Pass', 'Dec 11');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', 'mod-01', NULL, 'Written', 'Pass', 'Jun 8');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', 'mod-02', NULL, 'Written', 'Pass', 'Jun 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', 'mod-04', NULL, 'Written', 'Pass', 'Jun 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Harvest', 'Practical', 'Pass', 'Aug 15');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Harvest', 'Written', 'Pass', 'Aug 17');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Packaging', 'Practical', 'Pass', 'Sep 10');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Packaging', 'Written', 'Pass', 'Sep 12');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Seeding', 'Practical', 'Pass', 'Oct 22');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Seeding', 'Written', 'Pass', 'Oct 24');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'ASRS', 'Practical', 'Pass', 'Nov 18');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'ASRS', 'Written', 'Pass', 'Nov 20');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Inserts', 'Practical', 'Pass', 'Jan 14');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Inserts', 'Written', 'Pass', 'Jan 16');
INSERT INTO assessments (employee_id, module_id, station_id, type, result, date) VALUES ('emp_004', NULL, 'Washing', 'Practical', 'Pass', 'Mar 5');

-- violations
INSERT INTO violations (employee_id, type, date, note) VALUES ('emp_001', 'PPE Violation', '2026-01-15', 'Missing hairnet at harvest line');
INSERT INTO violations (employee_id, type, date, note) VALUES ('emp_002', 'Late Arrival', '2026-04-25', '15 minutes — traffic');

-- requests
INSERT INTO requests (employee_id, type, station_id, status) VALUES ('emp_001', 'Practical Assessment', 'Washing', 'pending');

-- training_sessions
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_003', 'Maria Santos', 'Packaging', 'Aug 10');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_003', 'Diego Reyes', 'Harvest', 'Oct 5');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_003', 'Leo C.', 'Seeding', 'Nov 20');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_003', 'Hana M.', 'Inserts', 'Jan 15');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_003', 'Alex T.', 'Packaging', 'Apr 28');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Maria Santos', 'Packaging', 'Nov 5');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Leo C.', 'Harvest', 'Dec 12');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Hana M.', 'Seeding', 'Feb 8');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Darius W.', 'Harvest', 'Mar 20');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Sofia R.', 'Packaging', 'Apr 10');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Marcus T.', 'Inserts', 'Apr 22');
INSERT INTO training_sessions (trainer_id, trainee_name, station_id, date) VALUES ('emp_004', 'Jamie Chen', 'Seeding', 'May 2');

-- shifts_led
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_003', 'Feb 10', 'Harvest', 'Full morning shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_003', 'Feb 24', 'Packaging', 'Full shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_003', 'Mar 18', 'Harvest', 'Morning + crossover lead');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Oct 8', 'Harvest', 'Full morning shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Oct 22', 'Packaging', 'Covered for Priya');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Nov 14', 'Harvest', 'Full shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Dec 3', 'Harvest', 'Morning + Packing crossover');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Jan 10', 'Seeding', 'Full shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Feb 20', 'Harvest', 'Full shift + EOD report');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Mar 28', 'Packaging', 'Full shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'Apr 14', 'Harvest', 'Full shift');
INSERT INTO shifts_led (employee_id, date, station_id, note) VALUES ('emp_004', 'May 5', 'Harvest', 'Full shift + new hire debrief');

-- corrective_actions
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'Late Arrival', 'Oct 18', 'Documented and addressed');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'PPE Violation', 'Nov 5', 'Glove policy — coaching done');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'Late Arrival', 'Dec 9', 'Second occurrence, written warning');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'Long Break', 'Jan 22', 'Documented');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'Late Arrival', 'Feb 14', 'Coaching session completed');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'PPE Violation', 'Mar 30', 'Coaching done');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'Long Break', 'Apr 8', 'Second occurrence — written');
INSERT INTO corrective_actions (supervisor_id, subject_name, type, date, note) VALUES ('emp_004', 'Unknown', 'Late Arrival', 'May 1', 'Documented and addressed');
