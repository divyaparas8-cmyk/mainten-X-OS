import http from 'http';

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
  res.on('end', () => console.log('POST Emergency Call Response:', JSON.parse(body)));
});

req.on('error', (err) => console.error('Req error:', err.message));
req.write(postData);
req.end();
