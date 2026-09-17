import http from 'http';

http.get('http://localhost:4000/api/v1/dashboards/operator/report-issue', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', data);
  });
}).on('error', (err) => console.error('Request error:', err.message));
