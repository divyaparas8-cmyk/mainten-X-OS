import http from 'http';
import pg from 'pg';
const { Pool } = pg;

async function testFullEmergency() {
  const postData = JSON.stringify({
    hazardType: 'Electrical Short / Smoke Anomaly'
  });

  const req = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/dashboards/operator/report-issue/emergency-call',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', async () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('HTTP Response:', body);

      const pool = new Pool({
        connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
      });

      const checkSig = await pool.query("SELECT * FROM public.digital_signatures WHERE entity_type = 'EMERGENCY_MAINTENANCE_CALL' ORDER BY signed_at DESC");
      console.log('DB digital_signatures row count:', checkSig.rows.length);
      console.log('Latest digital_signature row:', checkSig.rows[0]);

      await pool.end();
    });
  });

  req.on('error', (err) => console.error('Request Error:', err.message));
  req.write(postData);
  req.end();
}

testFullEmergency();
