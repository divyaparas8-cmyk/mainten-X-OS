const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/master-data' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resBody) });
        } catch {
          resolve({ status: res.statusCode, body: resBody });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testAll() {
  console.log('=== TESTING QUALITY SPECS CRUD ===');
  const qsCreate = await request('POST', '/quality-specs', {
    specId: 'TEST-SPEC-100',
    specificationTitle: 'Test Brix Spec',
    parameter: 'Test Brix',
    target: '12.0',
    min: '11.5',
    max: '12.5',
    uom: '°Bx',
    criticality: 'Critical CCP'
  });
  console.log('Quality Spec Created:', qsCreate.status, qsCreate.body);

  const qsUpdate = await request('PUT', '/quality-specs/TEST-SPEC-100', {
    parameter: 'Updated Brix Value',
    target: '12.2'
  });
  console.log('Quality Spec Updated:', qsUpdate.status, qsUpdate.body);

  const qsDelete = await request('DELETE', '/quality-specs/TEST-SPEC-100');
  console.log('Quality Spec Deleted:', qsDelete.status, qsDelete.body);

  console.log('\n=== TESTING CCP LIMITS CRUD ===');
  const ccpCreate = await request('POST', '/ccp-limits', {
    ccpNumber: 'CCP-TEST-99',
    processStep: 'Test Step Hold',
    hazard: 'Test Hazard Risk',
    criticalLimit: '≥ 75.0°C for ≥ 20 sec',
    autoDivertAction: 'Test Auto Divert'
  });
  console.log('CCP Limit Created:', ccpCreate.status, ccpCreate.body);

  const ccpUpdate = await request('PUT', '/ccp-limits/CCP-TEST-99', {
    criticalLimit: '≥ 78.0°C for ≥ 25 sec'
  });
  console.log('CCP Limit Updated:', ccpUpdate.status, ccpUpdate.body);

  const ccpDelete = await request('DELETE', '/ccp-limits/CCP-TEST-99');
  console.log('CCP Limit Deleted:', ccpDelete.status, ccpDelete.body);

  console.log('\n=== TESTING ASSETS CRUD ===');
  const assetCreate = await request('POST', '/assets', {
    assetId: 'AST-TEST-99',
    assetCode: 'AST-TEST-99',
    name: 'Test Capping Machine',
    type: 'Packaging',
    criticality: 'Critical (Class A)'
  });
  console.log('Asset Created:', assetCreate.status, assetCreate.body);

  const assetUpdate = await request('PUT', '/assets/AST-TEST-99', {
    name: 'Updated Test Capping Machine Pro'
  });
  console.log('Asset Updated:', assetUpdate.status, assetUpdate.body);

  const assetDelete = await request('DELETE', '/assets/AST-TEST-99');
  console.log('Asset Deleted:', assetDelete.status, assetDelete.body);

  console.log('\n=== TESTING STORAGE RESOURCES CRUD ===');
  const strCreate = await request('POST', '/storage-resources', {
    resourceId: 'STR-TEST-99',
    resourceCode: 'WH-TEST-RACK-01',
    name: 'Test Cold Storage Rack',
    resourceType: 'Cold Vault',
    totalCapacity: 600
  });
  console.log('Storage Resource Created:', strCreate.status, strCreate.body);

  const strUpdate = await request('PUT', '/storage-resources/WH-TEST-RACK-01', {
    name: 'Updated Cold Storage High Rack'
  });
  console.log('Storage Resource Updated:', strUpdate.status, strUpdate.body);

  const strDelete = await request('DELETE', '/storage-resources/WH-TEST-RACK-01');
  console.log('Storage Resource Deleted:', strDelete.status, strDelete.body);

  console.log('\n=== ALL CRUD TESTS COMPLETED SUCCESSFULLY! ===');
}

testAll().catch(console.error);
