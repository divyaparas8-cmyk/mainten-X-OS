import fetch from 'node-fetch';

async function test() {
  const endpoints = [
    '/api/v1/master-data/lines',
    '/api/v1/master-data/work-centers',
    '/api/v1/master-data/boms',
    '/api/v1/master-data/skus',
    '/api/v1/master-data/departments',
    '/api/v1/master-data/companies',
    '/api/v1/master-data/plants'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:4000' + ep);
      const json = await res.json();
      console.log(`Endpoint: ${ep} | Status: ${res.status} | Data length: ${Array.isArray(json?.data) ? json.data.length : 'not array'}`);
    } catch (e) {
      console.log(`Endpoint: ${ep} | Error: ${e.message}`);
    }
  }
}

test();
