import { db } from './config/database.js';
import { sql } from 'drizzle-orm';
import pg from 'pg';
const { Pool } = pg;

async function testDrizzleInsert() {
  const validTenant = '5bce8458-909a-4dd2-b221-614c32ac7c89';
  const validPlant = '83c90534-4761-495c-b2bf-6a61de2260c4';
  const validUser = 'a3b5fb9c-3d44-47e9-ad80-c6e630d6bde6';
  const ticketId = 'EXC-EMG-TEST';

  try {
    console.log('Attempting Drizzle insert into digital_signatures...');
    const result = await db.execute(sql`
      INSERT INTO public.digital_signatures (tenant_id, plant_id, user_id, entity_type, entity_id, meaning, comments, signed_at)
      VALUES (
        ${validTenant}, 
        ${validPlant}, 
        ${validUser}, 
        'EMERGENCY_MAINTENANCE_CALL', 
        ${ticketId}, 
        'EMERGENCY_PAGER_BROADCAST', 
        ${'Electrical Short / Smoke Anomaly'}, 
        NOW()
      )
    `);
    console.log('Drizzle insert SUCCESS:', result);
  } catch (err: any) {
    console.error('Drizzle insert FAILED:', err.message);
  }

  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });
  const check = await pool.query("SELECT * FROM public.digital_signatures WHERE entity_type = 'EMERGENCY_MAINTENANCE_CALL'");
  console.log('DB digital_signatures rows:', check.rows);
  await pool.end();
}

testDrizzleInsert();
