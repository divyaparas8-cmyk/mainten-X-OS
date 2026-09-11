import { pgTable, uuid, varchar, text, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { inventoryLots } from "./warehouse";
import { batches } from "./production";
import { users } from "./users";

export const lotGenealogies = pgTable("lot_genealogies", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  parentLotId: uuid("parent_lot_id").references(() => inventoryLots.id, { onDelete: "cascade" }).notNull(), // Raw Material or Sub-assembly Lot
  childLotId: uuid("child_lot_id").references(() => inventoryLots.id, { onDelete: "cascade" }).notNull(),   // Finished Good Lot
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "set null" }),
  quantityUsed: numeric("quantity_used", { precision: 14, scale: 4 }).notNull(),
  uom: varchar("uom", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recallEvents = pgTable("recall_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  recallCode: varchar("recall_code", { length: 100 }).notNull().unique(), // "REC-2026-001"
  initiatedBy: uuid("initiated_by").references(() => users.id, { onDelete: "set null" }).notNull(),
  targetLotNumber: varchar("target_lot_number", { length: 100 }).notNull(), // "LOT-RM-ORG-4402"
  reason: varchar("reason", { length: 255 }).notNull(),
  scope: varchar("scope", { length: 100 }).default("FULL_CHAIN_FORWARD_AND_BACKWARD").notNull(),
  impactSummary: jsonb("impact_summary").default({}), // Total affected finished batches, warehouses, customer shipments
  status: varchar("status", { length: 50 }).default("SIMULATION_COMPLETED").notNull(), // "SIMULATION_COMPLETED", "FORMAL_RECALL_ACTIVE", "CLOSED"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
