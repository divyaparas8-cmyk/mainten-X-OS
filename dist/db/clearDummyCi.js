"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function clearDummy() {
    try {
        const delLoss = await database_js_1.pool.query(`DELETE FROM ci_losses WHERE id LIKE 'LOSS-YLD-%' OR id LIKE 'LOSS-SCP-%'`);
        console.log(`Deleted ${delLoss.rowCount} dummy loss records.`);
        const delRel = await database_js_1.pool.query(`DELETE FROM ci_reliability_records WHERE id LIKE 'REL-PROC-%' OR id LIKE 'REL-PACK-%'`);
        console.log(`Deleted ${delRel.rowCount} dummy reliability records.`);
        console.log("CI tables cleaned of static seeded mock data.");
    }
    catch (err) {
        console.error("Error clearing dummy data:", err.message);
    }
    finally {
        await database_js_1.pool.end();
    }
}
clearDummy();
