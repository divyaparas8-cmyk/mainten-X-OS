import { db } from "./config/database.js";
import { sql } from "drizzle-orm";

async function run() {
  const plants = await db.execute(sql`SELECT id, name FROM public.plants LIMIT 3;`);
  const lines = await db.execute(sql`SELECT id, name FROM public.production_lines LIMIT 3;`);
  const skus = await db.execute(sql`SELECT id, name, sku_code FROM public.skus LIMIT 3;`);
  console.log("PLANTS:", plants.rows);
  console.log("LINES:", lines.rows);
  console.log("SKUS:", skus.rows);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
