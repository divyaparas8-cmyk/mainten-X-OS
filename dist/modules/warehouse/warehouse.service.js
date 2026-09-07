"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseService = exports.WarehouseService = void 0;
const database_js_1 = require("../../config/database.js");
const warehouse_js_1 = require("../../db/schema/warehouse.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
class WarehouseService {
    async listLots(tenantId, plantId) {
        return await database_js_1.db.query.inventoryLots.findMany({
            where: (0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.tenantId, tenantId),
            with: {
                sku: true,
            },
        });
    }
    async createLot(tenantId, plantId, input) {
        const [lot] = await database_js_1.db
            .insert(warehouse_js_1.inventoryLots)
            .values({
            tenantId,
            plantId,
            skuId: input.skuId,
            lotNumber: input.lotNumber,
            lotType: input.lotType,
            supplierName: input.supplierName,
            supplierLotNumber: input.supplierLotNumber,
            initialQuantity: input.initialQuantity.toString(),
            currentQuantity: input.initialQuantity.toString(),
            uom: input.uom,
            locationBinId: input.locationBinId,
            expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
        })
            .returning();
        // Auto-create initial receipt transaction
        await database_js_1.db.insert(warehouse_js_1.inventoryTransactions).values({
            tenantId,
            plantId,
            lotId: lot.id,
            type: "RECEIPT",
            quantity: input.initialQuantity.toString(),
            uom: input.uom,
            toBinId: input.locationBinId,
            referenceType: "INITIAL_INBOUND_RECEIPT",
            referenceId: lot.lotNumber,
            notes: "Initial receipt into warehouse inventory",
        });
        return lot;
    }
    async recordTransaction(tenantId, plantId, input, userId) {
        const [lot] = await database_js_1.db.select().from(warehouse_js_1.inventoryLots).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.tenantId, tenantId), (0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.id, input.lotId)));
        if (!lot)
            throw new AppError_js_1.NotFoundError("Inventory Lot");
        const [tx] = await database_js_1.db
            .insert(warehouse_js_1.inventoryTransactions)
            .values({
            tenantId,
            plantId,
            lotId: input.lotId,
            type: input.type,
            quantity: input.quantity.toString(),
            uom: input.uom,
            fromBinId: input.fromBinId,
            toBinId: input.toBinId,
            referenceType: input.referenceType,
            referenceId: input.referenceId,
            notes: input.notes,
            performedBy: userId,
        })
            .returning();
        // Adjust lot balances based on transaction type
        let balanceDelta = 0;
        if (input.type === "RECEIPT")
            balanceDelta = Number(input.quantity);
        if (input.type === "CONSUMPTION" || input.type === "SHIPMENT" || input.type === "ISSUE")
            balanceDelta = -Math.abs(Number(input.quantity));
        if (input.type === "ADJUSTMENT")
            balanceDelta = Number(input.quantity);
        if (balanceDelta !== 0) {
            await database_js_1.db
                .update(warehouse_js_1.inventoryLots)
                .set({
                currentQuantity: (0, drizzle_orm_1.sql) `${warehouse_js_1.inventoryLots.currentQuantity} + ${balanceDelta}`,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.id, input.lotId));
        }
        return tx;
    }
    async listWarehouses(tenantId) {
        return await database_js_1.db.select().from(warehouse_js_1.warehouses).where((0, drizzle_orm_1.eq)(warehouse_js_1.warehouses.tenantId, tenantId));
    }
    async listBins(warehouseId) {
        if (warehouseId) {
            return await database_js_1.db.select().from(warehouse_js_1.locationBins).where((0, drizzle_orm_1.eq)(warehouse_js_1.locationBins.warehouseId, warehouseId));
        }
        return await database_js_1.db.select().from(warehouse_js_1.locationBins);
    }
}
exports.WarehouseService = WarehouseService;
exports.warehouseService = new WarehouseService();
//# sourceMappingURL=warehouse.service.js.map