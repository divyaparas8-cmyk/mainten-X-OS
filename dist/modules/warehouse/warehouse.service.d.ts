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
        sku: never;
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
    recordTransaction(tenantId: string, plantId: string, input: CreateTransactionInput, userId: string): Promise<{
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
}
export declare const warehouseService: WarehouseService;
//# sourceMappingURL=warehouse.service.d.ts.map