import { db } from "../src/db/index";
import { skus, boms } from "../src/db/schema/masterData";
import { plants } from "../src/db/schema/tenants";
import { eq, isNull } from "drizzle-orm";

async function run() {
  const allPlants = await db.select().from(plants);
  if (allPlants.length > 0) {
    const defaultPlant = allPlants[0];
    await db.update(skus).set({ plantId: defaultPlant.id }).where(isNull(skus.plantId));
    console.log("Updated all null plantIds to", defaultPlant.id);
  } else {
    console.log("No plants found!");
  }
  process.exit(0);
}
run();
