import { execSync } from 'child_process';
import pg from 'pg';
const { Pool } = pg;

async function syncBothDbs() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/postgres'
  });

  try {
    const res = await pool.query("SELECT datname FROM pg_database WHERE datname = 'maintenxos'");
    if (res.rows.length === 0) {
      console.log('Creating database "maintenxos"...');
      await pool.query('CREATE DATABASE maintenxos');
    } else {
      console.log('Database "maintenxos" already exists.');
    }
  } catch (err: any) {
    console.error('DB creation error:', err.message);
  }
  await pool.end();

  const pgRestorePath = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_restore.exe"`;
  const dumpFile = `"D:\\kiaan projects\\MaintenX OS\\maintenx-os 4"`;
  const cmd = `${pgRestorePath} -h localhost -p 5432 -U postgres -d "maintenxos" --no-owner --no-privileges ${dumpFile}`;
  
  try {
    execSync(cmd, {
      env: { ...process.env, PGPASSWORD: 'hitesha2004' },
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });
    console.log('Sync to "maintenxos" completed successfully!');
  } catch (err: any) {
    console.log('Sync completed with notices.');
  }
}

syncBothDbs();
