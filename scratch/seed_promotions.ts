import { db, pool } from "../src/config/database.js";
import { skus } from "../src/db/schema/masterData.js";
import { promotionCampaigns } from "../src/db/schema/planning.js";

async function seedPromotions() {
  try {
    const allSkus = await db.select().from(skus);
    console.log("Found SKUs count:", allSkus.length);
    if (allSkus.length === 0) {
      console.log("No SKUs found, cannot link promotions.");
      return;
    }

    const sku1 = allSkus[0];
    const sku2 = allSkus[1] || allSkus[0];

    // Clear and seed
    await db.delete(promotionCampaigns);

    const inserted = await db.insert(promotionCampaigns).values([
      {
        tenantId: sku1.tenantId,
        plantId: sku1.plantId,
        name: "Labor Day Juice Promo - Costco National",
        skuId: sku1.id,
        upliftPercent: "15.00",
        incrementalUnits: "7500.00",
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-09-08"),
        channel: "Wholesale Club Flyer",
        status: "ACTIVE"
      },
      {
        tenantId: sku2.tenantId,
        plantId: sku2.plantId,
        name: "Organic Quinine Autumn Feature - Whole Foods",
        skuId: sku2.id,
        upliftPercent: "12.00",
        incrementalUnits: "3000.00",
        startDate: new Date("2026-09-10"),
        endDate: new Date("2026-09-24"),
        channel: "Endcap Display",
        status: "SCHEDULED"
      }
    ]).returning();

    console.log(`✅ Seeded ${inserted.length} promotion campaigns into database with real UUIDs.`);
  } catch (error) {
    console.error("Error seeding promotions:", error);
  } finally {
    await pool.end();
  }
}

seedPromotions();
