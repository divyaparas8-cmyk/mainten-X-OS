import { FastifyReply, FastifyRequest } from "fastify";
export declare class WarehouseController {
    getLots(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createLot(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recordTransaction(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getTransactions(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getWarehouses(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBins(request: FastifyRequest<{
        Querystring: {
            warehouseId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getDashboardStats(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listIncomingDeliveries(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleDeliveryStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getScannerStats(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    quickReceive(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    scanBarcode(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getInventoryStatus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleInventoryStatus(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    replenishInventoryBuffer(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getDispatchSummary(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listPurchaseOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPurchaseOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updatePurchaseOrder(request: FastifyRequest<{
        Params: {
            poNumber: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    approvePurchaseOrder(request: FastifyRequest<{
        Params: {
            poNumber: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    receivePurchaseOrder(request: FastifyRequest<{
        Params: {
            poNumber: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    cancelPurchaseOrder(request: FastifyRequest<{
        Params: {
            poNumber: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    printPurchaseOrder(request: FastifyRequest<{
        Params: {
            poNumber: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    listSuppliers(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createSupplier(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateSupplier(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    toggleSupplierStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSupplierScorecard(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getWmsOperations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    dockCheckIn(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    inspectAndAccept(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    completePutAway(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recordStockMovementTask(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createTransfer(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    confirmPick(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    releaseStaging(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    dispatchShipment(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listLocationsHierarchy(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listLocations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBinsLocations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPutAwayLogs(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getStagingLocations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getLocationTransfers(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createLocationTransfer(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    relocateLocationStock(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getOpsMovements(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getOpsTransfers(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleOpsTransferStatus(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getOpsCycleCounts(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recordOpsCycleCount(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getOpsAdjustments(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recordOpsAdjustment(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getTraceability(request: FastifyRequest<{
        Querystring: {
            lot?: string;
        };
        Params: {
            lotNumber?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    simulateRecall(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getRawMaterials(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleRawMaterialStatus(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getPackagingMaterials(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    togglePackagingStatus(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getFinishedGoods(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listShipmentOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createShipmentOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateShipmentOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    dispatchShipmentOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPickingLists(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    startPickingList(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getPickingExecution(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    confirmPickingExecution(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPalletsContainers(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    loadPalletContainer(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getShipmentTracking(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleShipmentTrackingStatus(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
    getWarehouseReports(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    generateWarehouseReport(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getWarehouseNotifications(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    markWarehouseNotificationRead(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    markAllWarehouseNotificationsRead(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteWarehouseNotification(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    clearAllWarehouseNotifications(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getWarehouseProfile(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleWarehouseCertification(request: FastifyRequest<{
        Params?: {
            id?: string;
        };
        Body?: any;
    }>, reply: FastifyReply): Promise<never>;
}
export declare const warehouseController: WarehouseController;
//# sourceMappingURL=warehouse.controller.d.ts.map