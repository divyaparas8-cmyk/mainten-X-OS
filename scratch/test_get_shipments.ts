import { planningService } from "../src/modules/planning/planning.service.js";

async function testGetShipments() {
  try {
    const tenantId = "5bce8458-909a-4dd2-b221-614c32ac7c89";
    const shipments = await planningService.listShipments(tenantId);
    console.log("Current shipments returned from backend:", shipments);
  } catch (err) {
    console.error("Error:", err);
  }
}

testGetShipments();
