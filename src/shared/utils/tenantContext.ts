import { db } from "../../config/database.js";
import { plants } from "../../db/schema/tenants.js";
import { eq } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const defaultPlantIdCache: Record<string, string> = {};

export async function resolvePlantId(tenantId: string, providedPlantId?: string): Promise<string> {
  if (providedPlantId && UUID_REGEX.test(providedPlantId)) {
    return providedPlantId;
  }
  if (tenantId && defaultPlantIdCache[tenantId]) {
    return defaultPlantIdCache[tenantId];
  }
  try {
    const [plant] = await db.select().from(plants).where(eq(plants.tenantId, tenantId)).limit(1);
    if (plant) {
      defaultPlantIdCache[tenantId] = plant.id;
      return plant.id;
    }
  } catch {
    // Database query fallback
  }
  return "bead41e2-b735-41b8-bd00-bdba1682fb6a"; // Seeded Indore Mega Facility UUID
}

export function isValidUuid(val?: string): boolean {
  return typeof val === "string" && UUID_REGEX.test(val);
}
