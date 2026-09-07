"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recallEvents = exports.lotGenealogies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
const warehouse_js_1 = require("./warehouse.js");
const production_js_1 = require("./production.js");
const users_js_1 = require("./users.js");
exports.lotGenealogies = (0, pg_core_1.pgTable)("lot_genealogies", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    parentLotId: (0, pg_core_1.uuid)("parent_lot_id").references(() => warehouse_js_1.inventoryLots.id, { onDelete: "cascade" }).notNull(), // Raw Material or Sub-assembly Lot
    childLotId: (0, pg_core_1.uuid)("child_lot_id").references(() => warehouse_js_1.inventoryLots.id, { onDelete: "cascade" }).notNull(), // Finished Good Lot
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => production_js_1.batches.id, { onDelete: "set null" }),
    quantityUsed: (0, pg_core_1.numeric)("quantity_used", { precision: 14, scale: 4 }).notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.recallEvents = (0, pg_core_1.pgTable)("recall_events", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    recallCode: (0, pg_core_1.varchar)("recall_code", { length: 100 }).notNull().unique(), // "REC-2026-001"
    initiatedBy: (0, pg_core_1.uuid)("initiated_by").references(() => users_js_1.users.id, { onDelete: "set null" }).notNull(),
    targetLotNumber: (0, pg_core_1.varchar)("target_lot_number", { length: 100 }).notNull(), // "LOT-RM-ORG-4402"
    reason: (0, pg_core_1.varchar)("reason", { length: 255 }).notNull(),
    scope: (0, pg_core_1.varchar)("scope", { length: 100 }).default("FULL_CHAIN_FORWARD_AND_BACKWARD").notNull(),
    impactSummary: (0, pg_core_1.jsonb)("impact_summary").default({}), // Total affected finished batches, warehouses, customer shipments
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("SIMULATION_COMPLETED").notNull(), // "SIMULATION_COMPLETED", "FORMAL_RECALL_ACTIVE", "CLOSED"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
//# sourceMappingURL=traceability.js.map