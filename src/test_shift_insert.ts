import { db } from './db';
import { sql } from 'drizzle-orm';

async function test() {
  try {
    const ordRes = await db.execute(sql`SELECT id, plant_id, line_id, order_number FROM public.production_orders WHERE order_number = 'CO-7' LIMIT 1`);
    const rows = (ordRes as any)?.rows || [];
    console.log("Order CO-7:", rows[0]);
    const ord = rows[0];

    const insRes = await db.execute(sql`
      INSERT INTO public.shift_logs (
        tenant_id, plant_id, line_id, order_id, shift_code, hour_window, operator_id, good_units_produced, scrap_units_produced, logged_at
      ) VALUES (
        'aa3183d2-709b-42a8-add1-b2e4b2d873b0',
        ${ord.plant_id || 'bead41e2-b735-41b8-bd00-bdba1682fb6a'},
        ${ord.line_id || '32b55dde-97ca-4801-926f-3169d27e1ffb'},
        ${ord.id},
        'Shift A (Day)',
        '10:00 - 11:00',
        'cf3c7dac-b8a0-4751-927c-1793206d2001',
        100,
        5,
        NOW()
      )
    `);
    console.log("INS RES:", insRes);

    const checkRes = await db.execute(sql`SELECT * FROM public.shift_logs WHERE order_id = ${ord.id} ORDER BY logged_at DESC`);
    console.log("FETCHED SHIFT LOGS FOR CO-7:", (checkRes as any)?.rows);

  } catch(e: any) {
    console.error("TEST FAILED:", e.message);
  }
}

test();
