import { FastifyInstance } from "fastify";
import { warehouseController } from "./warehouse.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function warehouseRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/lots", { schema: { tags: ["Warehouse & WMS"], summary: "List Inventory Lots (Raw, Packaging, Finished Goods)" } }, warehouseController.getLots.bind(warehouseController));
  fastify.post("/lots", { schema: { tags: ["Warehouse & WMS"], summary: "Create / Receive New Lot" } }, warehouseController.createLot.bind(warehouseController));
  fastify.get("/transactions", { schema: { tags: ["Warehouse & WMS"], summary: "List Auditable Stock Movements / Transactions" } }, warehouseController.getTransactions.bind(warehouseController));
  fastify.post("/transactions", { schema: { tags: ["Warehouse & WMS"], summary: "Log Auditable Stock Movement / Adjustment" } }, warehouseController.recordTransaction.bind(warehouseController));


  fastify.get("/warehouses", { schema: { tags: ["Warehouse & WMS"], summary: "List Warehouses" } }, warehouseController.getWarehouses.bind(warehouseController));
  fastify.get("/bins", { schema: { tags: ["Warehouse & WMS"], summary: "List Location Bins & Racks" } }, warehouseController.getBins.bind(warehouseController));

  // Warehouse Dashboard & Receiving Operations
  fastify.get("/dashboard", { schema: { tags: ["Warehouse & WMS"], summary: "Get Warehouse Dashboard Live KPI Metrics" } }, warehouseController.getDashboardStats.bind(warehouseController));
  fastify.get("/receiving/incoming", { schema: { tags: ["Warehouse & Receiving"], summary: "List Incoming Shipments & Deliveries" } }, warehouseController.listIncomingDeliveries.bind(warehouseController));
  fastify.post("/receiving/incoming/:id/toggle", { schema: { tags: ["Warehouse & Receiving"], summary: "Toggle Delivery Arrival Status" } }, warehouseController.toggleDeliveryStatus.bind(warehouseController));
  fastify.get("/receiving/receive", { schema: { tags: ["Warehouse & Receiving"], summary: "Get Inbound Material Receiving Context" } }, warehouseController.listIncomingDeliveries.bind(warehouseController));
  fastify.post("/receiving/receive", { schema: { tags: ["Warehouse & Receiving"], summary: "Execute Receiving & Staging" } }, warehouseController.quickReceive.bind(warehouseController));
  fastify.get("/receiving/scan", { schema: { tags: ["Warehouse & Receiving"], summary: "Get Inbound Scanner Stats & Recent Scans" } }, warehouseController.getScannerStats.bind(warehouseController));
  fastify.post("/receiving/scan", { schema: { tags: ["Warehouse & Receiving"], summary: "Scan & Validate Inbound Barcode" } }, warehouseController.scanBarcode.bind(warehouseController));
  fastify.get("/inventory/status", { schema: { tags: ["Warehouse & WMS"], summary: "Get Real-time Inventory Status" } }, warehouseController.getInventoryStatus.bind(warehouseController));
  fastify.post("/inventory/status/toggle", { schema: { tags: ["Warehouse & WMS"], summary: "Toggle Inventory Buffer Safety Status" } }, warehouseController.toggleInventoryStatus.bind(warehouseController));
  fastify.post("/inventory/status/:id/toggle", { schema: { tags: ["Warehouse & WMS"], summary: "Toggle Specific Inventory Buffer Status" } }, warehouseController.toggleInventoryStatus.bind(warehouseController));
  fastify.post("/inventory/status/replenish", { schema: { tags: ["Warehouse & WMS"], summary: "Replenish Buffer Stock" } }, warehouseController.replenishInventoryBuffer.bind(warehouseController));
  fastify.post("/inventory/status/:id/replenish", { schema: { tags: ["Warehouse & WMS"], summary: "Replenish Specific Buffer Stock" } }, warehouseController.replenishInventoryBuffer.bind(warehouseController));
  fastify.get("/shipping/dispatch", { schema: { tags: ["Warehouse & WMS"], summary: "Inspect Outbound Dispatch Details" } }, warehouseController.getDispatchSummary.bind(warehouseController));

  // Purchasing & Purchase Orders
  fastify.get("/purchase-orders", { schema: { tags: ["Warehouse & Purchasing"], summary: "List Purchase Orders & Metrics" } }, warehouseController.listPurchaseOrders.bind(warehouseController));
  fastify.post("/purchase-orders", { schema: { tags: ["Warehouse & Purchasing"], summary: "Create / Issue Purchase Order" } }, warehouseController.createPurchaseOrder.bind(warehouseController));
  fastify.put("/purchase-orders/:poNumber", { schema: { tags: ["Warehouse & Purchasing"], summary: "Update Purchase Order" } }, warehouseController.updatePurchaseOrder.bind(warehouseController));
  fastify.post("/purchase-orders/:poNumber/approve", { schema: { tags: ["Warehouse & Purchasing"], summary: "Approve Purchase Order" } }, warehouseController.approvePurchaseOrder.bind(warehouseController));
  fastify.post("/purchase-orders/:poNumber/receive", { schema: { tags: ["Warehouse & Purchasing"], summary: "Mark PO as Received" } }, warehouseController.receivePurchaseOrder.bind(warehouseController));
  fastify.post("/purchase-orders/:poNumber/cancel", { schema: { tags: ["Warehouse & Purchasing"], summary: "Cancel Purchase Order" } }, warehouseController.cancelPurchaseOrder.bind(warehouseController));
  fastify.get("/purchase-orders/:poNumber/print", { schema: { tags: ["Warehouse & Purchasing"], summary: "Print / Export PO Document" } }, warehouseController.printPurchaseOrder.bind(warehouseController));

  // Approved Suppliers & Vendor SLA Scorecards
  fastify.get("/suppliers", { schema: { tags: ["Warehouse & Purchasing"], summary: "List Approved Suppliers & Metrics" } }, warehouseController.listSuppliers.bind(warehouseController));
  fastify.post("/suppliers", { schema: { tags: ["Warehouse & Purchasing"], summary: "Register Approved Supplier" } }, warehouseController.createSupplier.bind(warehouseController));
  fastify.put("/suppliers/:id", { schema: { tags: ["Warehouse & Purchasing"], summary: "Update Supplier Profile" } }, warehouseController.updateSupplier.bind(warehouseController));
  fastify.post("/suppliers/:id/toggle-status", { schema: { tags: ["Warehouse & Purchasing"], summary: "Toggle Supplier Status" } }, warehouseController.toggleSupplierStatus.bind(warehouseController));
  fastify.get("/suppliers/:id/scorecard", { schema: { tags: ["Warehouse & Purchasing"], summary: "Export Supplier Scorecard PDF" } }, warehouseController.getSupplierScorecard.bind(warehouseController));

  // WMS Operations Engine (Receiving, Put Away, Movement, Transfer, Picking, Staging, Dispatch)
  fastify.get("/wms/operations", { schema: { tags: ["Warehouse & WMS"], summary: "Get Full WMS Operations Queue & Active Tasks" } }, warehouseController.getWmsOperations.bind(warehouseController));
  fastify.post("/wms/dock-checkin", { schema: { tags: ["Warehouse & WMS"], summary: "Inbound Trailer Dock Check-In" } }, warehouseController.dockCheckIn.bind(warehouseController));
  fastify.post("/wms/inspect-accept", { schema: { tags: ["Warehouse & WMS"], summary: "Inbound Material Inspection & Acceptance" } }, warehouseController.inspectAndAccept.bind(warehouseController));
  fastify.post("/wms/putaway/complete", { schema: { tags: ["Warehouse & WMS"], summary: "Complete Put-Away to Target Bin" } }, warehouseController.completePutAway.bind(warehouseController));
  fastify.post("/wms/movement", { schema: { tags: ["Warehouse & WMS"], summary: "Record Internal Stock Movement" } }, warehouseController.recordStockMovementTask.bind(warehouseController));
  fastify.post("/wms/transfers", { schema: { tags: ["Warehouse & WMS"], summary: "Create Inter-Facility Transfer" } }, warehouseController.createTransfer.bind(warehouseController));
  fastify.post("/wms/pick/confirm", { schema: { tags: ["Warehouse & WMS"], summary: "Confirm Wave Picking Order" } }, warehouseController.confirmPick.bind(warehouseController));
  fastify.post("/wms/staging/release", { schema: { tags: ["Warehouse & WMS"], summary: "Release Staged Pallets to Production Line" } }, warehouseController.releaseStaging.bind(warehouseController));
  fastify.post("/wms/dispatch", { schema: { tags: ["Warehouse & WMS"], summary: "Dispatch & Seal Outbound Trailer" } }, warehouseController.dispatchShipment.bind(warehouseController));

  // Warehouse Physical Hierarchy & Locations
  fastify.get("/locations/list", { schema: { tags: ["Warehouse & Locations"], summary: "List Warehouse Locations & Hierarchy" } }, warehouseController.listLocations.bind(warehouseController));
  fastify.get("/locations/warehouses", { schema: { tags: ["Warehouse & Locations"], summary: "List Warehouses Hierarchy (Alias)" } }, warehouseController.listLocations.bind(warehouseController));
  fastify.get("/locations/hierarchy", { schema: { tags: ["Warehouse & Locations"], summary: "List Full Physical Hierarchy (Warehouse > Zone > Rack > Bin)" } }, warehouseController.listLocationsHierarchy.bind(warehouseController));
  fastify.get("/locations/bins", { schema: { tags: ["Warehouse & Locations"], summary: "List Bins & Storage Racks Put-Away Queue" } }, warehouseController.getBinsLocations.bind(warehouseController));
  fastify.get("/locations/bins/logs", { schema: { tags: ["Warehouse & Locations"], summary: "Get Put-Away Audit Logs" } }, warehouseController.getPutAwayLogs.bind(warehouseController));
  fastify.post("/locations/bins/putaway", { schema: { tags: ["Warehouse & Locations"], summary: "Complete Put-Away to Target Bin" } }, warehouseController.completePutAway.bind(warehouseController));
  fastify.get("/locations/staging", { schema: { tags: ["Warehouse & Locations"], summary: "Get Inbound Staging Area Real-Time Context" } }, warehouseController.getStagingLocations.bind(warehouseController));
  fastify.post("/locations/staging/release", { schema: { tags: ["Warehouse & Locations"], summary: "Release Staged Pallets to Line" } }, warehouseController.releaseStaging.bind(warehouseController));
  fastify.get("/locations/transfers", { schema: { tags: ["Warehouse & Locations"], summary: "Get Storage Location Transfers Log" } }, warehouseController.getLocationTransfers.bind(warehouseController));
  fastify.post("/locations/transfers", { schema: { tags: ["Warehouse & Locations"], summary: "Execute Storage Location Transfer" } }, warehouseController.createLocationTransfer.bind(warehouseController));
  fastify.post("/locations/relocate", { schema: { tags: ["Warehouse & Locations"], summary: "Relocate Stock Between Warehouse Bins" } }, warehouseController.relocateLocationStock.bind(warehouseController));

  // Inventory Operations (Movements, Transfers, Cycle Counts, Adjustments)
  fastify.get("/ops/movements", { schema: { tags: ["Warehouse & Operations"], summary: "List Material Movement Logs" } }, warehouseController.getOpsMovements.bind(warehouseController));
  fastify.get("/movements", { schema: { tags: ["Warehouse & Operations"], summary: "List Material Movement Logs (Alias)" } }, warehouseController.getOpsMovements.bind(warehouseController));
  fastify.get("/ops/transfers", { schema: { tags: ["Warehouse & Operations"], summary: "List Active Inventory Transfers History" } }, warehouseController.getOpsTransfers.bind(warehouseController));
  fastify.post("/ops/transfers/toggle", { schema: { tags: ["Warehouse & Operations"], summary: "Toggle Transfer Status" } }, warehouseController.toggleOpsTransferStatus.bind(warehouseController));
  fastify.get("/ops/cycle-counts", { schema: { tags: ["Warehouse & Operations"], summary: "Get Cycle Count Records & Active SKU Targets" } }, warehouseController.getOpsCycleCounts.bind(warehouseController));
  fastify.post("/ops/cycle-counts", { schema: { tags: ["Warehouse & Operations"], summary: "Confirm & Log Physical Cycle Count" } }, warehouseController.recordOpsCycleCount.bind(warehouseController));
  fastify.get("/ops/adjustments", { schema: { tags: ["Warehouse & Operations"], summary: "Get Inventory Adjustment Context & History" } }, warehouseController.getOpsAdjustments.bind(warehouseController));
  fastify.post("/ops/adjustments", { schema: { tags: ["Warehouse & Operations"], summary: "Confirm & Execute Direct Inventory Adjustment" } }, warehouseController.recordOpsAdjustment.bind(warehouseController));

  // 360° Supply Lot Traceability & FDA 21 CFR
  fastify.get("/traceability", { schema: { tags: ["Warehouse & Traceability"], summary: "Get 360° Lot Traceability Data" } }, warehouseController.getTraceability.bind(warehouseController));
  fastify.get("/traceability/:lotNumber", { schema: { tags: ["Warehouse & Traceability"], summary: "Get 360° Lot Traceability by Lot Number" } }, warehouseController.getTraceability.bind(warehouseController));
  fastify.post("/traceability/recall", { schema: { tags: ["Warehouse & Traceability"], summary: "Initiate Mock Recall / Quarantine Hold" } }, warehouseController.simulateRecall.bind(warehouseController));

  // Raw Materials Inventory
  fastify.get("/inventory/raw", { schema: { tags: ["Warehouse & Inventory"], summary: "List Raw Material Inventory & Quality Staging" } }, warehouseController.getRawMaterials.bind(warehouseController));
  fastify.get("/inventory/raw-materials", { schema: { tags: ["Warehouse & Inventory"], summary: "List Raw Material Inventory (Alias)" } }, warehouseController.getRawMaterials.bind(warehouseController));
  fastify.post("/inventory/raw/toggle", { schema: { tags: ["Warehouse & Inventory"], summary: "Toggle Raw Material Stock Status" } }, warehouseController.toggleRawMaterialStatus.bind(warehouseController));
  fastify.post("/inventory/raw/:id/toggle", { schema: { tags: ["Warehouse & Inventory"], summary: "Toggle Specific Raw Material Status" } }, warehouseController.toggleRawMaterialStatus.bind(warehouseController));

  // Packaging Materials Inventory
  fastify.get("/inventory/packaging", { schema: { tags: ["Warehouse & Inventory"], summary: "List Packaging Materials & Stock Alerts" } }, warehouseController.getPackagingMaterials.bind(warehouseController));
  fastify.get("/inventory/packaging-materials", { schema: { tags: ["Warehouse & Inventory"], summary: "List Packaging Materials (Alias)" } }, warehouseController.getPackagingMaterials.bind(warehouseController));
  fastify.post("/inventory/packaging/toggle", { schema: { tags: ["Warehouse & Inventory"], summary: "Toggle Packaging Stock Status" } }, warehouseController.togglePackagingStatus.bind(warehouseController));
  fastify.post("/inventory/packaging/:id/toggle", { schema: { tags: ["Warehouse & Inventory"], summary: "Toggle Specific Packaging Stock Status" } }, warehouseController.togglePackagingStatus.bind(warehouseController));

  // Finished Goods Inventory
  fastify.get("/inventory/finished-goods", { schema: { tags: ["Warehouse & Inventory"], summary: "List Finished Goods Inventory & Staging" } }, warehouseController.getFinishedGoods.bind(warehouseController));
  fastify.get("/finished-goods", { schema: { tags: ["Warehouse & Inventory"], summary: "List Finished Goods Inventory (Alias)" } }, warehouseController.getFinishedGoods.bind(warehouseController));

  // Outbound Shipping Orders & Logistics
  fastify.get("/shipping/orders", { schema: { tags: ["Warehouse & Shipping"], summary: "List Outbound Shipping Orders & Logistics Manifest" } }, warehouseController.listShipmentOrders.bind(warehouseController));
  fastify.get("/shipping", { schema: { tags: ["Warehouse & Shipping"], summary: "List Outbound Shipping Orders (Alias)" } }, warehouseController.listShipmentOrders.bind(warehouseController));
  fastify.post("/shipping/orders", { schema: { tags: ["Warehouse & Shipping"], summary: "Create Outbound Shipment Order" } }, warehouseController.createShipmentOrder.bind(warehouseController));
  fastify.put("/shipping/orders/:id", { schema: { tags: ["Warehouse & Shipping"], summary: "Update Outbound Shipment Order" } }, warehouseController.updateShipmentOrder.bind(warehouseController));
  fastify.post("/shipping/orders/:id/dispatch", { schema: { tags: ["Warehouse & Shipping"], summary: "Dispatch Outbound Shipment" } }, warehouseController.dispatchShipmentOrder.bind(warehouseController));

  // Warehouse Picking Lists & Execution
  fastify.get("/picking/lists", { schema: { tags: ["Warehouse & Picking"], summary: "List Active Warehouse Picking Lists" } }, warehouseController.getPickingLists.bind(warehouseController));
  fastify.get("/picking", { schema: { tags: ["Warehouse & Picking"], summary: "List Active Picking Orders (Alias)" } }, warehouseController.getPickingLists.bind(warehouseController));
  fastify.post("/picking/lists/start", { schema: { tags: ["Warehouse & Picking"], summary: "Start Picking List Order" } }, warehouseController.startPickingList.bind(warehouseController));
  fastify.post("/picking/lists/:id/start", { schema: { tags: ["Warehouse & Picking"], summary: "Start Specific Picking List Order" } }, warehouseController.startPickingList.bind(warehouseController));
  fastify.get("/picking/execution", { schema: { tags: ["Warehouse & Picking"], summary: "Get Picking Execution Queue & Bin Locations" } }, warehouseController.getPickingExecution.bind(warehouseController));
  fastify.post("/picking/execution/confirm", { schema: { tags: ["Warehouse & Picking"], summary: "Confirm Item Pick in Execution Console" } }, warehouseController.confirmPickingExecution.bind(warehouseController));

  // Pallets & Cargo Containers
  fastify.get("/pallets-containers", { schema: { tags: ["Warehouse & Shipping"], summary: "List Staged & Loaded Pallets / Containers" } }, warehouseController.getPalletsContainers.bind(warehouseController));
  fastify.get("/picking/pallets", { schema: { tags: ["Warehouse & Shipping"], summary: "List Staged Pallets (Alias)" } }, warehouseController.getPalletsContainers.bind(warehouseController));
  fastify.post("/pallets-containers/load", { schema: { tags: ["Warehouse & Shipping"], summary: "Load Cargo Pallet into Carrier Trailer" } }, warehouseController.loadPalletContainer.bind(warehouseController));
  fastify.post("/pallets-containers/:id/load", { schema: { tags: ["Warehouse & Shipping"], summary: "Load Specific Cargo Pallet" } }, warehouseController.loadPalletContainer.bind(warehouseController));

  // Shipment Tracking & ETA
  fastify.get("/shipping/tracking", { schema: { tags: ["Warehouse & Shipping"], summary: "List Active In-Transit & Delivered Shipment Tracking" } }, warehouseController.getShipmentTracking.bind(warehouseController));
  fastify.get("/tracking", { schema: { tags: ["Warehouse & Shipping"], summary: "List Shipment Tracking (Alias)" } }, warehouseController.getShipmentTracking.bind(warehouseController));
  fastify.post("/shipping/tracking/toggle", { schema: { tags: ["Warehouse & Shipping"], summary: "Toggle Shipment Tracking Delivery Status" } }, warehouseController.toggleShipmentTrackingStatus.bind(warehouseController));
  fastify.post("/shipping/tracking/:id/toggle", { schema: { tags: ["Warehouse & Shipping"], summary: "Toggle Specific Shipment Delivery Status" } }, warehouseController.toggleShipmentTrackingStatus.bind(warehouseController));

  // Warehouse Inventory Reports
  fastify.get("/reports", { schema: { tags: ["Warehouse & Reports"], summary: "List Generated Warehouse Inventory & Variance Reports" } }, warehouseController.getWarehouseReports.bind(warehouseController));
  fastify.post("/reports/generate", { schema: { tags: ["Warehouse & Reports"], summary: "Generate New Warehouse Inventory Report" } }, warehouseController.generateWarehouseReport.bind(warehouseController));
  fastify.post("/reports/print", { schema: { tags: ["Warehouse & Reports"], summary: "Trigger Warehouse Report Print Job" } }, warehouseController.generateWarehouseReport.bind(warehouseController));

  // Warehouse Operations Alerts & Notifications
  fastify.get("/notifications", { schema: { tags: ["Warehouse & Notifications"], summary: "List Warehouse Notifications & Alerts" } }, warehouseController.getWarehouseNotifications.bind(warehouseController));
  fastify.post("/notifications/mark-all-read", { schema: { tags: ["Warehouse & Notifications"], summary: "Mark All Notifications as Read" } }, warehouseController.markAllWarehouseNotificationsRead.bind(warehouseController));
  fastify.post("/notifications/:id/read", { schema: { tags: ["Warehouse & Notifications"], summary: "Mark Single Notification as Read" } }, warehouseController.markWarehouseNotificationRead.bind(warehouseController));
  fastify.delete("/notifications", { schema: { tags: ["Warehouse & Notifications"], summary: "Clear All Notifications" } }, warehouseController.clearAllWarehouseNotifications.bind(warehouseController));
  fastify.delete("/notifications/:id", { schema: { tags: ["Warehouse & Notifications"], summary: "Delete Single Notification" } }, warehouseController.deleteWarehouseNotification.bind(warehouseController));

  // Warehouse Operator Profile
  fastify.get("/profile", { schema: { tags: ["Warehouse & Profile"], summary: "Get Warehouse Operator Profile & Performance Scorecard" } }, warehouseController.getWarehouseProfile.bind(warehouseController));
  fastify.post("/profile/certifications/toggle", { schema: { tags: ["Warehouse & Profile"], summary: "Toggle Warehouse Certification Status" } }, warehouseController.toggleWarehouseCertification.bind(warehouseController));
  fastify.post("/profile/certifications/:id/toggle", { schema: { tags: ["Warehouse & Profile"], summary: "Toggle Specific Certification Status" } }, warehouseController.toggleWarehouseCertification.bind(warehouseController));
}
