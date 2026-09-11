"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePlantId = resolvePlantId;
exports.isValidUuid = isValidUuid;
const database_js_1 = require("../../config/database.js");
const tenants_js_1 = require("../../db/schema/tenants.js");
const drizzle_orm_1 = require("drizzle-orm");
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const defaultPlantIdCache = {};
async function resolvePlantId(tenantId, providedPlantId) {
    if (providedPlantId && UUID_REGEX.test(providedPlantId)) {
        return providedPlantId;
    }
    if (tenantId && defaultPlantIdCache[tenantId]) {
        return defaultPlantIdCache[tenantId];
    }
    try {
        const [plant] = await database_js_1.db.select().from(tenants_js_1.plants).where((0, drizzle_orm_1.eq)(tenants_js_1.plants.tenantId, tenantId)).limit(1);
        if (plant) {
            defaultPlantIdCache[tenantId] = plant.id;
            return plant.id;
        }
    }
    catch {
        // Database query fallback
    }
    return "bead41e2-b735-41b8-bd00-bdba1682fb6a"; // Seeded Indore Mega Facility UUID
}
function isValidUuid(val) {
    return typeof val === "string" && UUID_REGEX.test(val);
}
//# sourceMappingURL=tenantContext.js.map