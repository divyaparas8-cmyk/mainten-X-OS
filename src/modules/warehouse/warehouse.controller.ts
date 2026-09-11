import { FastifyReply, FastifyRequest } from "fastify";
import { warehouseService } from "./warehouse.service.js";
import { createLotSchema, createTransactionSchema } from "./warehouse.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

import { resolvePlantId } from "../../shared/utils/tenantContext.js";

export class WarehouseController {
  async getLots(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await warehouseService.listLots(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }


  async createLot(request: FastifyRequest, reply: FastifyReply) {
    const input = createLotSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await warehouseService.createLot(request.user.tenantId, plantId, input);
    return reply.status(201).send(formatSuccess(data, "Inventory lot registered & initial receipt transaction logged"));
  }

  async recordTransaction(request: FastifyRequest, reply: FastifyReply) {
    const raw = (request.body as any) || {};
    const effectiveType = raw.type || raw.transactionType || "RECEIPT";
    const input = createTransactionSchema.parse({
      ...raw,
      type: effectiveType,
    });
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await warehouseService.recordTransaction(request.user.tenantId, plantId, { ...input, type: effectiveType }, request.user.userId);
    return reply.status(201).send(formatSuccess(data, `Inventory transaction [${effectiveType}] recorded cleanly`));
  }

  async getTransactions(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await warehouseService.listTransactions(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async getWarehouses(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listWarehouses(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getBins(request: FastifyRequest<{ Querystring: { warehouseId?: string } }>, reply: FastifyReply) {
    const data = await warehouseService.listBins(request.query.warehouseId);
    return reply.send(formatSuccess(data));
  }

  async getDashboardStats(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getDashboardStats(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async listIncomingDeliveries(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listIncomingDeliveries(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleDeliveryStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await warehouseService.toggleDeliveryStatus(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, `Shipment marked as ${data.status}`));
  }

  async getScannerStats(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getScannerStats(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async quickReceive(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.quickReceive(request.user.tenantId, request.user.plantId || "default-plant", request.body || {});
    return reply.send(formatSuccess(data, data.message));
  }

  async scanBarcode(request: FastifyRequest, reply: FastifyReply) {
    const barcode = (request.body as any)?.barcode || "LOT-RM-ORG-4402";
    const data = await warehouseService.scanBarcode(request.user.tenantId, barcode);
    return reply.send(formatSuccess(data, "Barcode scanned & validated"));
  }

  async getInventoryStatus(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getInventoryStatus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleInventoryStatus(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const targetId = request.params?.id || (request.body as any)?.id || (request.body as any)?.sku || "";
    const data = await warehouseService.toggleInventoryStatus(request.user.tenantId, targetId, request.body || {});
    return reply.send(formatSuccess(data, data.message));
  }

  async replenishInventoryBuffer(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const targetId = request.params?.id || (request.body as any)?.id || (request.body as any)?.sku || "";
    const data = await warehouseService.replenishBuffer(request.user.tenantId, targetId, request.body || {});
    return reply.send(formatSuccess(data, data.message));
  }

  async getDispatchSummary(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getDispatchSummary(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  // ==========================================
  // PURCHASE ORDERS (PROCUREMENT & PO REGISTER)
  // ==========================================

  async listPurchaseOrders(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listPurchaseOrders(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createPurchaseOrder(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.createPurchaseOrder(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, `Purchase Order ${data.poNumber} created & issued`));
  }

  async updatePurchaseOrder(request: FastifyRequest<{ Params: { poNumber: string } }>, reply: FastifyReply) {
    const data = await warehouseService.updatePurchaseOrder(request.user.tenantId, request.params.poNumber, request.body || {});
    return reply.send(formatSuccess(data, `Purchase Order ${request.params.poNumber} updated successfully`));
  }

  async approvePurchaseOrder(request: FastifyRequest<{ Params: { poNumber: string } }>, reply: FastifyReply) {
    const data = await warehouseService.approvePurchaseOrder(request.user.tenantId, request.params.poNumber);
    return reply.send(formatSuccess(data, `Purchase Order ${request.params.poNumber} confirmed & approved`));
  }

  async receivePurchaseOrder(request: FastifyRequest<{ Params: { poNumber: string } }>, reply: FastifyReply) {
    const data = await warehouseService.receivePurchaseOrder(request.user.tenantId, request.params.poNumber);
    return reply.send(formatSuccess(data, `Purchase Order ${request.params.poNumber} marked as received at Dock`));
  }

  async cancelPurchaseOrder(request: FastifyRequest<{ Params: { poNumber: string } }>, reply: FastifyReply) {
    const data = await warehouseService.cancelPurchaseOrder(request.user.tenantId, request.params.poNumber);
    return reply.send(formatSuccess(data, `Purchase Order ${request.params.poNumber} cancelled`));
  }

  async printPurchaseOrder(request: FastifyRequest<{ Params: { poNumber: string } }>, reply: FastifyReply) {
    const data = await warehouseService.printPurchaseOrder(request.user.tenantId, request.params.poNumber);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // SUPPLIERS & VENDOR SLA SCORECARDS
  // ==========================================

  async listSuppliers(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listSuppliers(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createSupplier(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.createSupplier(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, `Approved Supplier ${data.name} (${data.supplierCode}) registered`));
  }

  async updateSupplier(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await warehouseService.updateSupplier(request.user.tenantId, request.params.id, request.body || {});
    return reply.send(formatSuccess(data, `Supplier ${data.name} profile updated`));
  }

  async toggleSupplierStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await warehouseService.toggleSupplierStatus(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, `Supplier ${data.name} is now ${data.status}`));
  }

  async getSupplierScorecard(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await warehouseService.getSupplierScorecard(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // WMS OPERATIONS CONTROLLER
  // ==========================================

  async getWmsOperations(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getWmsOperations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async dockCheckIn(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.dockCheckIn(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, `Inbound shipment ${data.id} checked in to ${data.dock}`));
  }

  async inspectAndAccept(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.inspectAndAccept(request.user.tenantId, request.body || {});
    return reply.send(formatSuccess(data, `Shipment inspected & accepted into put-away backlog`));
  }

  async completePutAway(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.completePutAway(request.user.tenantId, request.body || {});
    return reply.send(formatSuccess(data, data.message));
  }

  async recordStockMovementTask(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.recordStockMovementTask(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, `Stock movement ${data.id} logged cleanly`));
  }

  async createTransfer(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.createTransfer(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, `Inter-facility transfer ${data.id} initiated`));
  }

  async confirmPick(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.confirmPick(request.user.tenantId, request.body || {});
    return reply.send(formatSuccess(data, `Pick order completed`));
  }

  async releaseStaging(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.releaseStaging(request.user.tenantId, request.body || {});
    return reply.send(formatSuccess(data, `Staged materials released to line`));
  }

  async dispatchShipment(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.dispatchShipment(request.user.tenantId, request.body || {});
    return reply.send(formatSuccess(data, `Trailer dispatched & seal logged`));
  }

  // ==========================================
  // LOCATION & PHYSICAL STORAGE CONTROLLERS
  // ==========================================

  async listLocationsHierarchy(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listLocationsHierarchy(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async listLocations(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listLocations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getBinsLocations(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getBinsLocations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getPutAwayLogs(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getPutAwayLogs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getStagingLocations(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getStagingLocations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getLocationTransfers(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getLocationTransfers(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createLocationTransfer(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.createLocationTransfer(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  async relocateLocationStock(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.relocateLocationStock(request.user.tenantId, request.body || {});
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // INVENTORY OPERATIONS CONTROLLERS
  // ==========================================

  async getOpsMovements(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getOpsMovements(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getOpsTransfers(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getOpsTransfers(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleOpsTransferStatus(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const targetId = request.params?.id || (request.body as any)?.id || "";
    const data = await warehouseService.toggleOpsTransferStatus(request.user.tenantId, targetId, (request.body as any)?.status);
    return reply.send(formatSuccess(data, data.message));
  }

  async getOpsCycleCounts(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getOpsCycleCounts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async recordOpsCycleCount(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.recordOpsCycleCount(request.user.tenantId, request.body || {}, (request.user as any)?.id);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  async getOpsAdjustments(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getOpsAdjustments(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async recordOpsAdjustment(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.recordOpsAdjustment(request.user.tenantId, request.body || {}, (request.user as any)?.id);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  // ==========================================
  // TRACEABILITY & FDA 21 CFR CONTROLLER
  // ==========================================

  async getTraceability(request: FastifyRequest<{ Querystring: { lot?: string }; Params: { lotNumber?: string } }>, reply: FastifyReply) {
    const lotNumber = request.params?.lotNumber || request.query?.lot || "LOT-RM-ORG-4402";
    const data = await warehouseService.getTraceability(request.user.tenantId, lotNumber);
    return reply.send(formatSuccess(data));
  }

  async simulateRecall(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.simulateRecall(request.user.tenantId, request.body || {}, (request.user as any)?.id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // INVENTORY CONTROLLER (RAW, PACKAGING, FINISHED GOODS)
  // ==========================================

  async getRawMaterials(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getRawMaterials(request.user.tenantId, request.query || {});
    return reply.send(formatSuccess(data));
  }

  async toggleRawMaterialStatus(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const targetId = request.params?.id || (request.body as any)?.id || (request.body as any)?.lotNumber || "";
    const data = await warehouseService.toggleRawMaterialStatus(request.user.tenantId, targetId, request.body || {});
    return reply.send(formatSuccess(data, data.message || "Status updated"));
  }

  async getPackagingMaterials(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getPackagingMaterials(request.user.tenantId, request.query || {});
    return reply.send(formatSuccess(data));
  }

  async togglePackagingStatus(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const targetId = request.params?.id || (request.body as any)?.id || "";
    const data = await warehouseService.togglePackagingStatus(request.user.tenantId, targetId, request.body || {});
    return reply.send(formatSuccess(data, data.message || "Packaging status updated"));
  }

  async getFinishedGoods(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getFinishedGoods(request.user.tenantId, request.query || {});
    return reply.send(formatSuccess(data));
  }

  // ==========================================
  // OUTBOUND SHIPPING & LOGISTICS CONTROLLER
  // ==========================================

  async listShipmentOrders(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listShipmentOrders(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createShipmentOrder(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.createShipmentOrder(request.user.tenantId, request.body || {});
    return reply.status(201).send(formatSuccess(data, `Shipment ${data.id} created successfully`));
  }

  async updateShipmentOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await warehouseService.updateShipmentOrder(request.user.tenantId, request.params.id, request.body || {});
    return reply.send(formatSuccess(data, `Shipment ${request.params.id} updated successfully`));
  }

  async dispatchShipmentOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await warehouseService.dispatchShipmentOrder(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, `Shipment ${request.params.id} dispatched successfully`));
  }
  // ==========================================
  // PICKING & PALLETS CONTROLLERS
  // ==========================================

  async getPickingLists(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getPickingLists(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async startPickingList(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const id = request.params?.id || (request.body as any)?.id || (request.body as any)?.order || "PL-101";
    const data = await warehouseService.startPickingList(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async getPickingExecution(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getPickingExecution(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async confirmPickingExecution(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.confirmPickingExecution(request.user.tenantId, request.body || {}, (request.user as any)?.id);
    return reply.send(formatSuccess(data, data.message));
  }

  async getPalletsContainers(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getPalletsContainers(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async loadPalletContainer(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const id = request.params?.id || (request.body as any)?.id || "";
    const body = { ...(request.body || {}), id: id || (request.body as any)?.id };
    const data = await warehouseService.loadPalletContainer(request.user.tenantId, body, (request.user as any)?.id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // SHIPMENT TRACKING CONTROLLERS
  // ==========================================

  async getShipmentTracking(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getShipmentTracking(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleShipmentTrackingStatus(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const id = request.params?.id || (request.body as any)?.id || "TRK-9011";
    const status = (request.body as any)?.status;
    const data = await warehouseService.toggleShipmentTrackingStatus(request.user.tenantId, id, status);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // WAREHOUSE INVENTORY REPORTS CONTROLLERS
  // ==========================================

  async getWarehouseReports(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getWarehouseReports(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async generateWarehouseReport(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.generateWarehouseReport(request.user.tenantId, request.body || {}, (request.user as any)?.id);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  // ==========================================
  // WAREHOUSE NOTIFICATIONS & ALERTS CONTROLLERS
  // ==========================================

  async getWarehouseNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getWarehouseNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async markWarehouseNotificationRead(request: FastifyRequest<{ Params?: { id?: string } }>, reply: FastifyReply) {
    const id = request.params?.id || (request.body as any)?.id || 1;
    const data = await warehouseService.markWarehouseNotificationRead(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async markAllWarehouseNotificationsRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.markAllWarehouseNotificationsRead(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  async deleteWarehouseNotification(request: FastifyRequest<{ Params?: { id?: string } }>, reply: FastifyReply) {
    const id = request.params?.id || (request.body as any)?.id || 1;
    const data = await warehouseService.deleteWarehouseNotification(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async clearAllWarehouseNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.clearAllWarehouseNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // WAREHOUSE OPERATOR PROFILE CONTROLLERS
  // ==========================================

  async getWarehouseProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.getWarehouseProfile(request.user.tenantId, (request.user as any)?.id);
    return reply.send(formatSuccess(data));
  }

  async toggleWarehouseCertification(request: FastifyRequest<{ Params?: { id?: string }; Body?: any }>, reply: FastifyReply) {
    const certId = request.params?.id || (request.body as any)?.id || (request.body as any)?.certId || 1;
    const status = (request.body as any)?.status;
    const data = await warehouseService.toggleWarehouseCertification(request.user.tenantId, certId, status);
    return reply.send(formatSuccess(data, data.message));
  }
}

export const warehouseController = new WarehouseController();

