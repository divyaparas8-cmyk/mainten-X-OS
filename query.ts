import { db } from "./src/db/index";
import { boms, skus } from "./src/db/schema/index";

async function main() {
  const allBoms = await db.select().from(boms);
  const allSkus = await db.select().from(skus);
  console.log("BOMS:", JSON.stringify(allBoms, null, 2));
  console.log("SKUS:", JSON.stringify(allSkus, null, 2));
  process.exit(0);
}
main().catch(console.error);
