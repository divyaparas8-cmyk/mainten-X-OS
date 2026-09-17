import { db, pool } from "../src/config/database.js";
import { customerOrders } from "../src/db/schema/planning.js";

async function clearCustomerOrders() {
  try {
    const deleted = await db.delete(customerOrders).returning();
    console.log(`✅ Successfully deleted ${deleted.length} seed rows from 'customer_orders' table in database.`);
  } catch (error) {
    console.error("❌ Error clearing customer_orders:", error);
  } finally {
    await pool.end();
  }
}

clearCustomerOrders();
