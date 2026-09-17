import pg from 'pg';
const { Pool } = pg;

async function checkTables() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Current tables in DB "maintenx-os":', res.rows.map(r => r.table_name));
    console.log('Total table count:', res.rows.length);
  } catch (err: any) {
    console.error('Error checking tables in maintenx-os:', err.message);
  }

  await pool.end();
}

checkTables();
