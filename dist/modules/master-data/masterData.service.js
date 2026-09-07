"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataService = exports.MasterDataService = void 0;
const database_js_1 = require("../../config/database.js");
const masterData_js_1 = require("../../db/schema/masterData.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
class MasterDataService {
    async listSkus(tenantId) {
        return await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId));
    }
    async createSku(tenantId, input) {
        const [newSku] = await database_js_1.db
            .insert(masterData_js_1.skus)
            .values({
            tenantId,
            skuCode: input.skuCode,
            name: input.name,
            category: input.category,
            familyId: input.familyId,
            uom: input.uom,
            barcode: input.barcode,
            standardCost: input.standardCost.toString(),
            shelfLifeDays: input.shelfLifeDays,
            minStockLevel: input.minStockLevel.toString(),
            maxStockLevel: input.maxStockLevel.toString(),
        })
            .returning();
        return newSku;
    }
    async listBoms(tenantId) {
        return await database_js_1.db.query.boms.findMany({
            where: (0, drizzle_orm_1.eq)(masterData_js_1.boms.tenantId, tenantId),
            with: {
                sku: true,
                items: {
                    with: {
                        componentSku: true,
                    },
                },
            },
        });
    }
    async getBomById(tenantId, id) {
        const bom = await database_js_1.db.query.boms.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.boms.tenantId, tenantId), (0, drizzle_orm_1.eq)(masterData_js_1.boms.id, id)),
            with: {
                sku: true,
                items: {
                    with: {
                        componentSku: true,
                    },
                },
            },
        });
        if (!bom)
            throw new AppError_js_1.NotFoundError("BOM Recipe");
        return bom;
    }
    async listLines(tenantId, plantId) {
        if (plantId) {
            return await database_js_1.db.select().from(masterData_js_1.productionLines).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.tenantId, tenantId), (0, drizzle_orm_1.eq)(masterData_js_1.productionLines.plantId, plantId)));
        }
        return await database_js_1.db.select().from(masterData_js_1.productionLines).where((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.tenantId, tenantId));
    }
    async listWorkCenters(tenantId, plantId) {
        if (plantId) {
            return await database_js_1.db.select().from(masterData_js_1.workCenters).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.workCenters.tenantId, tenantId), (0, drizzle_orm_1.eq)(masterData_js_1.workCenters.plantId, plantId)));
        }
        return await database_js_1.db.select().from(masterData_js_1.workCenters).where((0, drizzle_orm_1.eq)(masterData_js_1.workCenters.tenantId, tenantId));
    }
    async listAssets(tenantId, plantId) {
        if (plantId) {
            return await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.assets.tenantId, tenantId), (0, drizzle_orm_1.eq)(masterData_js_1.assets.plantId, plantId)));
        }
        return await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.eq)(masterData_js_1.assets.tenantId, tenantId));
    }
    async listStaff(tenantId, plantId) {
        if (plantId) {
            return await database_js_1.db.select().from(masterData_js_1.staff).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.staff.tenantId, tenantId), (0, drizzle_orm_1.eq)(masterData_js_1.staff.plantId, plantId)));
        }
        return await database_js_1.db.select().from(masterData_js_1.staff).where((0, drizzle_orm_1.eq)(masterData_js_1.staff.tenantId, tenantId));
    }
    async listQualitySpecs(tenantId) {
        return await database_js_1.db.select().from(masterData_js_1.qualitySpecs).where((0, drizzle_orm_1.eq)(masterData_js_1.qualitySpecs.tenantId, tenantId));
    }
}
exports.MasterDataService = MasterDataService;
exports.masterDataService = new MasterDataService();
//# sourceMappingURL=masterData.service.js.map