import { pgTable, uuid, varchar, text, timestamp, numeric, integer, boolean, jsonb, date } from "drizzle-orm/pg-core";
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
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id"),
  shipmentNumber: varchar("shipment_number", { length: 100 }),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  carrier: varchar("carrier", { length: 100 }).default("Swift Freight Logistics"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  status: varchar("status", { length: 50 }).default("Scheduled").notNull(),
  dispatchDate: timestamp("dispatch_date").defaultNow(),
  shippedLots: jsonb("shipped_lots").default([]),
  orderNumber: varchar("order_number", { length: 100 }),
  finishedGoods: varchar("finished_goods", { length: 255 }),
  batchLot: varchar("batch_lot", { length: 100 }),
  quantity: varchar("quantity", { length: 100 }),
  destination: varchar("destination", { length: 255 }),
  trailerNo: varchar("trailer_no", { length: 100 }),
  sealNo: varchar("seal_no", { length: 100 }),
  bolNumber: varchar("bol_number", { length: 100 }),
  trackingMilestones: jsonb("tracking_milestones").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  supplierCode: varchar("supplier_code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("Raw Material Concentrate"),
  materialsSupplied: text("materials_supplied"),
  status: varchar("status", { length: 50 }).default("Active"),
  otifScore: numeric("otif_score", { precision: 5, scale: 2 }).default("98.00"),
  qualityAcceptanceRate: numeric("quality_acceptance_rate", { precision: 5, scale: 2 }).default("99.50"),
  avgLeadTimeDays: numeric("avg_lead_time_days", { precision: 5, scale: 2 }).default("4.00"),
  riskRating: varchar("risk_rating", { length: 50 }).default("Low Risk"),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  lastOrder: varchar("last_order", { length: 255 }).default("Pending Initial PO"),
  openOrdersCount: integer("open_orders_count").default(0),
  activeContractsCount: integer("active_contracts_count").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const warehouseLocations = pgTable("warehouse_locations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  warehouse: varchar("warehouse", { length: 255 }).notNull(),
  zone: varchar("zone", { length: 255 }).notNull(),
  rack: varchar("rack", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  fullHierarchy: varchar("full_hierarchy", { length: 255 }),
  capacityPallets: integer("capacity_pallets").default(40).notNull(),
  occupiedPallets: integer("occupied_pallets").default(0).notNull(),
  material: varchar("material", { length: 255 }).default("Unoccupied Available Staging Bay"),
  materialCode: varchar("material_code", { length: 100 }).default("BIN-EMPTY"),
  batchLot: varchar("batch_lot", { length: 100 }).default("N/A"),
  quantity: varchar("quantity", { length: 100 }).default("0 units"),
  status: varchar("status", { length: 50 }).default("Available"),
  temp: varchar("temp", { length: 50 }).default("20.0°C"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wmsReceiving = pgTable("wms_receiving", {
  id: varchar("id", { length: 64 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  poNumber: varchar("po_number", { length: 100 }).notNull(),
  supplier: varchar("supplier", { length: 255 }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  qty: varchar("qty", { length: 100 }).notNull(),
  dock: varchar("dock", { length: 100 }).default("Dock Bay 01"),
  carrier: varchar("carrier", { length: 100 }).default("Titan Freight Lines"),
  trailerNo: varchar("trailer_no", { length: 100 }),
  tempCheck: varchar("temp_check", { length: 50 }).default("Ambient"),
  bolNumber: varchar("bol_number", { length: 100 }),
  status: varchar("status", { length: 50 }).default("Dock Arrived"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const finishedGoods = pgTable("finished_goods", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id"),
  sku: varchar("sku", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  finishedLot: varchar("finished_lot", { length: 100 }).notNull(),
  batchNumber: varchar("batch_number", { length: 100 }).notNull(),
  quantity: varchar("quantity", { length: 100 }).notNull(),
  storageLocation: varchar("storage_location", { length: 255 }).notNull(),
  productionDate: date("production_date").defaultNow(),
  expiryDate: date("expiry_date"),
  qaStatus: varchar("qa_status", { length: 50 }).default("QA Released"),
  palletSerial: varchar("pallet_serial", { length: 150 }),
  shipmentStatus: varchar("shipment_status", { length: 50 }).default("Ready to Ship"),
  destination: varchar("destination", { length: 255 }),
  tempCheck: varchar("temp_check", { length: 100 }).default("Ambient Controlled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

