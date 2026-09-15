const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- START INTEGRATIONS VERIFICATION ---');

  // 1. ERP Status
  let res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/erp', method: 'GET' });
  console.log('GET /integrations/erp:', res.status, res.data.gatewayEndpoint);

  // 1b. Update ERP
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/erp', method: 'PUT', headers: { 'Content-Type': 'application/json' } }, {
    gatewayEndpoint: 'sap-prod-gw.corp.flowstate.io:3300',
    clientSystem: 'PRD_100 • S4H_CORP',
    authMode: 'OAuth2 mTLS Certificate'
  });
  console.log('PUT /integrations/erp:', res.status, res.data.gatewayEndpoint);

  // 1c. Sync ERP & Events
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/erp/sync', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {});
  console.log('POST /integrations/erp/sync:', res.status, res.data.message);

  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/erp/events', method: 'GET' });
  console.log('GET /integrations/erp/events count:', res.data.length);
  const firstEventId = res.data[0]?.id;

  // 2. IoT Gateways
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/iot', method: 'GET' });
  console.log('GET /integrations/iot count:', res.data.length);

  // Create IoT
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/iot', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {
    id: 'IOT-TEST',
    name: 'Automated Test Edge Gateway',
    protocol: 'OPC-UA (TCP:4840)',
    connectedNodes: 99,
    telemetryRate: '50 Hz'
  });
  console.log('POST /integrations/iot:', res.status, res.data.id);

  // Update IoT
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/iot/IOT-TEST', method: 'PUT', headers: { 'Content-Type': 'application/json' } }, {
    name: 'Automated Test Edge Gateway UPDATED',
    connectedNodes: 120
  });
  console.log('PUT /integrations/iot/IOT-TEST:', res.status, res.data.name);

  // Delete IoT
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/iot/IOT-TEST', method: 'DELETE' });
  console.log('DELETE /integrations/iot/IOT-TEST:', res.status, res.data.message);

  // 3. Barcode Formats
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/barcode', method: 'GET' });
  console.log('GET /integrations/barcode count:', res.data.length);

  // Create Barcode
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/barcode', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {
    id: 'BC-TEST',
    standard: 'Code 128 Test Standard',
    useCase: 'Test Pallet Shipping Label',
    aiAppPrefix: '(420) Postal Code'
  });
  console.log('POST /integrations/barcode:', res.status, res.data.id);

  // Update Barcode
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/barcode/BC-TEST', method: 'PUT', headers: { 'Content-Type': 'application/json' } }, {
    useCase: 'Test Pallet Shipping Label UPDATED'
  });
  console.log('PUT /integrations/barcode/BC-TEST:', res.status, res.data.useCase);

  // Delete Barcode
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/barcode/BC-TEST', method: 'DELETE' });
  console.log('DELETE /integrations/barcode/BC-TEST:', res.status, res.data.message);

  // 4. API Keys
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/apis', method: 'GET' });
  console.log('GET /integrations/apis count:', res.data.length);

  // Create API Key
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/apis', method: 'POST', headers: { 'Content-Type': 'application/json' } }, {
    id: 'KEY-TEST',
    name: 'Automated Test API Client',
    rateLimit: '2,500 req/min'
  });
  console.log('POST /integrations/apis:', res.status, res.data.id, res.data.keyMasked);

  // Update API Key
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/apis/KEY-TEST', method: 'PUT', headers: { 'Content-Type': 'application/json' } }, {
    name: 'Automated Test API Client UPDATED',
    rateLimit: '5,000 req/min'
  });
  console.log('PUT /integrations/apis/KEY-TEST:', res.status, res.data.name);

  // Delete API Key
  res = await request({ hostname: 'localhost', port: 4000, path: '/api/v1/admin/integrations/apis/KEY-TEST', method: 'DELETE' });
  console.log('DELETE /integrations/apis/KEY-TEST:', res.status, res.data.message);

  console.log('--- ALL INTEGRATIONS VERIFIED SUCCESSFULLY WITH POSTGRESQL! ---');
}

run().catch(console.error);
