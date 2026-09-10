"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseController = exports.WarehouseController = void 0;
const warehouse_service_js_1 = require("./warehouse.service.js");
const warehouse_schema_js_1 = require("./warehouse.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class WarehouseController {
    async getLots(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.listLots(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLot(request, reply) {
        const input = warehouse_schema_js_1.createLotSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.createLot(request.user.tenantId, plantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Inventory lot registered & initial receipt transaction logged"));
    }
    async recordTransaction(request, reply) {
        const raw = request.body || {};
        const effectiveType = raw.type || raw.transactionType || "RECEIPT";
        const input = warehouse_schema_js_1.createTransactionSchema.parse({
            ...raw,
            type: effectiveType,
        });
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.recordTransaction(request.user.tenantId, plantId, { ...input, type: effectiveType }, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Inventory transaction [${effectiveType}] recorded cleanly`));
    }
    async getTransactions(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.listTransactions(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getWarehouses(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listWarehouses(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getBins(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listBins(request.query.warehouseId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getDashboardStats(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getDashboardStats(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async listIncomingDeliveries(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listIncomingDeliveries(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleDeliveryStatus(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.toggleDeliveryStatus(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Shipment marked as ${data.status}`));
    }
    async getScannerStats(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getScannerStats(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async quickReceive(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.quickReceive(request.user.tenantId, request.user.plantId || "default-plant", request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async scanBarcode(request, reply) {
        const barcode = request.body?.barcode || "LOT-RM-ORG-4402";
        const data = await warehouse_service_js_1.warehouseService.scanBarcode(request.user.tenantId, barcode);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Barcode scanned & validated"));
    }
    async getInventoryStatus(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getInventoryStatus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleInventoryStatus(request, reply) {
        const targetId = request.params?.id || request.body?.id || request.body?.sku || "";
        const data = await warehouse_service_js_1.warehouseService.toggleInventoryStatus(request.user.tenantId, targetId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async replenishInventoryBuffer(request, reply) {
        const targetId = request.params?.id || request.body?.id || request.body?.sku || "";
        const data = await warehouse_service_js_1.warehouseService.replenishBuffer(request.user.tenantId, targetId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getDispatchSummary(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getDispatchSummary(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ==========================================
    // PURCHASE ORDERS (PROCUREMENT & PO REGISTER)
    // ==========================================
    async listPurchaseOrders(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listPurchaseOrders(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createPurchaseOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.createPurchaseOrder(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Purchase Order ${data.poNumber} created & issued`));
    }
    async updatePurchaseOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.updatePurchaseOrder(request.user.tenantId, request.params.poNumber, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Purchase Order ${request.params.poNumber} updated successfully`));
    }
    async approvePurchaseOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.approvePurchaseOrder(request.user.tenantId, request.params.poNumber);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Purchase Order ${request.params.poNumber} confirmed & approved`));
    }
    async receivePurchaseOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.receivePurchaseOrder(request.user.tenantId, request.params.poNumber);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Purchase Order ${request.params.poNumber} marked as received at Dock`));
    }
    async cancelPurchaseOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.cancelPurchaseOrder(request.user.tenantId, request.params.poNumber);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Purchase Order ${request.params.poNumber} cancelled`));
    }
    async printPurchaseOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.printPurchaseOrder(request.user.tenantId, request.params.poNumber);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // SUPPLIERS & VENDOR SLA SCORECARDS
    // ==========================================
    async listSuppliers(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listSuppliers(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSupplier(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.createSupplier(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Approved Supplier ${data.name} (${data.supplierCode}) registered`));
    }
    async updateSupplier(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.updateSupplier(request.user.tenantId, request.params.id, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Supplier ${data.name} profile updated`));
    }
    async toggleSupplierStatus(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.toggleSupplierStatus(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Supplier ${data.name} is now ${data.status}`));
    }
    async getSupplierScorecard(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getSupplierScorecard(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // WMS OPERATIONS CONTROLLER
    // ==========================================
    async getWmsOperations(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getWmsOperations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async dockCheckIn(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.dockCheckIn(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Inbound shipment ${data.id} checked in to ${data.dock}`));
    }
    async inspectAndAccept(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.inspectAndAccept(request.user.tenantId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Shipment inspected & accepted into put-away backlog`));
    }
    async completePutAway(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.completePutAway(request.user.tenantId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async recordStockMovementTask(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.recordStockMovementTask(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Stock movement ${data.id} logged cleanly`));
    }
    async createTransfer(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.createTransfer(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Inter-facility transfer ${data.id} initiated`));
    }
    async confirmPick(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.confirmPick(request.user.tenantId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Pick order completed`));
    }
    async releaseStaging(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.releaseStaging(request.user.tenantId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Staged materials released to line`));
    }
    async dispatchShipment(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.dispatchShipment(request.user.tenantId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Trailer dispatched & seal logged`));
    }
    // ==========================================
    // LOCATION & PHYSICAL STORAGE CONTROLLERS
    // ==========================================
    async listLocationsHierarchy(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listLocationsHierarchy(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async listLocations(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listLocations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getBinsLocations(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getBinsLocations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getPutAwayLogs(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getPutAwayLogs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getStagingLocations(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getStagingLocations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getLocationTransfers(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getLocationTransfers(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLocationTransfer(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.createLocationTransfer(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async relocateLocationStock(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.relocateLocationStock(request.user.tenantId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // INVENTORY OPERATIONS CONTROLLERS
    // ==========================================
    async getOpsMovements(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getOpsMovements(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getOpsTransfers(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getOpsTransfers(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleOpsTransferStatus(request, reply) {
        const targetId = request.params?.id || request.body?.id || "";
        const data = await warehouse_service_js_1.warehouseService.toggleOpsTransferStatus(request.user.tenantId, targetId, request.body?.status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getOpsCycleCounts(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getOpsCycleCounts(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async recordOpsCycleCount(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.recordOpsCycleCount(request.user.tenantId, request.body || {}, request.user?.id);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getOpsAdjustments(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getOpsAdjustments(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async recordOpsAdjustment(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.recordOpsAdjustment(request.user.tenantId, request.body || {}, request.user?.id);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // TRACEABILITY & FDA 21 CFR CONTROLLER
    // ==========================================
    async getTraceability(request, reply) {
        const lotNumber = request.params?.lotNumber || request.query?.lot || "LOT-RM-ORG-4402";
        const data = await warehouse_service_js_1.warehouseService.getTraceability(request.user.tenantId, lotNumber);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async simulateRecall(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.simulateRecall(request.user.tenantId, request.body || {}, request.user?.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // INVENTORY CONTROLLER (RAW, PACKAGING, FINISHED GOODS)
    // ==========================================
    async getRawMaterials(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getRawMaterials(request.user.tenantId, request.query || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleRawMaterialStatus(request, reply) {
        const targetId = request.params?.id || request.body?.id || request.body?.lotNumber || "";
        const data = await warehouse_service_js_1.warehouseService.toggleRawMaterialStatus(request.user.tenantId, targetId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message || "Status updated"));
    }
    async getPackagingMaterials(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getPackagingMaterials(request.user.tenantId, request.query || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async togglePackagingStatus(request, reply) {
        const targetId = request.params?.id || request.body?.id || "";
        const data = await warehouse_service_js_1.warehouseService.togglePackagingStatus(request.user.tenantId, targetId, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message || "Packaging status updated"));
    }
    async getFinishedGoods(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getFinishedGoods(request.user.tenantId, request.query || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ==========================================
    // OUTBOUND SHIPPING & LOGISTICS CONTROLLER
    // ==========================================
    async listShipmentOrders(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listShipmentOrders(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createShipmentOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.createShipmentOrder(request.user.tenantId, request.body || {});
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Shipment ${data.id} created successfully`));
    }
    async updateShipmentOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.updateShipmentOrder(request.user.tenantId, request.params.id, request.body || {});
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Shipment ${request.params.id} updated successfully`));
    }
    async dispatchShipmentOrder(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.dispatchShipmentOrder(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Shipment ${request.params.id} dispatched successfully`));
    }
    // ==========================================
    // PICKING & PALLETS CONTROLLERS
    // ==========================================
    async getPickingLists(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getPickingLists(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async startPickingList(request, reply) {
        const id = request.params?.id || request.body?.id || request.body?.order || "PL-101";
        const data = await warehouse_service_js_1.warehouseService.startPickingList(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getPickingExecution(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getPickingExecution(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async confirmPickingExecution(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.confirmPickingExecution(request.user.tenantId, request.body || {}, request.user?.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getPalletsContainers(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getPalletsContainers(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async loadPalletContainer(request, reply) {
        const id = request.params?.id || request.body?.id || "";
        const body = { ...(request.body || {}), id: id || request.body?.id };
        const data = await warehouse_service_js_1.warehouseService.loadPalletContainer(request.user.tenantId, body, request.user?.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // SHIPMENT TRACKING CONTROLLERS
    // ==========================================
    async getShipmentTracking(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getShipmentTracking(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleShipmentTrackingStatus(request, reply) {
        const id = request.params?.id || request.body?.id || "TRK-9011";
        const status = request.body?.status;
        const data = await warehouse_service_js_1.warehouseService.toggleShipmentTrackingStatus(request.user.tenantId, id, status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // WAREHOUSE INVENTORY REPORTS CONTROLLERS
    // ==========================================
    async getWarehouseReports(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getWarehouseReports(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async generateWarehouseReport(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.generateWarehouseReport(request.user.tenantId, request.body || {}, request.user?.id);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // WAREHOUSE NOTIFICATIONS & ALERTS CONTROLLERS
    // ==========================================
    async getWarehouseNotifications(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getWarehouseNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markWarehouseNotificationRead(request, reply) {
        const id = request.params?.id || request.body?.id || 1;
        const data = await warehouse_service_js_1.warehouseService.markWarehouseNotificationRead(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async markAllWarehouseNotificationsRead(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.markAllWarehouseNotificationsRead(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async deleteWarehouseNotification(request, reply) {
        const id = request.params?.id || request.body?.id || 1;
        const data = await warehouse_service_js_1.warehouseService.deleteWarehouseNotification(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clearAllWarehouseNotifications(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.clearAllWarehouseNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // WAREHOUSE OPERATOR PROFILE CONTROLLERS
    // ==========================================
    async getWarehouseProfile(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.getWarehouseProfile(request.user.tenantId, request.user?.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleWarehouseCertification(request, reply) {
        const certId = request.params?.id || request.body?.id || request.body?.certId || 1;
        const status = request.body?.status;
        const data = await warehouse_service_js_1.warehouseService.toggleWarehouseCertification(request.user.tenantId, certId, status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
}
exports.WarehouseController = WarehouseController;
exports.warehouseController = new WarehouseController();
//# sourceMappingURL=warehouse.controller.js.map