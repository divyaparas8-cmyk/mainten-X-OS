import { CreateLotInput, CreateTransactionInput } from "./warehouse.schema.js";
export declare class WarehouseService {
    listLots(tenantId: string, plantId?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        uom: string;
        skuId: string;
        lotNumber: string;
        lotType: string;
        supplierName: string | null;
        supplierLotNumber: string | null;
        initialQuantity: string;
        currentQuantity: string;
        reservedQuantity: string;
        locationBinId: string | null;
        mfgDate: Date | null;
        expiryDate: Date | null;
    }[]>;
    listTransactions(tenantId: string, plantId?: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        plantId: string;
        uom: string;
        quantity: string;
        notes: string | null;
        lotId: string;
        fromBinId: string | null;
        toBinId: string | null;
        referenceType: string | null;
        referenceId: string | null;
        performedBy: string | null;
    }[]>;
    createLot(tenantId: string, plantId: string, input: CreateLotInput): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        uom: string;
        skuId: string;
        lotNumber: string;
        lotType: string;
        supplierName: string | null;
        supplierLotNumber: string | null;
        initialQuantity: string;
        currentQuantity: string;
        reservedQuantity: string;
        locationBinId: string | null;
        mfgDate: Date | null;
        expiryDate: Date | null;
    }>;
    recordTransaction(tenantId: string, plantId: string, input: CreateTransactionInput, userId?: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        plantId: string;
        uom: string;
        quantity: string;
        notes: string | null;
        lotId: string;
        fromBinId: string | null;
        toBinId: string | null;
        referenceType: string | null;
        referenceId: string | null;
        performedBy: string | null;
    } | {
        id: string;
        tenantId: string;
        plantId: string;
        lotId: string;
        type: any;
        quantity: number;
        uom: string;
        referenceType: string;
        referenceId: string;
        notes: string;
        createdAt: string;
    }>;
    listWarehouses(tenantId: string): Promise<{
        code: string;
        type: string | null;
        id: string;
        name: string;
        tenantId: string;
        isActive: boolean;
        plantId: string;
    }[]>;
    listBins(warehouseId?: string): Promise<{
        id: string;
        warehouseId: string;
        binCode: string;
        aisle: string | null;
        rack: string | null;
        shelf: string | null;
        bin: string | null;
        zone: string | null;
        isOccupied: boolean;
    }[]>;
    getDashboardStats(tenantId: string, plantId?: string): Promise<{
        incomingDeliveries: string;
        activePickLists: string;
        finishedGoodsPallets: string;
        activeLotHolds: string;
        activeStage: string;
        sweetenerStageStatus: string;
        rawMaterialsCount: string;
        packagingCount: string;
        shipmentOrdersCount: string;
        freightStatus: string;
        totalLots: number;
        lastUpdated: string;
    }>;
    listIncomingDeliveries(tenantId: string): Promise<{
        deliveries: any[];
        inTransitCount: number;
        arrivedCount: number;
    }>;
    toggleDeliveryStatus(tenantId: string, id: string): Promise<any>;
    quickReceive(tenantId: string, plantId: string, data: any): Promise<{
        success: boolean;
        lot: {
            lotNumber: any;
            materialCode: any;
            materialName: any;
            category: any;
            quantity: number;
            unit: any;
            location: any;
            supplier: any;
            supplierLot: any;
            qaStatus: any;
            costPerUnitUSD: any;
            barcode: any;
            receivedAt: string;
        };
        status: string;
        receivedAt: string;
        message: string;
    }>;
    getScannerStats(tenantId: string): Promise<{
        stats: {
            todayIntakeScans: string;
            firstPassReadRate: string;
            activeReceivingDocks: string;
            pendingPutAway: string;
        };
        recentLogs: any[];
    }>;
    scanBarcode(tenantId: string, barcode: string): Promise<{
        success: boolean;
        barcode: string;
        matched: boolean;
        scanRecord: {
            id: string;
            barcode: string;
            symbology: string;
            lotCode: string;
            gtin: string;
            materialName: string;
            dockBay: string;
            targetBin: string;
            qaStatus: string;
            confidence: string;
            scannedAt: string;
        };
        lot: any;
        scannedAt: string;
    }>;
    getInventoryStatus(tenantId: string): Promise<{
        items: any[];
        status: any[];
        metrics: {
            totalMonitoredSkus: number;
            healthyBuffers: number;
            underSafetyBuffer: number;
            rawMaterialsCount: number;
            packagingCount: number;
            totalLots: number;
            lastAudit: string;
        };
    }>;
    toggleInventoryStatus(tenantId: string, id: any, input?: any): Promise<{
        success: boolean;
        item: any;
        message: string;
        id?: undefined;
        bufferStatus?: undefined;
    } | {
        success: boolean;
        id: any;
        bufferStatus: any;
        message: string;
        item?: undefined;
    }>;
    replenishBuffer(tenantId: string, id: any, input?: any): Promise<{
        success: boolean;
        item: any;
        message: string;
        id?: undefined;
        bufferStatus?: undefined;
    } | {
        success: boolean;
        id: any;
        bufferStatus: string;
        message: string;
        item?: undefined;
    }>;
    getDispatchSummary(tenantId: string): Promise<{
        shipmentOrdersCount: number;
        freightStatus: string;
        carrier: string;
        scheduledDeparture: string;
    }>;
    listPurchaseOrders(tenantId: string): Promise<{
        purchaseOrders: any[];
        metrics: {
            activeSpend: any;
            inboundShipments: number;
            expeditedFreight: number;
            receivedAndStaged: number;
        };
    }>;
    createPurchaseOrder(tenantId: string, input: any): Promise<{
        poNumber: any;
        supplierName: any;
        supplierCode: any;
        orderDate: any;
        deliveryDueDate: any;
        totalAmountUSD: number;
        itemsCount: any;
        status: any;
        receivingStatus: any;
        buyer: any;
        priority: any;
        lines: any;
    }>;
    updatePurchaseOrder(tenantId: string, poNumber: string, input: any): Promise<any>;
    approvePurchaseOrder(tenantId: string, poNumber: string): Promise<any>;
    receivePurchaseOrder(tenantId: string, poNumber: string): Promise<any>;
    cancelPurchaseOrder(tenantId: string, poNumber: string): Promise<any>;
    printPurchaseOrder(tenantId: string, poNumber: string): Promise<{
        success: boolean;
        poNumber: string;
        documentUrl: string;
        downloadedAt: string;
        message: string;
    }>;
    listSuppliers(tenantId: string): Promise<{
        suppliers: any[];
        metrics: {
            activeVendors: number;
            meanOtif: string;
            avgLeadTime: string;
            inboundQualityRate: string;
        };
    }>;
    createSupplier(tenantId: string, input: any): Promise<{
        id: string;
        supplierCode: any;
        name: any;
        category: any;
        materialsSupplied: any;
        status: string;
        otifScore: number;
        qualityAcceptanceRate: number;
        avgLeadTimeDays: number;
        riskRating: any;
        contactEmail: any;
        contactPhone: any;
        lastOrder: string;
        openOrdersCount: number;
        activeContractsCount: number;
    }>;
    updateSupplier(tenantId: string, id: string, input: any): Promise<any>;
    toggleSupplierStatus(tenantId: string, id: string): Promise<any>;
    getSupplierScorecard(tenantId: string, id: string): Promise<{
        success: boolean;
        supplierId: any;
        supplierName: any;
        scorecardUrl: string;
        downloadedAt: string;
        message: string;
    }>;
    getWmsOperations(tenantId: string): Promise<{
        receivingTasks: any[];
        putAwayTasks: any[];
        movementLogs: any[];
        transfers: any[];
        pickOrders: any[];
        stagingBays: any[];
        dispatchOrders: any[];
        metrics: {
            inboundDocks: number;
            putAwayBacklog: number;
            activePickingWaves: number;
            readyForDispatch: number;
        };
    }>;
    dockCheckIn(tenantId: string, input: any): Promise<{
        id: any;
        poNumber: any;
        supplier: any;
        item: any;
        qty: any;
        dock: any;
        carrier: any;
        trailerNo: any;
        tempCheck: any;
        bolNumber: any;
        status: any;
    }>;
    inspectAndAccept(tenantId: string, input: any): Promise<{
        task: any;
        putAwayTask: {
            id: string;
            lot: any;
            material: any;
            qty: any;
            source: any;
            targetBin: string;
            priority: string;
            status: string;
        };
    }>;
    completePutAway(tenantId: string, input: any): Promise<{
        success: boolean;
        completedTask: any;
        message: string;
    }>;
    recordStockMovementTask(tenantId: string, input: any): Promise<{
        id: string;
        lot: any;
        material: any;
        qty: any;
        fromBin: any;
        toBin: any;
        operator: any;
        time: string;
        reason: any;
    }>;
    createTransfer(tenantId: string, input: any): Promise<{
        id: string;
        fromFacility: any;
        toFacility: any;
        item: any;
        qty: any;
        carrier: any;
        eta: any;
        status: string;
    }>;
    confirmPick(tenantId: string, input: any): Promise<any>;
    releaseStaging(tenantId: string, input: any): Promise<any>;
    dispatchShipment(tenantId: string, input: any): Promise<any>;
    listLocationsHierarchy(tenantId: string): Promise<{
        locations: any[];
        metrics: {
            activeWarehouses: string;
            globalRackOccupancy: string;
            coldZoneTempSla: string;
            availableEmptyBins: number;
        };
    }>;
    listLocations(tenantId: string): Promise<{
        locations: any[];
        metrics: {
            activeWarehouses: string;
            globalRackOccupancy: string;
            coldZoneTempSla: string;
            availableEmptyBins: number;
        };
    }>;
    getBinsLocations(tenantId: string): Promise<{
        bins: {
            id: any;
            binCode: any;
            zone: any;
            capacity: any;
            occupied: any;
            material: any;
            lot: any;
            temp: any;
            status: any;
        }[];
        putAwayQueue: any[];
        metrics: {
            totalWarehouseBins: string;
            overallUtilization: string;
            pendingPutAway: number;
            coldStorageCapacity: string;
        };
    }>;
    getPutAwayLogs(tenantId: string): Promise<{
        logs: any[];
        count: number;
        totalPutAways: number;
        status: string;
    }>;
    getStagingLocations(tenantId: string): Promise<{
        stagedLots: {
            id: any;
            lotNumber: any;
            materialName: any;
            quantity: any;
            palletsCount: number;
            location: any;
            status: string;
            tempCheck: string;
            qaStatus: string;
            supplier: string;
            poNumber: string;
        }[];
        dockBays: {
            bay: string;
            material: string;
            status: string;
            pallets: number;
        }[];
        metrics: {
            activeStagedPallets: string;
            coldChainMonitored: string;
            awaitingPutAway: string;
            avgDockDwellTime: string;
        };
    }>;
    getLocationTransfers(tenantId: string): Promise<{
        transfers: any[];
        locations: any[];
        recentTransfers: {
            id: string;
            lotCode: string;
            from: string;
            to: string;
            operator: string;
            timestamp: string;
        }[];
    }>;
    createLocationTransfer(tenantId: string, input: any): Promise<{
        success: boolean;
        transfer: {
            id: string;
            lotCode: any;
            from: any;
            to: any;
            operator: any;
            status: string;
            timestamp: string;
        };
        message: string;
    }>;
    relocateLocationStock(tenantId: string, input: any): Promise<{
        success: boolean;
        sourceLocationId: any;
        targetLocationId: any;
        message: string;
    }>;
    getOpsMovements(tenantId: string): Promise<{
        movements: any[];
        count: number;
    }>;
    getOpsTransfers(tenantId: string): Promise<{
        transfers: {
            id: number;
            lot: string;
            qty: string;
            from: string;
            to: string;
            status: string;
        }[];
        count: number;
    }>;
    toggleOpsTransferStatus(tenantId: string, id: any, status?: string): Promise<{
        success: boolean;
        id: any;
        status: string;
        message: string;
    }>;
    getOpsCycleCounts(tenantId: string): Promise<{
        part: string;
        systemCount: number;
        actualCount: number;
        recentCounts: {
            id: string;
            sku: string;
            systemCount: number;
            actualCount: number;
            variance: number;
            status: string;
            date: string;
        }[];
    }>;
    recordOpsCycleCount(tenantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        material: any;
        sysCount: number;
        actCount: number;
        variance: number;
        message: string;
    }>;
    getOpsAdjustments(tenantId: string): Promise<{
        sku: string;
        quantityAdjustment: number;
        reason: string;
        recentAdjustments: {
            id: string;
            sku: string;
            qtyChange: number;
            reason: string;
            timestamp: string;
        }[];
    }>;
    recordOpsAdjustment(tenantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        sku: any;
        qtyChange: number;
        reason: any;
        message: string;
    }>;
    getTraceability(tenantId: string, lotNumber?: string): Promise<any>;
    simulateRecall(tenantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        recallCode: string;
        targetLotNumber: any;
        impactSummary: {
            affectedLot: any;
            reason: any;
            recallCode: string;
            lockedAt: string;
            action: string;
        };
        message: string;
    }>;
    getFinishedGoods(tenantId: string, query?: any): Promise<{
        finishedGoods: any[];
        metrics: {
            totalFinishedPallets: string;
            readyForDispatch: string;
            qaReleaseRate: string;
            highBayOccupancy: string;
        };
    }>;
    listShipmentOrders(tenantId: string): Promise<{
        shipmentOrders: any[];
        metrics: {
            activeShipmentsToday: number;
            totalOutboundPallets: string;
            carrierOtif: string;
            dispatchedTrailers: number;
        };
    }>;
    createShipmentOrder(tenantId: string, input: any): Promise<{
        id: any;
        customer: any;
        orderNumber: any;
        finishedGoods: any;
        batchLot: any;
        quantity: any;
        carrier: any;
        shipDate: any;
        destination: any;
        status: any;
        trailerNo: any;
        sealNo: any;
        bolNumber: any;
        trackingMilestones: any;
    }>;
    updateShipmentOrder(tenantId: string, id: string, input: any): Promise<any>;
    dispatchShipmentOrder(tenantId: string, id: string): Promise<any>;
    getRawMaterials(tenantId: string, query?: any): Promise<{
        materials: any[];
        metrics: {
            totalLots: number;
            stagedLots: number;
            secureStockCount: number;
            allocatedCount: number;
        };
    }>;
    toggleRawMaterialStatus(tenantId: string, idOrLotNumber: string, input?: any): Promise<{
        success: boolean;
        item: any;
        message: string;
        id?: undefined;
        status?: undefined;
    } | {
        success: boolean;
        id: string;
        status: any;
        item?: undefined;
        message?: undefined;
    }>;
    getPackagingMaterials(tenantId: string, query?: any): Promise<{
        packaging: any[];
        metrics: {
            totalItems: number;
            secureStockCount: number;
            lowStockAlerts: number;
            totalUnits: string;
        };
    }>;
    togglePackagingStatus(tenantId: string, id: any, input?: any): Promise<{
        success: boolean;
        item: any;
        message: string;
        id?: undefined;
        status?: undefined;
    } | {
        success: boolean;
        id: any;
        status: any;
        item?: undefined;
        message?: undefined;
    }>;
    getPickingLists(tenantId: string): Promise<{
        pickLists: any[];
        lists: any[];
        metrics: {
            totalLists: number;
            pending: number;
            inProgress: number;
            completed: number;
        };
    }>;
    startPickingList(tenantId: string, id: string): Promise<{
        success: boolean;
        list: any;
        message: string;
        id?: undefined;
        status?: undefined;
    } | {
        success: boolean;
        id: string;
        status: string;
        message: string;
        list?: undefined;
    }>;
    getPickingExecution(tenantId: string): Promise<{
        items: any[];
        count: number;
        metrics: {
            pendingPicks: number;
            completedPicks: number;
        };
    }>;
    confirmPickingExecution(tenantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        item: any;
        message: string;
    }>;
    getPalletsContainers(tenantId: string): Promise<{
        pallets: any[];
        count: number;
        metrics: {
            totalPallets: number;
            staged: number;
            loaded: number;
        };
    }>;
    loadPalletContainer(tenantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        pallet: any;
        message: string;
    }>;
    getShipmentTracking(tenantId: string): Promise<{
        trackingList: {
            id: string;
            orderId: string;
            dest: string;
            destination: string;
            status: string;
            eta: string;
            carrier: string;
            trailerNo: string;
        }[];
        activeShipments: {
            id: string;
            orderId: string;
            dest: string;
            destination: string;
            status: string;
            eta: string;
            carrier: string;
            trailerNo: string;
        }[];
        count: number;
        metrics: {
            totalTracked: number;
            inTransit: number;
            delivered: number;
        };
    }>;
    toggleShipmentTrackingStatus(tenantId: string, id: string, newStatus?: string): Promise<{
        success: boolean;
        shipment: {
            id: string;
            orderId: string;
            dest: string;
            destination: string;
            status: string;
            eta: string;
            carrier: string;
            trailerNo: string;
        };
        message: string;
        id?: undefined;
        status?: undefined;
    } | {
        success: boolean;
        id: string;
        status: string;
        message: string;
        shipment?: undefined;
    }>;
    getWarehouseReports(tenantId: string): Promise<{
        reports: {
            id: string;
            name: string;
            date: string;
            type: string;
            format: string;
            itemsCount: number;
        }[];
        count: number;
        metrics: {
            totalReports: number;
            lastGenerated: string;
        };
    }>;
    generateWarehouseReport(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        report: {
            id: string;
            name: any;
            date: string;
            type: any;
            format: any;
            itemsCount: any;
        };
        message: string;
    }>;
    getWarehouseNotifications(tenantId: string): Promise<{
        notifications: {
            id: number;
            title: string;
            msg: string;
            time: string;
            path: string;
            type: string;
            badge: string;
            read: boolean;
        }[];
        unreadCount: number;
        totalCount: number;
    }>;
    markWarehouseNotificationRead(tenantId: string, id: string | number): Promise<{
        success: boolean;
        id: string | number;
        unreadCount: number;
        message: string;
    }>;
    markAllWarehouseNotificationsRead(tenantId: string): Promise<{
        success: boolean;
        unreadCount: number;
        message: string;
    }>;
    deleteWarehouseNotification(tenantId: string, id: string | number): Promise<{
        success: boolean;
        id: string | number;
        notifications: {
            id: number;
            title: string;
            msg: string;
            time: string;
            path: string;
            type: string;
            badge: string;
            read: boolean;
        }[];
        message: string;
    }>;
    clearAllWarehouseNotifications(tenantId: string): Promise<{
        success: boolean;
        notifications: never[];
        unreadCount: number;
        message: string;
    }>;
    getWarehouseProfile(tenantId: string, userId?: string): Promise<{
        profile: {
            id: string;
            name: string;
            initials: string;
            role: string;
            badges: string[];
            metrics: {
                cycleCountAccuracy: string;
                palletsDispatched: number;
            };
            certifications: {
                id: number;
                name: string;
                status: string;
                activeVariant: string;
                inactiveVariant: string;
            }[];
        };
        user: {
            id: string;
            name: string;
            initials: string;
            role: string;
            badges: string[];
            metrics: {
                cycleCountAccuracy: string;
                palletsDispatched: number;
            };
            certifications: {
                id: number;
                name: string;
                status: string;
                activeVariant: string;
                inactiveVariant: string;
            }[];
        };
    }>;
    toggleWarehouseCertification(tenantId: string, certId: number | string, newStatus?: string): Promise<{
        success: boolean;
        cert: {
            id: number;
            name: string;
            status: string;
            activeVariant: string;
            inactiveVariant: string;
        };
        message: string;
        certId?: undefined;
        status?: undefined;
    } | {
        success: boolean;
        certId: string | number;
        status: string;
        message: string;
        cert?: undefined;
    }>;
}
export declare const warehouseService: WarehouseService;
//# sourceMappingURL=warehouse.service.d.ts.map