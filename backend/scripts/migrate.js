require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const SQL_DIR = path.join(__dirname, '../../db');

async function run() {
  // Demo employees (fictional people, invented data) are opt-in so a
  // production migrate can never create fake records:
  //   SEED_DEMO=true npm run migrate
  const files = ['001_initial_schema.sql', '002_reference_data.sql'];
  if (process.env.SEED_DEMO === 'true') {
    files.push('003_demo_employees.sql');
  } else {
    console.log('Skipping 003_demo_employees.sql (set SEED_DEMO=true to seed demo employees).');
  }

  for (const file of files) {
    const filePath = path.join(SQL_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing: ${filePath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running ${file}...`);
    try {
      await pool.query(sql);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      process.exit(1);
    }
  }

  await pool.end();
  console.log('Migration complete.');
}

run();
