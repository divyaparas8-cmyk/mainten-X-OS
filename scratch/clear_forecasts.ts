import { db, pool } from "../src/config/database.js";
import { forecasts } from "../src/db/schema/planning.js";

async function clearForecasts() {
  try {
    const result = await db.delete(forecasts).returning();
    console.log(`✅ Successfully deleted ${result.length} dummy rows from 'forecasts' table in database.`);
  } catch (error) {
    console.error("❌ Error deleting forecasts:", error);
  } finally {
    await pool.end();
  }
}

clearForecasts();
