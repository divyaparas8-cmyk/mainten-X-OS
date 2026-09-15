import { db } from "./src/db/index.js";
import { skus, boms } from "./src/db/schema/masterData.js";
import { plants } from "./src/db/schema/tenants.js";

async function run() {
  const allSkus = await db.select().from(skus);
  console.log("SKUs plant IDs:", allSkus.map(s => ({ code: s.skuCode, plantId: s.plantId })));
  const allPlants = await db.select().from(plants);
  console.log("Available Plants:", allPlants.map(p => ({ id: p.id, code: p.code })));
  process.exit(0);
}
run();
