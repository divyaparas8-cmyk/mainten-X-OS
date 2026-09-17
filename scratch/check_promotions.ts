import { db, pool } from "../src/config/database.js";
import { promotionCampaigns } from "../src/db/schema/planning.js";

async function checkPromotions() {
  try {
    const rows = await db.select().from(promotionCampaigns);
    console.log(`Current row count in 'promotion_campaigns' table: ${rows.length}`);
    console.log(rows);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

checkPromotions();
