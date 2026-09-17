import { db } from './db';
import { sql } from 'drizzle-orm';

async function test() {
  try {
    const res = await db.execute(sql`
      INSERT INTO public.downtime_logs (
        tenant_id, plant_id, line_id, asset_id, category, reason_code, duration_minutes, comments, start_time, created_at
      ) VALUES (
        'aa3183d2-709b-42a8-add1-b2e4b2d873b0',
        'bead41e2-b735-41b8-bd00-bdba1682fb6a',
        'f6700749-b839-4730-9bcb-4ff22decfd6c',
        'e6807d29-37e2-4d5f-a331-734bc8aae1ba',
        'Cleaning / Sanitation',
        'Cleaning / Sanitation',
        15,
        'Testing live downtime insert',
        NOW(),
        NOW()
      )
    `);
    console.log("INSERT DOWNTIME SUCCESS:", res);

    const checkRes = await db.execute(sql`SELECT * FROM public.downtime_logs ORDER BY created_at DESC LIMIT 5`);
    console.log("ALL DOWNTIME LOGS IN DB:", (checkRes as any)?.rows);
  } catch(e: any) {
    console.error("DOWNTIME TEST ERROR:", e.message);
  }
}

test();
