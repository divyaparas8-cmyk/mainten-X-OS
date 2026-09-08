import { db } from "../config/database.js";
import { tenants } from "../db/schema/tenants.js";
import { plants } from "../db/schema/tenants.js";
import { users } from "../db/schema/users.js";
import { skus, productionLines, workCenters, assets } from "../db/schema/masterData.js";
import { productionService } from "../modules/production/production.service.js";
import { qualityService } from "../modules/quality/quality.service.js";
import { warehouseService } from "../modules/warehouse/warehouse.service.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { planningService } from "../modules/planning/planning.service.js";

async function runAutonomousWorkflow() {
  console.log("================================================================");
  console.log("🚀 MAINTENX OS AUTONOMOUS FULL-STACK WORKFLOW VERIFICATION");
  console.log("================================================================");

  // 1. Context Resolution
  const [tenant] = await db.select().from(tenants).limit(1);
  const [plant] = await db.select().from(plants).limit(1);
  const [user] = await db.select().from(users).limit(1);
  const [sku] = await db.select().from(skus).limit(1);
  const [line] = await db.select().from(productionLines).limit(1);
  const [asset] = await db.select().from(assets).limit(1);

  if (!tenant || !plant || !user || !sku || !line || !asset) {
    throw new Error("Missing required master data for workflow execution");
  }

  console.log(`\n[STEP 1: TENANT & FACILITY CONTEXT]`);
  console.log(`Tenant: ${tenant.name} (${tenant.id})`);
  console.log(`Plant: ${plant.name} (${plant.id})`);
  console.log(`User: ${user.firstName} ${user.lastName} (${user.id})`);

  // 2. Planning Demand Creation
  console.log(`\n[STEP 2: PLANNING & DEMAND]`);
  const orderNumber = `ORD-DEMAND-${Math.floor(1000 + Math.random() * 9000)}`;
  const demandOrder = await planningService.createCustomerOrder(tenant.id, plant.id, {
    orderNumber,
    customerName: "Global Beverage Distributors Inc",
    skuId: sku.id,
    quantity: 5000,
    requestedDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    priority: "URGENT",
  });
  console.log(`✅ Customer Demand Order Created: #${demandOrder.orderNumber} (Qty: 5000)`);

  const mrpExplosion = await planningService.runMrpExplosion(tenant.id, plant.id);
  console.log(`✅ MRP Net Requirements Calculated: ${mrpExplosion.length} item requirements evaluated`);

  // 3. Production Execution (MES & eBR)
  console.log(`\n[STEP 3: PRODUCTION EXECUTION & eBR]`);
  const prodOrderNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const { order: prodOrder, batch } = await productionService.createOrder(tenant.id, plant.id, {
    orderNumber: prodOrderNumber,
    skuId: sku.id,
    lineId: line.id,
    targetQuantity: 5000,
    plannedStart: new Date().toISOString(),
    plannedEnd: new Date(Date.now() + 86400000).toISOString(),
    priority: "URGENT",
    notes: "Full-Stack Autonomous End-to-End Verification Run",
  });
  console.log(`✅ Production Order Dispatched: #${prodOrder.orderNumber}`);
  console.log(`✅ eBR Batch Initialized: #${batch.batchNumber} (Target: 5000)`);

  // Advance Batch Step
  await productionService.advanceBatchStep(tenant.id, batch.id, {
    stepNumber: 1,
    parameters: { scannedBarcode: sku.barcode, tareWeightKg: 45.2 },
    notes: "Raw Material Lot Scan & Verification completed",
  }, user.id);
  console.log(`✅ eBR Step 1 Completed: Raw Material Lot Scan & Verification`);

  // 4. In-Process Quality Assurance (CCP)
  console.log(`\n[STEP 4: IN-PROCESS QUALITY ASSURANCE]`);
  const ccp = await qualityService.recordCcpCheck(tenant.id, plant.id, {
    lineId: line.id,
    batchId: batch.id,
    ccpCode: "CCP-1",
    ccpName: "Pasteurizer Thermal Kill Temperature (≥83.1°C)",
    targetValue: 84.5,
    actualValue: 84.8,
    criticalLimitMin: 83.1,
    criticalLimitMax: 90.0,
    uom: "°C",
    notes: "Thermal sterilization target verified within safe zone",
  }, user.id);
  console.log(`✅ CCP Check Recorded: ${ccp.ccpName} ➔ Result: ${ccp.status} (${ccp.actualValue}${ccp.uom})`);

  // 5. Warehouse Movement & Transactions
  console.log(`\n[STEP 5: WAREHOUSE & INVENTORY MOVEMENTS]`);
  const newLotNumber = `LOT-PROD-${Math.floor(10000 + Math.random() * 90000)}`;
  const newLot = await warehouseService.createLot(tenant.id, plant.id, {
    skuId: sku.id,
    lotNumber: newLotNumber,
    lotType: "FINISHED_GOOD",
    supplierName: "MaintenX Internal Production",
    initialQuantity: 5000,
    uom: "Units",
  });
  console.log(`✅ Inventory Lot Ingested: #${newLot.lotNumber} (Initial Qty: 5000)`);

  const tx = await warehouseService.recordTransaction(tenant.id, plant.id, {
    lotId: newLot.id,
    type: "TRANSFER",
    quantity: 5000,
    uom: "Units",
    referenceType: "PRODUCTION_ORDER",
    referenceId: prodOrder.orderNumber,
    notes: "Full production output transferred from Line 1 packaging dock to ambient racks",
  }, user.id);
  console.log(`✅ Warehouse Stock Movement Recorded: [${tx.type}] 5000 Units`);

  // 6. Maintenance Work Order Execution
  console.log(`\n[STEP 6: CMMS & ASSET RELIABILITY]`);
  const workOrder = await maintenanceService.createWorkOrder(tenant.id, plant.id, {
    assetId: asset.id,
    title: "Routine Inline Sensor Calibration & O-Ring Lubrication",
    type: "PREVENTIVE",
    priority: "MEDIUM",
    estimatedHours: 1.5,
    assignedTo: user.id,
    description: "Automated test routine validation",
  }, user.id);
  console.log(`✅ Maintenance Work Order Created: #${workOrder.woNumber} (Asset: ${asset.name})`);

  const updatedWo = await maintenanceService.updateWorkOrderStatus(tenant.id, workOrder.id, { status: "COMPLETED" });
  console.log(`✅ Work Order Status Advanced: #${updatedWo.woNumber} ➔ ${updatedWo.status}`);

  console.log("\n================================================================");
  console.log("🎉 ALL MANUFACTURING WORKFLOWS COMPLETED WITH 100% SUCCESS!");
  console.log("================================================================");
  process.exit(0);
}

runAutonomousWorkflow().catch((err) => {
  console.error("❌ Autonomous workflow error:", err);
  process.exit(1);
});
