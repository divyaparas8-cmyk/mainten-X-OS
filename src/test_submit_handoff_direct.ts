import { dashboardsService } from './modules/dashboards/dashboards.service.js';
import pg from 'pg';
const { Pool } = pg;

async function testSubmitHandoffDirect() {
  console.log('Testing submitShiftHandoff direct call...');
  try {
    const res = await dashboardsService.submitShiftHandoff('5bce8458-909a-4dd2-b221-614c32ac7c89', {
      shiftFrom: 'Shift A (Day)',
      shiftTo: 'Shift B (Evening)',
      receivedBy: 'Carlos Mendez',
      notes: 'Direct test notes for handoff'
    });
    console.log('Result:', res);
  } catch (err: any) {
    console.error('Error:', err.message);
  }

  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  const checkHandoff = await pool.query('SELECT * FROM public.pm_shift_handoffs ORDER BY created_at DESC LIMIT 5');
  console.log('DB pm_shift_handoffs rows count:', checkHandoff.rows.length);
  console.log('Latest pm_shift_handoff:', checkHandoff.rows[0]);

  const checkSig = await pool.query("SELECT * FROM public.digital_signatures WHERE entity_type = 'SHIFT_HANDOFF' ORDER BY signed_at DESC LIMIT 5");
  console.log('DB digital_signatures rows count:', checkSig.rows.length);
  console.log('Latest digital_signature row:', checkSig.rows[0]);

  await pool.end();
}

testSubmitHandoffDirect();
