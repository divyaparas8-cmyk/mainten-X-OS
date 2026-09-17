import { planningService } from "./modules/planning/planning.service.js";
import { db } from "./config/database.js";
import { sql } from "drizzle-orm";

async function run() {
  const tenantId = "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
  const plantId = "bead41e2-b735-41b8-bd00-bdba1682fb6a";

  const res = await planningService.createApsSchedule(tenantId, plantId, {
    orderNumber: "PO-TEST-PGADMIN-99",
    skuId: "ad766a63-81be-4f2a-8b9c-b86435003a00",
    lineId: "f6700749-b839-4730-9bcb-4ff22decfd6c",
    targetQuantity: 45000,
    runRate: 500,
    changeoverMinutes: 30,
    cipRequired: false,
    startTime: "2026-09-16 10:00"
  });

  console.log("Service created schedule:", res);

  const dbAps = await db.execute(sql`SELECT * FROM public.aps_schedules ORDER BY created_at DESC LIMIT 1;`);
  const dbOrders = await db.execute(sql`SELECT * FROM public.production_orders ORDER BY created_at DESC LIMIT 1;`);

  console.log("DB public.aps_schedules count:", dbAps.rows.length, dbAps.rows[0]);
  console.log("DB public.production_orders count:", dbOrders.rows.length, dbOrders.rows[0]);

  process.exit(0);
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
