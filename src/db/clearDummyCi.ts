import { pool } from "../config/database.js";

async function clearDummy() {
  try {
    const delLoss = await pool.query(`DELETE FROM ci_losses WHERE id LIKE 'LOSS-YLD-%' OR id LIKE 'LOSS-SCP-%'`);
    console.log(`Deleted ${delLoss.rowCount} dummy loss records.`);

    const delRel = await pool.query(`DELETE FROM ci_reliability_records WHERE id LIKE 'REL-PROC-%' OR id LIKE 'REL-PACK-%'`);
    console.log(`Deleted ${delRel.rowCount} dummy reliability records.`);

    console.log("CI tables cleaned of static seeded mock data.");
  } catch (err: any) {
    console.error("Error clearing dummy data:", err.message);
  } finally {
    await pool.end();
  }
}

clearDummy();
