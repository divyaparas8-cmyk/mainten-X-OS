import { pgTable, uuid, varchar, text, timestamp, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { skus } from "./masterData";
import { users } from "./users";

export const warehouses = pgTable("warehouses", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 50 }).notNull(), // "WH-MAIN-INDORE"
  name: varchar("name", { length: 255 }).notNull(), // "Main Ambient & Cold Storage Warehouse"
  type: varchar("type", { length: 100 }).default("RAW_AND_FINISHED"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const locationBins = pgTable("location_bins", {
  id: uuid("id").defaultRandom().primaryKey(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "cascade" }).notNull(),
  binCode: varchar("bin_code", { length: 50 }).notNull(), // "A-01-01"
  aisle: varchar("aisle", { length: 20 }),
  rack: varchar("rack", { length: 20 }),
  shelf: varchar("shelf", { length: 20 }),
  bin: varchar("bin", { length: 20 }),
  zone: varchar("zone", { length: 50 }).default("AMBIENT"), // "COLD_CHAIN", "STAGING", "QUARANTINE"
  isOccupied: boolean("is_occupied").default(false).notNull(),
});

export const inventoryLots = pgTable("inventory_lots", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  lotNumber: varchar("lot_number", { length: 100 }).notNull().unique(), // "LOT-RM-ORG-4402"
  lotType: varchar("lot_type", { length: 50 }).notNull(), // "RAW_MATERIAL", "PACKAGING", "FINISHED_GOOD"
  supplierName: varchar("supplier_name", { length: 255 }),
  supplierLotNumber: varchar("supplier_lot_number", { length: 100 }),
  initialQuantity: numeric("initial_quantity", { precision: 14, scale: 4 }).notNull(),
  currentQuantity: numeric("current_quantity", { precision: 14, scale: 4 }).notNull(),
  reservedQuantity: numeric("reserved_quantity", { precision: 14, scale: 4 }).default("0.00").notNull(),
  uom: varchar("uom", { length: 50 }).notNull(),
  locationBinId: uuid("location_bin_id").references(() => locationBins.id, { onDelete: "set null" }),
  mfgDate: timestamp("mfg_date"),
  expiryDate: timestamp("expiry_date"),
  status: varchar("status", { length: 50 }).default("RELEASED").notNull(), // "RELEASED", "QUARANTINED", "DEPLETED", "EXPIRED"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  lotId: uuid("lot_id").references(() => inventoryLots.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "RECEIPT", "TRANSFER", "RESERVATION", "ISSUE", "CONSUMPTION", "ADJUSTMENT", "SHIPMENT"
  quantity: numeric("quantity", { precision: 14, scale: 4 }).notNull(),
  uom: varchar("uom", { length: 50 }).notNull(),
  fromBinId: uuid("from_bin_id").references(() => locationBins.id, { onDelete: "set null" }),
  toBinId: uuid("to_bin_id").references(() => locationBins.id, { onDelete: "set null" }),
  referenceType: varchar("reference_type", { length: 100 }), // "BATCH_STEP", "PO_RECEIPT", "DISPATCH"
  referenceId: varchar("reference_id", { length: 255 }),
  notes: text("notes"),
  performedBy: uuid("performed_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const goodsReceipts = pgTable("goods_receipts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  grnNumber: varchar("grn_number", { length: 100 }).notNull().unique(), // "GRN-2026-0442"
  poNumber: varchar("po_number", { length: 100 }),
  vendorName: varchar("vendor_name", { length: 255 }).notNull(),
  receivedBy: uuid("received_by").references(() => users.id, { onDelete: "set null" }),
  receivedDate: timestamp("received_date").defaultNow().notNull(),
  status: varchar("status", { length: 50 }).default("COMPLETED").notNull(),
  items: jsonb("items").default([]),
});

export const shipmentOrders = pgTable("shipment_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  shipmentNumber: varchar("shipment_number", { length: 100 }).notNull().unique(), // "SHIP-2026-0819"
  customerName: varchar("customer_name", { length: 255 }).notNull(), // "Kroger Supermarkets Distribution Center"
  carrier: varchar("carrier", { length: 100 }).default("Swift Freight Logistics"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  status: varchar("status", { length: 50 }).default("DISPATCHED").notNull(), // "PACKING", "READY_FOR_PICKUP", "DISPATCHED", "DELIVERED"
  dispatchDate: timestamp("dispatch_date").defaultNow().notNull(),
  shippedLots: jsonb("shipped_lots").default([]),
});
