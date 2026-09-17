import 'dotenv/config';
import { db, pool } from '../src/config/database.js';
import { spareParts } from '../src/db/schema/maintenance.js';
import { tenants, plants } from '../src/db/schema/tenants.js';

async function run() {
  try {
    const tenantRows = await db.select({ id: tenants.id }).from(tenants).limit(1);
    const tenantId = tenantRows[0]?.id || "5bce8458-909a-4dd2-b221-614c32ac7c89";
    const plantRows = await db.select({ id: plants.id }).from(plants).limit(1);
    const plantId = plantRows[0]?.id || "bead41e2-b735-41b8-bd00-bdba1682fb6a";

    const seeds = [
      {
        tenantId,
        plantId,
        partNumber: "SP-BRG-6205",
        name: "Deep Groove Ball Bearing 6205-2RS",
        category: "MECHANICAL",
        currentStock: 24,
        minStockLevel: 10,
        unitCost: "450.00",
        binLocation: "M-BIN-04",
        supplierName: "SKF Bearing Distribution",
        linkedAssets: "AST-001, AST-002"
      },
      {
        tenantId,
        plantId,
        partNumber: "SP-SEAL-VTON",
        name: "FKM Viton Mechanical Shaft Seal 25mm",
        category: "MECHANICAL",
        currentStock: 4,
        minStockLevel: 8,
        unitCost: "1250.00",
        binLocation: "M-BIN-12",
        supplierName: "Flowserve Seals",
        linkedAssets: "AST-001"
      },
      {
        tenantId,
        plantId,
        partNumber: "SP-PT100-RTD",
        name: "PT100 Temperature Sensor probe 1/2 NPT",
        category: "ELECTRICAL",
        currentStock: 15,
        minStockLevel: 5,
        unitCost: "1850.00",
        binLocation: "E-BIN-02",
        supplierName: "Endress+Hauser",
        linkedAssets: "AST-003"
      }
    ];

    await db.insert(spareParts).values(seeds).onConflictDoNothing();
    console.log("Successfully seeded spare_parts table!");
    const all = await db.select().from(spareParts);
    console.log("Total spare parts count:", all.length);
  } catch (err: any) {
    console.error("Error seeding spare_parts:", err.message);
  } finally {
    await pool.end();
  }
}

run();
