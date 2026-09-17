import http from 'http';

const postData = JSON.stringify({
  issueType: 'Raw material stockout',
  assetId: 'd5faccf1-9abf-40e2-93cf-59bf0d0c9091',
  severity: 'P3',
  description: 'Capper cap feed line low inventory alert'
});

const req = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/dashboards/operator/report-issue/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('POST Submit Response:', JSON.parse(body)));
});

req.on('error', (err) => console.error('Req error:', err.message));
req.write(postData);
req.end();
