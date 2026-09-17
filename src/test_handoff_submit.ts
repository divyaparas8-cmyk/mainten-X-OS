import http from 'http';
import pg from 'pg';
const { Pool } = pg;

async function testHandoffSubmit() {
  const postData = JSON.stringify({
    shiftFrom: 'Shift A (Day - 06:00 - 14:30)',
    shiftTo: 'Shift B (Evening - 14:30 - 23:00)',
    receivedBy: 'Carlos Mendez',
    notes: 'Line 1 running smoothly. All quality CCP checks passed.',
    pin: '1234'
  });

  const req = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/dashboards/operator/shift-handoff/submit',
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

      const checkHandoff = await pool.query('SELECT * FROM public.pm_shift_handoffs ORDER BY created_at DESC LIMIT 5');
      console.log('DB pm_shift_handoffs count:', checkHandoff.rows.length);
      console.log('Latest pm_shift_handoff:', checkHandoff.rows[0]);

      const checkSig = await pool.query("SELECT * FROM public.digital_signatures WHERE entity_type = 'SHIFT_HANDOFF' ORDER BY signed_at DESC LIMIT 5");
      console.log('DB digital_signatures count:', checkSig.rows.length);
      console.log('Latest digital_signature row:', checkSig.rows[0]);

      await pool.end();
    });
  });

  req.on('error', (err) => console.error('Req error:', err.message));
  req.write(postData);
  req.end();
}

testHandoffSubmit();
