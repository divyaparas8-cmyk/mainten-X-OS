import { dashboardsService } from './modules/dashboards/dashboards.service.js';
import pg from 'pg';
const { Pool } = pg;

async function testSubmitDirect() {
  console.log('Testing direct submitReportIssue call...');
  const res = await dashboardsService.submitReportIssue('5bce8458-909a-4dd2-b221-614c32ac7c89', {
    issueType: 'Raw material stockout',
    assetId: 'CP-102',
    severity: 'P3',
    description: 'Direct call test for DB verification'
  });
  console.log('Service result:', res);

  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  const check1 = await pool.query('SELECT * FROM public.exceptions ORDER BY reported_at DESC LIMIT 5');
  console.log('public.exceptions rows count:', check1.rows.length);
  console.log('public.exceptions rows:', check1.rows);

  const check2 = await pool.query('SELECT * FROM public.pm_exceptions ORDER BY created_at DESC LIMIT 5');
  console.log('public.pm_exceptions rows count:', check2.rows.length);
  console.log('latest pm_exceptions row:', check2.rows[0]);

  await pool.end();
}

testSubmitDirect();
