import { db, pool } from "../src/config/database.js";
import { shipmentOrders } from "../src/db/schema/warehouse.js";

async function clearShipments() {
  try {
    const deleted = await db.delete(shipmentOrders).returning();
    console.log(`✅ Successfully deleted ${deleted.length} rows from 'shipment_orders' table in database.`);
  } catch (error) {
    console.error("❌ Error clearing shipment_orders:", error);
  } finally {
    await pool.end();
  }
}

clearShipments();
