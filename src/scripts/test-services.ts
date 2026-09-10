import { db, pool } from "../config/database.js";
import { tenants } from "../db/schema/tenants.js";
import { productionService } from "../modules/production/production.service.js";
import { qualityService } from "../modules/quality/quality.service.js";
import { warehouseService } from "../modules/warehouse/warehouse.service.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";

async function testAllServices() {
  console.log("=== TESTING ALL CORE SERVICES WITH REAL POSTGRESQL DATA ===");

  const [t] = await db.select().from(tenants).limit(1);
  if (!t) {
    console.error("❌ No tenant found in DB!");
    return;
  }
  console.log(`Tenant: ${t.name} (ID: ${t.id})`);

  // 1. Production Orders
  try {
    const orders = await productionService.listOrders(t.id);
    console.log(`✅ productionService.listOrders: SUCCESS (${orders.length} orders found)`);
    if (orders.length > 0) {
      console.log(`   Sample: Order #${orders[0].orderNumber} (SKU: ${orders[0].sku?.skuCode})`);
    }
  } catch (err: any) {
    console.error(`❌ productionService.listOrders FAILED:`, err.message);
  }

  // 2. Production Batches
  try {
    const batches = await productionService.listBatches(t.id);
    console.log(`✅ productionService.listBatches: SUCCESS (${batches.length} batches found)`);
    if (batches.length > 0) {
      console.log(`   Sample: Batch #${batches[0].batchNumber} (Status: ${batches[0].status})`);
    }
  } catch (err: any) {
    console.error(`❌ productionService.listBatches FAILED:`, err.message);
  }

  // 3. QA Release Queue
  try {
    const queue = await qualityService.listQaReleaseQueue(t.id);
    console.log(`✅ qualityService.listQaReleaseQueue: SUCCESS (${queue.length} batches in QA queue)`);
  } catch (err: any) {
    console.error(`❌ qualityService.listQaReleaseQueue FAILED:`, err.message);
  }

  // 4. Warehouse Lots
  try {
    const lots = await warehouseService.listLots(t.id);
    console.log(`✅ warehouseService.listLots: SUCCESS (${lots.length} lots found)`);
    if (lots.length > 0) {
      console.log(`   Sample: Lot #${lots[0].lotNumber} (SKU: ${(lots[0] as any).sku?.skuCode || (lots[0] as any).skuId})`);
    }
  } catch (err: any) {
    console.error(`❌ warehouseService.listLots FAILED:`, err.message);
  }

  // 5. Warehouse Transactions
  try {
    const txs = await warehouseService.listTransactions(t.id);
    console.log(`✅ warehouseService.listTransactions: SUCCESS (${txs.length} transactions found)`);
  } catch (err: any) {
    console.error(`❌ warehouseService.listTransactions FAILED:`, err.message);
  }

  // 6. Maintenance Work Orders
  try {
    const wos = await maintenanceService.listWorkOrders(t.id);
    console.log(`✅ maintenanceService.listWorkOrders: SUCCESS (${wos.length} work orders found)`);
    if (wos.length > 0) {
      console.log(`   Sample: WO #${wos[0].woNumber} (Title: ${wos[0].title})`);
    }
  } catch (err: any) {
    console.error(`❌ maintenanceService.listWorkOrders FAILED:`, err.message);
  }

  await pool.end();
}

testAllServices().catch(console.error);
