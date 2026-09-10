import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
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
  routings,
  routingSteps,
} from "./schema/index.js";

export async function runDatabaseSeed() {
  console.log("🌱 Starting MaintenX OS Comprehensive Database Seed...");

  try {
    const passwordHash = await bcrypt.hash("Password@123", 10);
    const pinHash = await bcrypt.hash("1234", 10);

    // 1. Seed Tenant
    let [demoTenant] = await db.select().from(tenants).where(eq(tenants.slug, "beverage-corp")).limit(1);
    if (!demoTenant) {
      [demoTenant] = await db
        .insert(tenants)
        .values({
          name: "BeverageCorp Manufacturing Global Ltd",
          slug: "beverage-corp",
          plan: "ENTERPRISE",
          status: "ACTIVE",
        })
        .returning();
    }

    console.log(`✅ Tenant ready: ${demoTenant.name}`);

    // 2. Seed Plants
    let [indorePlant] = await db.select().from(plants).where(eq(plants.code, "INDORE-01")).limit(1);
    if (!indorePlant) {
      [indorePlant] = await db
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
    }

    let [punePlant] = await db.select().from(plants).where(eq(plants.code, "PUNE-02")).limit(1);
    if (!punePlant) {
      [punePlant] = await db
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
    }

    console.log(`✅ Plants ready: ${indorePlant.name}, ${punePlant.name}`);

    // 3. Seed All 12 System Roles
    const roleDefinitions = [
      { code: "master_admin", name: "Master Admin", description: "Platform Chief Administrator & SuperAdmin" },
      { code: "admin", name: "System Administrator", description: "Indore IT & System Configuration Administrator" },
      { code: "planner", name: "Planner / Scheduler", description: "Lead Production & Demand Scheduler" },
      { code: "warehouse", name: "Warehouse / Receiver", description: "Warehouse, Receiving & Logistics Manager" },
      { code: "maintenance", name: "Maintenance", description: "Senior Reliability Technician & Maintenance Lead" },
      { code: "supervisor", name: "Operations Supervisor", description: "Shift Operations & Workforce Supervisor" },
      { code: "line_lead", name: "Line Lead", description: "Line Lead - Packaging & Bottling" },
      { code: "operator", name: "Line Operator", description: "Certified HMI Line Operator" },
      { code: "quality", name: "Quality / QA", description: "Quality Assurance & Food Safety Lead" },
      { code: "ci_engineer", name: "CI / Engineering", description: "Continuous Improvement & RCA Engineer" },
      { code: "plant_manager", name: "Plant Manager", description: "Indore Plant Director & Operations Lead" },
      { code: "executive", name: "Executive", description: "Chief Operating Officer & Enterprise Executive" },
    ];

    const seededRoles: Record<string, any> = {};
    for (const r of roleDefinitions) {
      let [existingRole] = await db.select().from(roles).where(eq(roles.code, r.code)).limit(1);
      if (!existingRole) {
        [existingRole] = await db
          .insert(roles)
          .values({
            tenantId: demoTenant.id,
            code: r.code,
            name: r.name,
            description: r.description,
            isSystem: true,
          })
          .returning();
      }
      seededRoles[r.code] = existingRole;
    }
    console.log(`✅ 12 System Roles ready`);

    // 3b. Seed Users for All 12 Roles
    const userDefinitions = [
      { email: "plant.manager@maintenx.com", firstName: "Arthur", lastName: "Sterling", roleCode: "plant_manager" },
      { email: "alexander.vance@maintenx.com", firstName: "Alexander", lastName: "Vance", roleCode: "plant_manager" },
      { email: "admin@maintenx.com", firstName: "Alexander", lastName: "Vance", roleCode: "admin" },
      { email: "planner@maintenx.com", firstName: "Elena", lastName: "Rostova", roleCode: "planner" },
      { email: "warehouse@maintenx.com", firstName: "Carlos", lastName: "Mendez", roleCode: "warehouse" },
      { email: "maintenance@maintenx.com", firstName: "Dave", lastName: "Miller", roleCode: "maintenance" },
      { email: "supervisor@maintenx.com", firstName: "Sarah", lastName: "Jenkins", roleCode: "supervisor" },
      { email: "linelead@maintenx.com", firstName: "Devang", lastName: "Patel", roleCode: "line_lead" },
      { email: "operator@maintenx.com", firstName: "Marcus", lastName: "Chen", roleCode: "operator" },
      { email: "qa@maintenx.com", firstName: "Dr. Rachel", lastName: "Thorne", roleCode: "quality" },
      { email: "quality@maintenx.com", firstName: "Dr. Rachel", lastName: "Thorne", roleCode: "quality" },
      { email: "ci@maintenx.com", firstName: "Viktor", lastName: "Hayes", roleCode: "ci_engineer" },
      { email: "executive@maintenx.com", firstName: "Victoria", lastName: "Sterling", roleCode: "executive" },
      { email: "master@maintenx.com", firstName: "Elena", lastName: "Vance", roleCode: "master_admin", isMasterAdmin: true },
    ];

    const seededUsers: Record<string, any> = {};
    for (const u of userDefinitions) {
      let [existingUser] = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
      if (!existingUser) {
        [existingUser] = await db
          .insert(users)
          .values({
            tenantId: demoTenant.id,
            email: u.email,
            passwordHash,
            firstName: u.firstName,
            lastName: u.lastName,
            digitalSignaturePinHash: pinHash,
            isMasterAdmin: u.isMasterAdmin || false,
            status: "ACTIVE",
          })
          .returning();
      } else {
        // Update password & pin
        await db.update(users).set({ passwordHash, digitalSignaturePinHash: pinHash }).where(eq(users.id, existingUser.id));
      }

      seededUsers[u.email] = existingUser;

      // Map to userRoles
      const roleObj = seededRoles[u.roleCode];
      if (roleObj) {
        const [existingUserRole] = await db.select().from(userRoles).where(eq(userRoles.userId, existingUser.id)).limit(1);
        if (!existingUserRole) {
          await db.insert(userRoles).values({
            userId: existingUser.id,
            roleId: roleObj.id,
            plantId: indorePlant.id,
          });
        } else {
          await db.update(userRoles).set({ roleId: roleObj.id }).where(eq(userRoles.userId, existingUser.id));
        }
      }
    }

    const plantManager = seededUsers["plant.manager@maintenx.com"] || seededUsers["alexander.vance@maintenx.com"];
    const planner = seededUsers["planner@maintenx.com"];
    const qaLead = seededUsers["qa@maintenx.com"];
    const operator = seededUsers["operator@maintenx.com"];

    console.log(`✅ 14 Users configured and mapped to their respective roles`);

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

    // 7. Seed Routings & Steps (Master Recipes)
    const [existingRtg] = await db.select().from(routings).where(eq(routings.routingCode, "RTG-5001-L1")).limit(1);
    if (!existingRtg) {
      const [rtg] = await db
        .insert(routings)
        .values({
          tenantId: demoTenant.id,
          plantId: indorePlant.id,
          routingCode: "RTG-5001-L1",
          skuId: citrusSku.id,
          lineId: line1.id,
          revision: "R1",
          approvalStatus: "Approved",
          status: "Active",
          stdRunRateBph: 38000,
          setupDurationMin: 30,
          expectedYieldPct: "99.20",
          effectiveFrom: new Date("2024-01-01"),
          effectiveTo: new Date("2030-12-31"),
          notes: "Primary high-speed bottling line routing for 500ml sparkling soda. ISO 22000 certified.",
        })
        .returning();

      await db.insert(routingSteps).values([
        {
          routingId: rtg.id,
          sequence: 10,
          operationCode: "OP-10",
          operationName: "Depalletizing & Bottle Infeed Rinsing",
          workCenterId: wc1.id,
          stdDurationMin: "10.00",
          setupDurationMin: "5.00",
          crewSize: 2,
          isQualityGate: false,
          instructions: "Automated sweep depalletizer infeed with ionized air pressure rinse at 4.5 bar.",
        },
        {
          routingId: rtg.id,
          sequence: 20,
          operationCode: "OP-20",
          operationName: "Formulation & High-Shear Blending Bay",
          workCenterId: wc1.id,
          stdDurationMin: "20.00",
          setupDurationMin: "15.00",
          crewSize: 3,
          isQualityGate: true,
          instructions: "Verify Brix level (10.5 ± 0.2°Bx) and carbonation saturation before transfer to holding tank.",
        },
        {
          routingId: rtg.id,
          sequence: 30,
          operationCode: "OP-30",
          operationName: "Rotary Isobaric Filling & Capping (48-Valve)",
          workCenterId: wc1.id,
          stdDurationMin: "25.00",
          setupDurationMin: "10.00",
          crewSize: 4,
          isQualityGate: true,
          instructions: "Maintain aseptic filling pressure and run acoustic torque audit on caps every 30 mins.",
        },
        {
          routingId: rtg.id,
          sequence: 40,
          operationCode: "OP-40",
          operationName: "Tunnel Pasteurizer & Thermal Kill Zone",
          workCenterId: wc1.id,
          stdDurationMin: "15.00",
          setupDurationMin: "5.00",
          crewSize: 2,
          isQualityGate: true,
          instructions: "Critical Control Point CCP-1: Target 83.5°C with 15s hold. Fail-safe diverter active.",
        },
        {
          routingId: rtg.id,
          sequence: 50,
          operationCode: "OP-50",
          operationName: "Roll-Fed Labeller & Vision Date-Code Verification",
          workCenterId: wc1.id,
          stdDurationMin: "10.00",
          setupDurationMin: "5.00",
          crewSize: 2,
          isQualityGate: false,
          instructions: "High-speed wrap-around OPP label application and optical character recognition on batch codes.",
        },
        {
          routingId: rtg.id,
          sequence: 60,
          operationCode: "OP-60",
          operationName: "Case Packing, Shrink Bundling & Robotic Palletizer",
          workCenterId: wc1.id,
          stdDurationMin: "10.00",
          setupDurationMin: "5.00",
          crewSize: 2,
          isQualityGate: true,
          instructions: "Verify 24-pack tray formation, shrink tightness, and GS1-128 pallet SSCC barcode print.",
        },
      ]);
    }

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
}

if (process.argv[1]?.includes("seed.ts")) {
  runDatabaseSeed().then(() => pool.end());
}
