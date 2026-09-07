"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentOrders = exports.goodsReceipts = exports.inventoryTransactions = exports.inventoryLots = exports.locationBins = exports.warehouses = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
const masterData_js_1 = require("./masterData.js");
const users_js_1 = require("./users.js");
exports.warehouses = (0, pg_core_1.pgTable)("warehouses", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(), // "WH-MAIN-INDORE"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(), // "Main Ambient & Cold Storage Warehouse"
    type: (0, pg_core_1.varchar)("type", { length: 100 }).default("RAW_AND_FINISHED"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
});
exports.locationBins = (0, pg_core_1.pgTable)("location_bins", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    warehouseId: (0, pg_core_1.uuid)("warehouse_id").references(() => exports.warehouses.id, { onDelete: "cascade" }).notNull(),
    binCode: (0, pg_core_1.varchar)("bin_code", { length: 50 }).notNull(), // "A-01-01"
    aisle: (0, pg_core_1.varchar)("aisle", { length: 20 }),
    rack: (0, pg_core_1.varchar)("rack", { length: 20 }),
    shelf: (0, pg_core_1.varchar)("shelf", { length: 20 }),
    bin: (0, pg_core_1.varchar)("bin", { length: 20 }),
    zone: (0, pg_core_1.varchar)("zone", { length: 50 }).default("AMBIENT"), // "COLD_CHAIN", "STAGING", "QUARANTINE"
    isOccupied: (0, pg_core_1.boolean)("is_occupied").default(false).notNull(),
});
exports.inventoryLots = (0, pg_core_1.pgTable)("inventory_lots", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_js_1.skus.id, { onDelete: "restrict" }).notNull(),
    lotNumber: (0, pg_core_1.varchar)("lot_number", { length: 100 }).notNull().unique(), // "LOT-RM-ORG-4402"
    lotType: (0, pg_core_1.varchar)("lot_type", { length: 50 }).notNull(), // "RAW_MATERIAL", "PACKAGING", "FINISHED_GOOD"
    supplierName: (0, pg_core_1.varchar)("supplier_name", { length: 255 }),
    supplierLotNumber: (0, pg_core_1.varchar)("supplier_lot_number", { length: 100 }),
    initialQuantity: (0, pg_core_1.numeric)("initial_quantity", { precision: 14, scale: 4 }).notNull(),
    currentQuantity: (0, pg_core_1.numeric)("current_quantity", { precision: 14, scale: 4 }).notNull(),
    reservedQuantity: (0, pg_core_1.numeric)("reserved_quantity", { precision: 14, scale: 4 }).default("0.00").notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    locationBinId: (0, pg_core_1.uuid)("location_bin_id").references(() => exports.locationBins.id, { onDelete: "set null" }),
    mfgDate: (0, pg_core_1.timestamp)("mfg_date"),
    expiryDate: (0, pg_core_1.timestamp)("expiry_date"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("RELEASED").notNull(), // "RELEASED", "QUARANTINED", "DEPLETED", "EXPIRED"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.inventoryTransactions = (0, pg_core_1.pgTable)("inventory_transactions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    lotId: (0, pg_core_1.uuid)("lot_id").references(() => exports.inventoryLots.id, { onDelete: "cascade" }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).notNull(), // "RECEIPT", "TRANSFER", "RESERVATION", "ISSUE", "CONSUMPTION", "ADJUSTMENT", "SHIPMENT"
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 14, scale: 4 }).notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    fromBinId: (0, pg_core_1.uuid)("from_bin_id").references(() => exports.locationBins.id, { onDelete: "set null" }),
    toBinId: (0, pg_core_1.uuid)("to_bin_id").references(() => exports.locationBins.id, { onDelete: "set null" }),
    referenceType: (0, pg_core_1.varchar)("reference_type", { length: 100 }), // "BATCH_STEP", "PO_RECEIPT", "DISPATCH"
    referenceId: (0, pg_core_1.varchar)("reference_id", { length: 255 }),
    notes: (0, pg_core_1.text)("notes"),
    performedBy: (0, pg_core_1.uuid)("performed_by").references(() => users_js_1.users.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.goodsReceipts = (0, pg_core_1.pgTable)("goods_receipts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    grnNumber: (0, pg_core_1.varchar)("grn_number", { length: 100 }).notNull().unique(), // "GRN-2026-0442"
    poNumber: (0, pg_core_1.varchar)("po_number", { length: 100 }),
    vendorName: (0, pg_core_1.varchar)("vendor_name", { length: 255 }).notNull(),
    receivedBy: (0, pg_core_1.uuid)("received_by").references(() => users_js_1.users.id, { onDelete: "set null" }),
    receivedDate: (0, pg_core_1.timestamp)("received_date").defaultNow().notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("COMPLETED").notNull(),
    items: (0, pg_core_1.jsonb)("items").default([]),
});
exports.shipmentOrders = (0, pg_core_1.pgTable)("shipment_orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    shipmentNumber: (0, pg_core_1.varchar)("shipment_number", { length: 100 }).notNull().unique(), // "SHIP-2026-0819"
    customerName: (0, pg_core_1.varchar)("customer_name", { length: 255 }).notNull(), // "Kroger Supermarkets Distribution Center"
    carrier: (0, pg_core_1.varchar)("carrier", { length: 100 }).default("Swift Freight Logistics"),
    trackingNumber: (0, pg_core_1.varchar)("tracking_number", { length: 100 }),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("DISPATCHED").notNull(), // "PACKING", "READY_FOR_PICKUP", "DISPATCHED", "DELIVERED"
    dispatchDate: (0, pg_core_1.timestamp)("dispatch_date").defaultNow().notNull(),
    shippedLots: (0, pg_core_1.jsonb)("shipped_lots").default([]),
});
//# sourceMappingURL=warehouse.js.map