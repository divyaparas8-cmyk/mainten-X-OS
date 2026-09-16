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
    deleteLot(tenantId: string, idOrLotNumber: string): Promise<{
        success: boolean;
        message: string;
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
        zone: string | null;
        warehouseId: string;
        binCode: string;
        aisle: string | null;
        rack: string | null;
        shelf: string | null;
        bin: string | null;
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
        dispatches: {
            id: any;
            realId: any;
            dest: any;
            cargo: any;
            status: any;
            carrier: any;
            trailerNo: any;
            bolNumber: any;
        }[];
        count: number;
        shipmentOrdersCount: number;
        freightStatus: string;
        carrier: any;
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
        id: any;
        tenantId: string | null;
        supplierCode: any;
        name: any;
        category: any;
        materialsSupplied: any;
        status: any;
        otifScore: string;
        qualityAcceptanceRate: string;
        avgLeadTimeDays: string;
        riskRating: any;
        contactEmail: any;
        contactPhone: any;
        lastOrder: any;
        openOrdersCount: any;
        activeContractsCount: any;
    }>;
    updateSupplier(tenantId: string, id: string, input: any): Promise<{
        status: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        category: string | null;
        supplierCode: string;
        materialsSupplied: string | null;
        otifScore: string | null;
        qualityAcceptanceRate: string | null;
        avgLeadTimeDays: string | null;
        riskRating: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        lastOrder: string | null;
        openOrdersCount: number | null;
        activeContractsCount: number | null;
    }>;
    toggleSupplierStatus(tenantId: string, id: string): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        category: string | null;
        supplierCode: string;
        materialsSupplied: string | null;
        otifScore: string | null;
        qualityAcceptanceRate: string | null;
        avgLeadTimeDays: string | null;
        riskRating: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        lastOrder: string | null;
        openOrdersCount: number | null;
        activeContractsCount: number | null;
    }>;
    deleteSupplier(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSupplierScorecard(tenantId: string, id: string): Promise<{
        success: boolean;
        supplierId: string;
        supplierName: string;
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
        tenantId: string | null;
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
    updateWmsReceiving(tenantId: string, id: string, input: any): Promise<any>;
    deleteWmsReceiving(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
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
    createLocation(tenantId: string, input: any): Promise<{
        id: any;
        tenantId: string | null;
        warehouse: any;
        zone: any;
        rack: any;
        location: any;
        fullHierarchy: any;
        capacityPallets: number;
        occupiedPallets: number;
        material: any;
        materialCode: any;
        batchLot: any;
        quantity: any;
        status: any;
        temp: any;
    }>;
    updateLocation(tenantId: string, id: string, input: any): Promise<{
        status: string | null;
        location: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        quantity: string | null;
        zone: string;
        rack: string;
        batchLot: string | null;
        warehouse: string;
        fullHierarchy: string | null;
        capacityPallets: number;
        occupiedPallets: number;
        material: string | null;
        materialCode: string | null;
        temp: string | null;
    }>;
    deleteLocation(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
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
    getTraceability(tenantId: string, lotNumber?: string): Promise<{
        batches: never[];
        activeLot: null;
        metrics: {
            traceIntegrityScore: string;
            linkedBatches: number;
            finishedGoodsOutput: string;
            customerDispatchDestinations: number;
        };
    } | {
        batches: any[];
        activeLot: {
            lotNumber: any;
            materialName: any;
            materialCode: any;
            category: string;
            type: string;
            quantity: string;
            supplier: string;
            tankNumber: any;
            currentLocation: string;
            receivedDate: string;
            qaStatus: any;
            qaCert: string;
            tempLog: string;
            integrityScore: string;
            batches: {
                batchId: any;
                product: any;
                sku: any;
                line: any;
                date: string;
                quantityProduced: string;
                status: any;
                ccpStatus: string;
                pallets: {
                    palletId: string;
                    cases: number;
                    lpn: string;
                    dest: string;
                }[];
            }[];
            recallImpact: {
                affectedBatches: number;
                finishedCases: number;
                palletsCount: number;
                customersExposed: string[];
                quarantineStatus: string;
            };
        };
        metrics: {
            traceIntegrityScore: string;
            linkedBatches: number;
            finishedGoodsOutput: string;
            customerDispatchDestinations: number;
        };
    }>;
    createTraceabilityBatch(tenantId: string, input: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        uom: string;
        skuId: string;
        productionOrderId: string;
        batchNumber: string;
        recipeVersion: string;
        tankNumber: string | null;
        targetVolume: string;
        actualVolume: string | null;
        currentStep: number;
        progressPercent: number;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
    updateTraceabilityBatch(tenantId: string, idOrBatch: string, input: any): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        productionOrderId: string;
        batchNumber: string;
        skuId: string;
        recipeVersion: string;
        tankNumber: string | null;
        targetVolume: string;
        actualVolume: string | null;
        uom: string;
        currentStep: number;
        progressPercent: number;
        status: string;
        startedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTraceabilityBatch(tenantId: string, idOrBatch: string): Promise<{
        success: boolean;
        deleted: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            plantId: string;
            uom: string;
            skuId: string;
            productionOrderId: string;
            batchNumber: string;
            recipeVersion: string;
            tankNumber: string | null;
            targetVolume: string;
            actualVolume: string | null;
            currentStep: number;
            progressPercent: number;
            startedAt: Date | null;
            completedAt: Date | null;
        }[];
    }>;
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
    getFinishedGoods(tenantId?: string, query?: any): Promise<{
        finishedGoods: {
            id: any;
            sku: any;
            productName: any;
            finishedLot: any;
            batch: any;
            batchNumber: any;
            quantity: any;
            location: any;
            storageLocation: any;
            productionDate: any;
            expiryDate: any;
            status: any;
            qaStatus: any;
            pallet: any;
            palletSerial: any;
            shipmentStatus: any;
            destination: any;
            tempCheck: any;
            notes: any;
            createdAt: any;
        }[];
        metrics: {
            totalFinishedPallets: string;
            readyForDispatch: string;
            qaReleaseRate: string;
            highBayOccupancy: string;
        };
    }>;
    createFinishedGood(tenantId: string, input: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        plantId: string | null;
        quantity: string;
        notes: string | null;
        batchNumber: string;
        sku: string;
        qaStatus: string | null;
        productName: string;
        expiryDate: string | null;
        destination: string | null;
        tempCheck: string | null;
        finishedLot: string;
        storageLocation: string;
        productionDate: string | null;
        palletSerial: string | null;
        shipmentStatus: string | null;
    }>;
    updateFinishedGood(tenantId: string, id: string, input: any): Promise<{
        id: string;
        tenantId: string | null;
        plantId: string | null;
        sku: string;
        productName: string;
        finishedLot: string;
        batchNumber: string;
        quantity: string;
        storageLocation: string;
        productionDate: string | null;
        expiryDate: string | null;
        qaStatus: string | null;
        palletSerial: string | null;
        shipmentStatus: string | null;
        destination: string | null;
        tempCheck: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteFinishedGood(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        plantId: string | null;
        quantity: string;
        notes: string | null;
        batchNumber: string;
        sku: string;
        qaStatus: string | null;
        productName: string;
        expiryDate: string | null;
        destination: string | null;
        tempCheck: string | null;
        finishedLot: string;
        storageLocation: string;
        productionDate: string | null;
        palletSerial: string | null;
        shipmentStatus: string | null;
    }>;
    listShipmentOrders(tenantId?: string): Promise<{
        shipmentOrders: {
            id: any;
            shipmentNumber: any;
            customer: any;
            customerName: any;
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
            createdAt: any;
        }[];
        metrics: {
            activeShipmentsToday: number;
            totalOutboundPallets: string;
            carrierOtif: string;
            dispatchedTrailers: number;
        };
    }>;
    createShipmentOrder(tenantId: string, input: any): Promise<{
        id: string;
        shipmentNumber: string | null;
        customer: string;
        customerName: string;
        orderNumber: string | null;
        finishedGoods: string | null;
        batchLot: string | null;
        quantity: string | null;
        carrier: any;
        shipDate: any;
        destination: any;
        status: string;
        trailerNo: string | null;
        sealNo: string | null;
        bolNumber: string | null;
        trackingMilestones: unknown;
    }>;
    updateShipmentOrder(tenantId: string, id: string, input: any): Promise<{
        id: string;
        tenantId: string | null;
        plantId: string | null;
        shipmentNumber: string | null;
        customerName: string;
        carrier: string | null;
        trackingNumber: string | null;
        status: string;
        dispatchDate: Date | null;
        shippedLots: unknown;
        orderNumber: string | null;
        finishedGoods: string | null;
        batchLot: string | null;
        quantity: string | null;
        destination: string | null;
        trailerNo: string | null;
        sealNo: string | null;
        bolNumber: string | null;
        trackingMilestones: unknown;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteShipmentOrder(tenantId: string, id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        plantId: string | null;
        quantity: string | null;
        orderNumber: string | null;
        customerName: string;
        shipmentNumber: string | null;
        carrier: string | null;
        trackingNumber: string | null;
        dispatchDate: Date | null;
        shippedLots: unknown;
        finishedGoods: string | null;
        batchLot: string | null;
        destination: string | null;
        trailerNo: string | null;
        sealNo: string | null;
        bolNumber: string | null;
        trackingMilestones: unknown;
    }>;
    dispatchShipmentOrder(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string | null;
        plantId: string | null;
        shipmentNumber: string | null;
        customerName: string;
        carrier: string | null;
        trackingNumber: string | null;
        status: string;
        dispatchDate: Date | null;
        shippedLots: unknown;
        orderNumber: string | null;
        finishedGoods: string | null;
        batchLot: string | null;
        quantity: string | null;
        destination: string | null;
        trailerNo: string | null;
        sealNo: string | null;
        bolNumber: string | null;
        trackingMilestones: unknown;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
            id: any;
            realId: any;
            trackingNumber: any;
            dest: any;
            status: any;
            carrier: any;
            trailerNo: any;
            eta: string;
            milestones: any;
        }[];
        activeShipments: {
            id: any;
            realId: any;
            trackingNumber: any;
            dest: any;
            status: any;
            carrier: any;
            trailerNo: any;
            eta: string;
            milestones: any;
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
            tenantId: string | null;
            plantId: string | null;
            shipmentNumber: string | null;
            customerName: string;
            carrier: string | null;
            trackingNumber: string | null;
            status: string;
            dispatchDate: Date | null;
            shippedLots: unknown;
            orderNumber: string | null;
            finishedGoods: string | null;
            batchLot: string | null;
            quantity: string | null;
            destination: string | null;
            trailerNo: string | null;
            sealNo: string | null;
            bolNumber: string | null;
            trackingMilestones: unknown;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
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