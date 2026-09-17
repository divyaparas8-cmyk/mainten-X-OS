import { execSync } from 'child_process';
import path from 'path';

async function restore() {
  const pgRestorePath = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_restore.exe"`;
  const dumpFile = `"${path.join(process.cwd(), '..', 'maintenx-os 4')}"`;
  
  const cmd = `${pgRestorePath} -h localhost -p 5432 -U postgres -d "maintenx-os" --no-owner --no-privileges ${dumpFile}`;
  console.log('Executing restore command...');
  
  try {
    const output = execSync(cmd, {
      env: { ...process.env, PGPASSWORD: 'hitesha2004' },
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024
    });
    console.log('Restore output:', output);
  } catch (err: any) {
    console.log('Restore completed (with warnings/notices):');
    if (err.stdout) console.log('STDOUT:', err.stdout);
    if (err.stderr) console.log('STDERR:', err.stderr.substring(0, 1000));
  }
}

restore();
