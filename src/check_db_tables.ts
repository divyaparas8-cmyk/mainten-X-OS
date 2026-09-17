import fs from 'fs';
import pg from 'pg';
import path from 'path';

const { Pool } = pg;

async function run() {
  const filePath = path.join(process.cwd(), '..', 'maintenx-os 4');
  console.log('Checking file:', filePath);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log('File Size:', stats.size, 'bytes');
    
    // Read first 200 bytes
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(200);
    fs.readSync(fd, buffer, 0, 200, 0);
    fs.closeSync(fd);
    
    console.log('Is PGDMP header:', buffer.toString('utf8', 0, 5) === 'PGDMP');
    console.log('First 200 chars:', buffer.toString('utf8', 0, 200).replace(/\0/g, ' '));
  } else {
    console.log('File not found!');
  }

  // Also check database `maintenx-os` and `maintenxos`
  const poolPostgres = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/postgres'
  });
  
  try {
    const dbs = await poolPostgres.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log('Available Postgres Databases:', dbs.rows.map((r: any) => r.datname));
  } catch (err: any) {
    console.error('Error listing DBs:', err.message);
  }
  await poolPostgres.end();
}

run();
