import { planningService } from "../src/modules/planning/planning.service.js";

async function testCreate() {
  try {
    const tenantId = "5bce8458-909a-4dd2-b221-614c32ac7c89";
    const res = await planningService.createPromotion(tenantId, {
      name: "Costco Holiday Pallet Drop Test",
      skuId: "SKU-5001",
      upliftPercent: 10,
      projectedUnits: 4000,
      duration: "2026-09-15 to 2026-09-30",
      channel: "Retail Endcap",
      status: "SCHEDULED"
    } as any);

    console.log("Result of createPromotion:", res);

    const list = await planningService.listPromotions(tenantId);
    console.log("List of promotions after create:", list);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testCreate();
