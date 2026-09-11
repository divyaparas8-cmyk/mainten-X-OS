"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRoutings = seedRoutings;
const database_js_1 = require("../config/database.js");
const index_js_1 = require("./schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
async function seedRoutings() {
    console.log("🌱 Starting Routings & Routing Steps Master Data Seed...");
    try {
        // 1. Get Tenant
        const [tenant] = await database_js_1.db.select().from(index_js_1.tenants).limit(1);
        if (!tenant) {
            console.error("❌ No tenant found. Please run main database seed first.");
            return;
        }
        // 2. Get Plant
        const [plant] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, tenant.id)).limit(1);
        // 3. Get SKUs
        const allSkus = await database_js_1.db.select().from(index_js_1.skus).where((0, drizzle_orm_1.eq)(index_js_1.skus.tenantId, tenant.id));
        const citrusSku = allSkus.find((s) => s.skuCode === "SKU-5001") || allSkus[0];
        const secondSku = allSkus.find((s) => s.id !== citrusSku?.id) || citrusSku;
        // 4. Get Production Lines
        const allLines = await database_js_1.db.select().from(index_js_1.productionLines).where((0, drizzle_orm_1.eq)(index_js_1.productionLines.tenantId, tenant.id));
        const line1 = allLines.find((l) => l.code === "LINE-1") || allLines[0];
        // 5. Get Work Center
        const [workCenter] = await database_js_1.db.select().from(index_js_1.workCenters).where((0, drizzle_orm_1.eq)(index_js_1.workCenters.tenantId, tenant.id)).limit(1);
        console.log(`Using Tenant: ${tenant.name}, Plant: ${plant?.name || "Indore"}, SKU: ${citrusSku?.name}`);
        // Check if RTG-5001-L1 already exists
        let [rtg1] = await database_js_1.db.select().from(index_js_1.routings).where((0, drizzle_orm_1.eq)(index_js_1.routings.routingCode, "RTG-5001-L1")).limit(1);
        if (!rtg1) {
            [rtg1] = await database_js_1.db
                .insert(index_js_1.routings)
                .values({
                tenantId: tenant.id,
                plantId: plant?.id || null,
                routingCode: "RTG-5001-L1",
                skuId: citrusSku.id,
                lineId: line1?.id || null,
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
            console.log(`✅ Created Routing Master: ${rtg1.routingCode} (${rtg1.id})`);
            // Add Steps
            const steps1 = [
                {
                    sequence: 10,
                    operationCode: "OP-10",
                    operationName: "Depalletizing & Bottle Infeed Rinsing",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "10.00",
                    setupDurationMin: "5.00",
                    crewSize: 2,
                    isQualityGate: false,
                    instructions: "Automated sweep depalletizer infeed with ionized air pressure rinse at 4.5 bar.",
                },
                {
                    sequence: 20,
                    operationCode: "OP-20",
                    operationName: "Formulation & High-Shear Blending Bay",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "20.00",
                    setupDurationMin: "15.00",
                    crewSize: 3,
                    isQualityGate: true,
                    instructions: "Verify Brix level (10.5 ± 0.2°Bx) and carbonation saturation before transfer to holding tank.",
                },
                {
                    sequence: 30,
                    operationCode: "OP-30",
                    operationName: "Rotary Isobaric Filling & Capping (48-Valve)",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "25.00",
                    setupDurationMin: "10.00",
                    crewSize: 4,
                    isQualityGate: true,
                    instructions: "Maintain aseptic filling pressure and run acoustic torque audit on caps every 30 mins.",
                },
                {
                    sequence: 40,
                    operationCode: "OP-40",
                    operationName: "Tunnel Pasteurizer & Thermal Kill Zone",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "15.00",
                    setupDurationMin: "5.00",
                    crewSize: 2,
                    isQualityGate: true,
                    instructions: "Critical Control Point CCP-1: Target 83.5°C with 15s hold. Fail-safe diverter active.",
                },
                {
                    sequence: 50,
                    operationCode: "OP-50",
                    operationName: "Roll-Fed Labeller & Vision Date-Code Verification",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "10.00",
                    setupDurationMin: "5.00",
                    crewSize: 2,
                    isQualityGate: false,
                    instructions: "High-speed wrap-around OPP label application and optical character recognition on batch codes.",
                },
                {
                    sequence: 60,
                    operationCode: "OP-60",
                    operationName: "Case Packing, Shrink Bundling & Robotic Palletizer",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "10.00",
                    setupDurationMin: "5.00",
                    crewSize: 2,
                    isQualityGate: true,
                    instructions: "Verify 24-pack tray formation, shrink tightness, and GS1-128 pallet SSCC barcode print.",
                },
            ];
            for (const step of steps1) {
                await database_js_1.db.insert(index_js_1.routingSteps).values({
                    routingId: rtg1.id,
                    ...step,
                });
            }
            console.log(`✅ Seeded 6 operational steps for ${rtg1.routingCode}`);
        }
        else {
            console.log(`ℹ️ Routing ${rtg1.routingCode} already exists.`);
        }
        // Check if RTG-5002-L2 already exists
        let [rtg2] = await database_js_1.db.select().from(index_js_1.routings).where((0, drizzle_orm_1.eq)(index_js_1.routings.routingCode, "RTG-5002-L2")).limit(1);
        if (!rtg2 && secondSku) {
            [rtg2] = await database_js_1.db
                .insert(index_js_1.routings)
                .values({
                tenantId: tenant.id,
                plantId: plant?.id || null,
                routingCode: "RTG-5002-L2",
                skuId: secondSku.id,
                lineId: line1?.id || null,
                revision: "R1",
                approvalStatus: "Approved",
                status: "Active",
                stdRunRateBph: 32000,
                setupDurationMin: 25,
                expectedYieldPct: "98.80",
                effectiveFrom: new Date("2024-01-01"),
                effectiveTo: new Date("2030-12-31"),
                notes: "Secondary bottling line routing for sparkling mineral water and canned beverages.",
            })
                .returning();
            console.log(`✅ Created Routing Master: ${rtg2.routingCode} (${rtg2.id})`);
            const steps2 = [
                {
                    sequence: 10,
                    operationCode: "OP-10",
                    operationName: "Can De-palletizing & Ionized Vacuum Rinsing",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "8.00",
                    setupDurationMin: "5.00",
                    crewSize: 2,
                    isQualityGate: false,
                    instructions: "Inspect can integrity and ensure static discharge.",
                },
                {
                    sequence: 20,
                    operationCode: "OP-20",
                    operationName: "Syrup Metering & Micro-Filtration",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "15.00",
                    setupDurationMin: "10.00",
                    crewSize: 2,
                    isQualityGate: true,
                    instructions: "Verify 0.45 micron filter differential pressure and turbidity.",
                },
                {
                    sequence: 30,
                    operationCode: "OP-30",
                    operationName: "Counter-Pressure Can Seaming & Under-Cover Gassing",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "20.00",
                    setupDurationMin: "10.00",
                    crewSize: 3,
                    isQualityGate: true,
                    instructions: "Seam tear-down inspection and double-seam micrometer test.",
                },
                {
                    sequence: 40,
                    operationCode: "OP-40",
                    operationName: "Tray Packing & Automatic Stretch Wrapper",
                    workCenterId: workCenter?.id || null,
                    stdDurationMin: "12.00",
                    setupDurationMin: "5.00",
                    crewSize: 2,
                    isQualityGate: false,
                    instructions: "Load onto heat-treated Euro-pallets.",
                },
            ];
            for (const step of steps2) {
                await database_js_1.db.insert(index_js_1.routingSteps).values({
                    routingId: rtg2.id,
                    ...step,
                });
            }
            console.log(`✅ Seeded 4 operational steps for ${rtg2.routingCode}`);
        }
        console.log("🎉 Routings Master Data Seed completed successfully!");
    }
    catch (error) {
        console.error("❌ Routings seed error:", error);
    }
    finally {
        await database_js_1.pool.end();
    }
}
seedRoutings();
//# sourceMappingURL=seed-routings.js.map