"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishedGoods = exports.wmsReceiving = exports.warehouseLocations = exports.suppliers = exports.shipmentOrders = exports.goodsReceipts = exports.inventoryTransactions = exports.inventoryLots = exports.locationBins = exports.warehouses = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const masterData_1 = require("./masterData");
const users_1 = require("./users");
exports.warehouses = (0, pg_core_1.pgTable)("warehouses", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    lotId: (0, pg_core_1.uuid)("lot_id").references(() => exports.inventoryLots.id, { onDelete: "cascade" }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).notNull(), // "RECEIPT", "TRANSFER", "RESERVATION", "ISSUE", "CONSUMPTION", "ADJUSTMENT", "SHIPMENT"
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 14, scale: 4 }).notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    fromBinId: (0, pg_core_1.uuid)("from_bin_id").references(() => exports.locationBins.id, { onDelete: "set null" }),
    toBinId: (0, pg_core_1.uuid)("to_bin_id").references(() => exports.locationBins.id, { onDelete: "set null" }),
    referenceType: (0, pg_core_1.varchar)("reference_type", { length: 100 }), // "BATCH_STEP", "PO_RECEIPT", "DISPATCH"
    referenceId: (0, pg_core_1.varchar)("reference_id", { length: 255 }),
    notes: (0, pg_core_1.text)("notes"),
    performedBy: (0, pg_core_1.uuid)("performed_by").references(() => users_1.users.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.goodsReceipts = (0, pg_core_1.pgTable)("goods_receipts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    grnNumber: (0, pg_core_1.varchar)("grn_number", { length: 100 }).notNull().unique(), // "GRN-2026-0442"
    poNumber: (0, pg_core_1.varchar)("po_number", { length: 100 }),
    vendorName: (0, pg_core_1.varchar)("vendor_name", { length: 255 }).notNull(),
    receivedBy: (0, pg_core_1.uuid)("received_by").references(() => users_1.users.id, { onDelete: "set null" }),
    receivedDate: (0, pg_core_1.timestamp)("received_date").defaultNow().notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("COMPLETED").notNull(),
    items: (0, pg_core_1.jsonb)("items").default([]),
});
exports.shipmentOrders = (0, pg_core_1.pgTable)("shipment_orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.uuid)("plant_id"),
    shipmentNumber: (0, pg_core_1.varchar)("shipment_number", { length: 100 }),
    customerName: (0, pg_core_1.varchar)("customer_name", { length: 255 }).notNull(),
    carrier: (0, pg_core_1.varchar)("carrier", { length: 100 }).default("Swift Freight Logistics"),
    trackingNumber: (0, pg_core_1.varchar)("tracking_number", { length: 100 }),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Scheduled").notNull(),
    dispatchDate: (0, pg_core_1.timestamp)("dispatch_date").defaultNow(),
    shippedLots: (0, pg_core_1.jsonb)("shipped_lots").default([]),
    orderNumber: (0, pg_core_1.varchar)("order_number", { length: 100 }),
    finishedGoods: (0, pg_core_1.varchar)("finished_goods", { length: 255 }),
    batchLot: (0, pg_core_1.varchar)("batch_lot", { length: 100 }),
    quantity: (0, pg_core_1.varchar)("quantity", { length: 100 }),
    destination: (0, pg_core_1.varchar)("destination", { length: 255 }),
    trailerNo: (0, pg_core_1.varchar)("trailer_no", { length: 100 }),
    sealNo: (0, pg_core_1.varchar)("seal_no", { length: 100 }),
    bolNumber: (0, pg_core_1.varchar)("bol_number", { length: 100 }),
    trackingMilestones: (0, pg_core_1.jsonb)("tracking_milestones").default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.suppliers = (0, pg_core_1.pgTable)("suppliers", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    supplierCode: (0, pg_core_1.varchar)("supplier_code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("Raw Material Concentrate"),
    materialsSupplied: (0, pg_core_1.text)("materials_supplied"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    otifScore: (0, pg_core_1.numeric)("otif_score", { precision: 5, scale: 2 }).default("98.00"),
    qualityAcceptanceRate: (0, pg_core_1.numeric)("quality_acceptance_rate", { precision: 5, scale: 2 }).default("99.50"),
    avgLeadTimeDays: (0, pg_core_1.numeric)("avg_lead_time_days", { precision: 5, scale: 2 }).default("4.00"),
    riskRating: (0, pg_core_1.varchar)("risk_rating", { length: 50 }).default("Low Risk"),
    contactEmail: (0, pg_core_1.varchar)("contact_email", { length: 255 }),
    contactPhone: (0, pg_core_1.varchar)("contact_phone", { length: 50 }),
    lastOrder: (0, pg_core_1.varchar)("last_order", { length: 255 }).default("Pending Initial PO"),
    openOrdersCount: (0, pg_core_1.integer)("open_orders_count").default(0),
    activeContractsCount: (0, pg_core_1.integer)("active_contracts_count").default(1),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.warehouseLocations = (0, pg_core_1.pgTable)("warehouse_locations", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    warehouse: (0, pg_core_1.varchar)("warehouse", { length: 255 }).notNull(),
    zone: (0, pg_core_1.varchar)("zone", { length: 255 }).notNull(),
    rack: (0, pg_core_1.varchar)("rack", { length: 100 }).notNull(),
    location: (0, pg_core_1.varchar)("location", { length: 100 }).notNull(),
    fullHierarchy: (0, pg_core_1.varchar)("full_hierarchy", { length: 255 }),
    capacityPallets: (0, pg_core_1.integer)("capacity_pallets").default(40).notNull(),
    occupiedPallets: (0, pg_core_1.integer)("occupied_pallets").default(0).notNull(),
    material: (0, pg_core_1.varchar)("material", { length: 255 }).default("Unoccupied Available Staging Bay"),
    materialCode: (0, pg_core_1.varchar)("material_code", { length: 100 }).default("BIN-EMPTY"),
    batchLot: (0, pg_core_1.varchar)("batch_lot", { length: 100 }).default("N/A"),
    quantity: (0, pg_core_1.varchar)("quantity", { length: 100 }).default("0 units"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Available"),
    temp: (0, pg_core_1.varchar)("temp", { length: 50 }).default("20.0°C"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.wmsReceiving = (0, pg_core_1.pgTable)("wms_receiving", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    poNumber: (0, pg_core_1.varchar)("po_number", { length: 100 }).notNull(),
    supplier: (0, pg_core_1.varchar)("supplier", { length: 255 }).notNull(),
    item: (0, pg_core_1.varchar)("item", { length: 255 }).notNull(),
    qty: (0, pg_core_1.varchar)("qty", { length: 100 }).notNull(),
    dock: (0, pg_core_1.varchar)("dock", { length: 100 }).default("Dock Bay 01"),
    carrier: (0, pg_core_1.varchar)("carrier", { length: 100 }).default("Titan Freight Lines"),
    trailerNo: (0, pg_core_1.varchar)("trailer_no", { length: 100 }),
    tempCheck: (0, pg_core_1.varchar)("temp_check", { length: 50 }).default("Ambient"),
    bolNumber: (0, pg_core_1.varchar)("bol_number", { length: 100 }),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Dock Arrived"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.finishedGoods = (0, pg_core_1.pgTable)("finished_goods", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.uuid)("plant_id"),
    sku: (0, pg_core_1.varchar)("sku", { length: 100 }).notNull(),
    productName: (0, pg_core_1.varchar)("product_name", { length: 255 }).notNull(),
    finishedLot: (0, pg_core_1.varchar)("finished_lot", { length: 100 }).notNull(),
    batchNumber: (0, pg_core_1.varchar)("batch_number", { length: 100 }).notNull(),
    quantity: (0, pg_core_1.varchar)("quantity", { length: 100 }).notNull(),
    storageLocation: (0, pg_core_1.varchar)("storage_location", { length: 255 }).notNull(),
    productionDate: (0, pg_core_1.date)("production_date").defaultNow(),
    expiryDate: (0, pg_core_1.date)("expiry_date"),
    qaStatus: (0, pg_core_1.varchar)("qa_status", { length: 50 }).default("QA Released"),
    palletSerial: (0, pg_core_1.varchar)("pallet_serial", { length: 150 }),
    shipmentStatus: (0, pg_core_1.varchar)("shipment_status", { length: 50 }).default("Ready to Ship"),
    destination: (0, pg_core_1.varchar)("destination", { length: 255 }),
    tempCheck: (0, pg_core_1.varchar)("temp_check", { length: 100 }).default("Ambient Controlled"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
//# sourceMappingURL=warehouse.js.map