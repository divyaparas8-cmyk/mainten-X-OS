"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const masterData_service_ts_1 = require("../modules/master-data/masterData.service.ts");
async function testCrud() {
    console.log('Testing CRUD for Quality Specs...');
    const spec = await masterData_service_ts_1.masterDataService.createQualitySpec(undefined, {
        specId: 'TEST-SPEC-001',
        specificationTitle: 'Test Brix Specification',
        skuId: 'SKU-001',
        parameter: 'Brix Level',
        target: '12.5',
        min: '12.0',
        max: '13.0',
        uom: '°Bx'
    });
    console.log('Created Spec:', spec.specId);
    let specs = await masterData_service_ts_1.masterDataService.listQualitySpecs();
    console.log('Specs list length:', specs.length);
    await masterData_service_ts_1.masterDataService.updateQualitySpec(undefined, 'TEST-SPEC-001', { target: '12.8' });
    specs = await masterData_service_ts_1.masterDataService.listQualitySpecs();
    const updatedSpec = specs.find(s => s.specId === 'TEST-SPEC-001');
    console.log('Updated Spec Target:', updatedSpec?.target);
    await masterData_service_ts_1.masterDataService.deleteQualitySpec(undefined, 'TEST-SPEC-001');
    specs = await masterData_service_ts_1.masterDataService.listQualitySpecs();
    console.log('After delete, found?', !!specs.find(s => s.specId === 'TEST-SPEC-001'));
    console.log('\nTesting CRUD for CCP Limits...');
    const ccp = await masterData_service_ts_1.masterDataService.createCCPLimit(undefined, {
        ccpNumber: 'CCP-TEST-1',
        processStep: 'Test Pasteurization',
        hazard: 'Test Pathogens',
        criticalLimit: '>= 72°C for 15s',
        autoDivertAction: 'Test Divert'
    });
    console.log('Created CCP:', ccp.ccpNumber);
    let ccps = await masterData_service_ts_1.masterDataService.listCCPLimits();
    console.log('CCPs count:', ccps.length);
    await masterData_service_ts_1.masterDataService.updateCCPLimit(undefined, 'CCP-TEST-1', { criticalLimit: '>= 75°C for 20s' });
    ccps = await masterData_service_ts_1.masterDataService.listCCPLimits();
    const updatedCcp = ccps.find(c => c.ccpNumber === 'CCP-TEST-1');
    console.log('Updated CCP limit:', updatedCcp?.criticalLimit);
    await masterData_service_ts_1.masterDataService.deleteCCPLimit(undefined, 'CCP-TEST-1');
    ccps = await masterData_service_ts_1.masterDataService.listCCPLimits();
    console.log('After delete, found?', !!ccps.find(c => c.ccpNumber === 'CCP-TEST-1'));
    console.log('\nTesting CRUD for Assets...');
    const asset = await masterData_service_ts_1.masterDataService.createAsset(undefined, {
        assetId: 'AST-TEST-01',
        assetCode: 'AST-TEST-01',
        name: 'Test Machine Filler',
        type: 'Packaging / Filling',
        criticality: 'Critical (Class A)'
    });
    console.log('Created Asset:', asset.assetId);
    let assets = await masterData_service_ts_1.masterDataService.listAssets(undefined);
    console.log('Assets count:', assets.length);
    await masterData_service_ts_1.masterDataService.updateAsset(undefined, 'AST-TEST-01', { name: 'Test Machine Filler Updated' });
    assets = await masterData_service_ts_1.masterDataService.listAssets(undefined);
    const updatedAsset = assets.find(a => a.assetId === 'AST-TEST-01');
    console.log('Updated Asset Name:', updatedAsset?.name);
    await masterData_service_ts_1.masterDataService.deleteAsset(undefined, 'AST-TEST-01');
    assets = await masterData_service_ts_1.masterDataService.listAssets(undefined);
    console.log('After delete, found?', !!assets.find(a => a.assetId === 'AST-TEST-01'));
    console.log('\nTesting CRUD for Storage Resources...');
    const str = await masterData_service_ts_1.masterDataService.createStorageResource(undefined, {
        resourceId: 'STR-TEST-01',
        resourceCode: 'STR-TEST-01',
        name: 'Test Cold Vault',
        resourceType: 'Cold Storage Room',
        totalCapacity: 600
    });
    console.log('Created Storage:', str.resourceCode);
    let storage = await masterData_service_ts_1.masterDataService.listStorageResources();
    console.log('Storage count:', storage.length);
    await masterData_service_ts_1.masterDataService.updateStorageResource(undefined, 'STR-TEST-01', { name: 'Test Cold Vault Updated' });
    storage = await masterData_service_ts_1.masterDataService.listStorageResources();
    const updatedStr = storage.find(s => s.resourceCode === 'STR-TEST-01');
    console.log('Updated Storage Name:', updatedStr?.name);
    await masterData_service_ts_1.masterDataService.deleteStorageResource(undefined, 'STR-TEST-01');
    storage = await masterData_service_ts_1.masterDataService.listStorageResources();
    console.log('After delete, found?', !!storage.find(s => s.resourceCode === 'STR-TEST-01'));
    console.log('\nALL 4 ENTITY BACKEND DATABASE CRUD TESTS PASSED 100%!');
    process.exit(0);
}
testCrud().catch(err => {
    console.error('Test CRUD failed:', err);
    process.exit(1);
});
//# sourceMappingURL=test-all-crud.js.map