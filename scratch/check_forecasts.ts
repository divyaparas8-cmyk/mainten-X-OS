import { db, pool } from "../src/config/database.js";
import { forecasts } from "../src/db/schema/planning.js";

async function checkCount() {
  try {
    const rows = await db.select().from(forecasts);
    console.log(`Current row count in 'forecasts' table: ${rows.length}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

checkCount();
