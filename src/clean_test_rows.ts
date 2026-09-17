import { db } from "./config/database.js";
import { sql } from "drizzle-orm";

async function run() {
  await db.execute(sql`DELETE FROM public.aps_schedules WHERE order_id IS NULL;`);
  console.log("Cleaned test rows from aps_schedules");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
