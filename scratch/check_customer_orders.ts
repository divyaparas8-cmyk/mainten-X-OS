import { db, pool } from "../src/config/database.js";
import { customerOrders } from "../src/db/schema/planning.js";

async function checkCount() {
  try {
    const rows = await db.select().from(customerOrders);
    console.log(`Current row count in 'customer_orders' table: ${rows.length}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

checkCount();
