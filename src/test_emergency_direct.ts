import { dashboardsService } from './modules/dashboards/dashboards.service.js';
import pg from 'pg';
const { Pool } = pg;

async function testEmergencyDirect() {
  console.log('Testing triggerEmergencyCall...');
  try {
    const res = await dashboardsService.triggerEmergencyCall('5bce8458-909a-4dd2-b221-614c32ac7c89', {
      hazardType: 'Electrical Short / Smoke Anomaly'
    });
    console.log('Service result:', res);
  } catch (err: any) {
    console.error('Service error:', err.message);
  }

  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  const checkSig = await pool.query("SELECT * FROM public.digital_signatures WHERE entity_type = 'EMERGENCY_MAINTENANCE_CALL' ORDER BY signed_at DESC");
  console.log('digital_signatures rows count:', checkSig.rows.length);
  console.log('digital_signatures rows:', checkSig.rows);

  const checkExc = await pool.query("SELECT * FROM public.exceptions WHERE module = 'SAFETY' ORDER BY reported_at DESC");
  console.log('exceptions SAFETY rows count:', checkExc.rows.length);
  console.log('exceptions SAFETY rows:', checkExc.rows);

  await pool.end();
}

testEmergencyDirect();
