import bcrypt from "bcryptjs";
import { db, pool } from "../config/database.js";
import {
  tenants,
  plants,
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,
  productFamilies,
  skus,
  boms,
  bomItems,
  workCenters,
  productionLines,
  shifts,
  assets,
  staff,
  qualitySpecs,
  customerOrders,
  productionOrders,
  batches,
  batchSteps,
  ccpChecks,
  inventoryLots,
  inventoryTransactions,
  workOrders,
  pmSchedules,
  spareParts,
  notifications,
} from "./schema/index.js";

export async function runDatabaseSeed() {
  console.log("🌱 Starting MaintenX OS Comprehensive Database Seed...");

  try {
    const passwordHash = await bcrypt.hash("Password@123", 10);
    const pinHash = await bcrypt.hash("1234", 10);

    // 1. Seed Tenant
    const [demoTenant] = await db
      .insert(tenants)
      .values({
        name: "BeverageCorp Manufacturing Global Ltd",
        slug: "beverage-corp",
        plan: "ENTERPRISE",
        status: "ACTIVE",
      })
      .returning();

    console.log(`✅ Tenant created: ${demoTenant.name}`);

    // 2. Seed Plants
    const [indorePlant] = await db
      .insert(plants)
      .values({
        tenantId: demoTenant.id,
        code: "INDORE-01",
        name: "Indore Mega Bottling & Canning Facility",
        city: "Indore",
        state: "Madhya Pradesh",
        country: "India",
        timezone: "Asia/Kolkata",
      })
      .returning();

    const [punePlant] = await db
      .insert(plants)
      .values({
        tenantId: demoTenant.id,
        code: "PUNE-02",
        name: "Pune Blending & Packaging Plant",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        timezone: "Asia/Kolkata",
      })
      .returning();

    console.log(`✅ Plants created: ${indorePlant.name}, ${punePlant.name}`);

    // 3. Seed Users
    const [plantManager] = await db
      .insert(users)
      .values({
        tenantId: demoTenant.id,
        email: "alexander.vance@maintenx.com",
        passwordHash,
        firstName: "Alexander",
        lastName: "Vance",
        digitalSignaturePinHash: pinHash,
        status: "ACTIVE",
      })
      .returning();

    const [planner] = await db
      .insert(users)
      .values({
        tenantId: demoTenant.id,
        email: "planner@maintenx.com",
        passwordHash,
        firstName: "Elena",
        lastName: "Rostova",
        digitalSignaturePinHash: pinHash,
        status: "ACTIVE",
      })
      .returning();

    const [qaLead] = await db
      .insert(users)
      .values({
        tenantId: demoTenant.id,
        email: "qa@maintenx.com",
        passwordHash,
        firstName: "Dr. Rachel",
        lastName: "Thorne",
        digitalSignaturePinHash: pinHash,
        status: "ACTIVE",
      })
      .returning();

    const [operator] = await db
      .insert(users)
      .values({
        tenantId: demoTenant.id,
        email: "operator@maintenx.com",
        passwordHash,
        firstName: "Marcus",
        lastName: "Chen",
        digitalSignaturePinHash: pinHash,
        status: "ACTIVE",
      })
      .returning();

    console.log(`✅ Users created: Plant Manager, Planner, QA Lead, Operator`);

    // 4. Seed Product Families & SKUs
    const [beverageFamily] = await db
      .insert(productFamilies)
      .values({
        tenantId: demoTenant.id,
        code: "CARB-BEV",
        name: "Sparkling & Carbonated Beverages",
      })
      .returning();

    const [citrusSku] = await db
      .insert(skus)
      .values({
        tenantId: demoTenant.id,
        skuCode: "SKU-5001",
        name: "500ml Sparkling Citrus Soda",
        category: "FINISHED_GOODS",
        familyId: beverageFamily.id,
        uom: "Units",
        barcode: "8901020304051",
        standardCost: "14.50",
      })
      .returning();

    const [orangeJuiceRaw] = await db
      .insert(skus)
      .values({
        tenantId: demoTenant.id,
        skuCode: "RM-ORG-101",
        name: "Valencia Organic Orange Juice Concentrate 65° Brix",
        category: "RAW_MATERIAL",
        uom: "Liters",
        barcode: "LOT-RM-ORG-4402",
        standardCost: "85.00",
      })
      .returning();

    const [aluminumCan] = await db
      .insert(skus)
      .values({
        tenantId: demoTenant.id,
        skuCode: "PKG-CAN-330",
        name: "330ml Slimline Aluminum Beverage Cans",
        category: "PACKAGING",
        uom: "Can",
        barcode: "LOT-CAN-ALU-9912",
        standardCost: "3.20",
      })
      .returning();

    console.log(`✅ Master SKUs & Packaging created`);

    // 5. Seed Production Line & Work Center
    const [wc1] = await db
      .insert(workCenters)
      .values({
        tenantId: demoTenant.id,
        plantId: indorePlant.id,
        code: "WC-BOT-01",
        name: "High-Speed Bottling & Formulation Bay 1",
        category: "BOTTLING",
      })
      .returning();

    const [line1] = await db
      .insert(productionLines)
      .values({
        tenantId: demoTenant.id,
        plantId: indorePlant.id,
        workCenterId: wc1.id,
        code: "LINE-1",
        name: "Line 1 Bottling & Canning (250 BPM)",
        lineType: "BOTTLING",
        nominalSpeedBpm: 250,
        status: "RUNNING",
      })
      .returning();

    // 6. Seed Equipment Asset
    const [fillerAsset] = await db
      .insert(assets)
      .values({
        tenantId: demoTenant.id,
        plantId: indorePlant.id,
        lineId: line1.id,
        assetCode: "FM-001",
        name: "Rotary Filling Machine 48-Valve",
        criticalLevel: "CRITICAL_P1",
        status: "OPERATIONAL",
        healthPercent: 92,
        mtbfHours: "412.5",
      })
      .returning();

    // 7. Seed Production Order & eBR Batch
    const [prodOrder] = await db
      .insert(productionOrders)
      .values({
        tenantId: demoTenant.id,
        plantId: indorePlant.id,
        orderNumber: "PO-2026-001",
        skuId: citrusSku.id,
        lineId: line1.id,
        targetQuantity: "10000.00",
        producedQuantity: "6850.00",
        scrapQuantity: "42.00",
        status: "RUNNING",
        plannedStart: new Date(),
        plannedEnd: new Date(Date.now() + 86400000),
      })
      .returning();

    const [batch] = await db
      .insert(batches)
      .values({
        tenantId: demoTenant.id,
        plantId: indorePlant.id,
        productionOrderId: prodOrder.id,
        batchNumber: "BAT-2026-0885",
        skuId: citrusSku.id,
        tankNumber: "T-01 (Blender)",
        targetVolume: "10000.00",
        actualVolume: "6850.00",
        currentStep: 4,
        progressPercent: 75,
        status: "In Process",
      })
      .returning();

    // 8. Seed CCP Check
    await db.insert(ccpChecks).values({
      tenantId: demoTenant.id,
      plantId: indorePlant.id,
      lineId: line1.id,
      batchId: batch.id,
      ccpCode: "CCP-1",
      ccpName: "Pasteurizer Thermal Kill Step (≥83.1°C)",
      targetValue: "83.500",
      actualValue: "83.400",
      criticalLimitMin: "83.100",
      uom: "°C",
      status: "PASS",
      operatorId: operator.id,
      notes: "Thermal kill log continuous 15s hold verified.",
    });

    // 9. Seed Inventory Lots
    const [rawLot] = await db
      .insert(inventoryLots)
      .values({
        tenantId: demoTenant.id,
        plantId: indorePlant.id,
        skuId: orangeJuiceRaw.id,
        lotNumber: "LOT-RM-ORG-4402",
        lotType: "RAW_MATERIAL",
        supplierName: "SunGrow Organic Citrus Ltd",
        initialQuantity: "10000.00",
        currentQuantity: "4200.00",
        uom: "Liters",
        status: "RELEASED",
      })
      .returning();

    // 10. Seed Work Order
    await db.insert(workOrders).values({
      tenantId: demoTenant.id,
      plantId: indorePlant.id,
      woNumber: "WO-2026-0891",
      assetId: fillerAsset.id,
      title: "Fill Valve Seal Gasket Replacement",
      type: "CORRECTIVE",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assignedTo: operator.id,
      reportedBy: plantManager.id,
    });

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
}

if (process.argv[1]?.includes("seed.ts")) {
  runDatabaseSeed().then(() => pool.end());
}
