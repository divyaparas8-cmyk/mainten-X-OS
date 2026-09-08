"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityService = exports.QualityService = void 0;
const database_js_1 = require("../../config/database.js");
const quality_js_1 = require("../../db/schema/quality.js");
const production_js_1 = require("../../db/schema/production.js");
const users_js_1 = require("../../db/schema/users.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
const auth_service_js_1 = require("../auth/auth.service.js");
const auditContext_js_1 = require("../../middleware/auditContext.js");
const masterData_js_1 = require("../../db/schema/masterData.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class QualityService {
    async listCcpChecks(tenantId, plantId) {
        return await database_js_1.db.select().from(quality_js_1.ccpChecks).where((0, drizzle_orm_1.eq)(quality_js_1.ccpChecks.tenantId, tenantId));
    }
    async recordCcpCheck(tenantId, plantId, input, userId) {
        // Auto evaluate PASS/FAIL
        let status = "PASS";
        if (input.criticalLimitMin !== undefined && input.actualValue < input.criticalLimitMin) {
            status = "FAIL";
        }
        if (input.criticalLimitMax !== undefined && input.actualValue > input.criticalLimitMax) {
            status = "FAIL";
        }
        let lineId = input.lineId;
        if (!lineId || !(0, tenantContext_js_1.isValidUuid)(lineId)) {
            const [firstLine] = await database_js_1.db.select().from(masterData_js_1.productionLines).where((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.tenantId, tenantId)).limit(1);
            lineId = firstLine?.id || "c95201ab-a665-40ee-acd8-bd630e901932";
        }
        let batchId = input.batchId;
        if (!batchId || !(0, tenantContext_js_1.isValidUuid)(batchId)) {
            const [firstBatch] = await database_js_1.db.select().from(production_js_1.batches).where((0, drizzle_orm_1.eq)(production_js_1.batches.tenantId, tenantId)).limit(1);
            batchId = firstBatch?.id || "f2b711ac-68cd-4111-a6f4-256155a7776a";
        }
        const [check] = await database_js_1.db
            .insert(quality_js_1.ccpChecks)
            .values({
            tenantId,
            plantId,
            lineId,
            batchId,
            ccpCode: input.ccpCode,
            ccpName: input.ccpName,
            targetValue: input.targetValue.toString(),
            actualValue: input.actualValue.toString(),
            criticalLimitMin: input.criticalLimitMin?.toString(),
            criticalLimitMax: input.criticalLimitMax?.toString(),
            uom: input.uom,
            status,
            operatorId: userId,
            notes: input.notes,
        })
            .returning();
        return check;
    }
    async listQaReleaseQueue(tenantId) {
        return await database_js_1.db.query.batches.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(production_js_1.batches.tenantId, tenantId), (0, drizzle_orm_1.eq)(production_js_1.batches.status, "QA Pending")),
            with: {
                sku: true,
                steps: true,
                ccpChecks: true,
            },
        });
    }
    async authorizeBatchRelease(tenantId, plantId, input, userId, ipAddress) {
        const isPinValid = await auth_service_js_1.authService.verifyDigitalSignaturePin(userId, input.signaturePin);
        if (!isPinValid) {
            throw new AppError_js_1.UnauthorizedError("Invalid 21 CFR Part 11 Digital Signature PIN");
        }
        const [batch] = await database_js_1.db.select().from(production_js_1.batches).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(production_js_1.batches.tenantId, tenantId), (0, drizzle_orm_1.eq)(production_js_1.batches.id, input.batchId)));
        if (!batch)
            throw new AppError_js_1.NotFoundError("Batch");
        // Generate CoA Record
        const coaUrl = `https://maintenx.cloud/certificates/COA-${batch.batchNumber}.pdf`;
        const [release] = await database_js_1.db
            .insert(quality_js_1.qaReleases)
            .values({
            tenantId,
            plantId,
            batchId: input.batchId,
            disposition: input.disposition,
            dispositionBy: userId,
            digitalSignaturePinUsed: true,
            certificateOfAnalysisUrl: coaUrl,
            comments: input.comments,
        })
            .returning();
        // Update batch and order status
        await database_js_1.db
            .update(production_js_1.batches)
            .set({
            status: input.disposition === "RELEASED" ? "Released" : input.disposition,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(production_js_1.batches.id, input.batchId));
        if (input.disposition === "RELEASED") {
            await database_js_1.db
                .update(production_js_1.productionOrders)
                .set({
                status: "RELEASED_TO_WAREHOUSE",
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(production_js_1.productionOrders.id, batch.productionOrderId));
        }
        await (0, auditContext_js_1.logAuditTrail)({
            tenantId,
            plantId,
            userId,
            action: "QA_BATCH_RELEASE",
            entityType: "Batch",
            entityId: batch.batchNumber,
            newValues: { disposition: input.disposition, coaUrl },
            ipAddress,
        });
        return release;
    }
    async listQualityHolds(tenantId) {
        return await database_js_1.db.select().from(quality_js_1.qualityHolds).where((0, drizzle_orm_1.eq)(quality_js_1.qualityHolds.tenantId, tenantId));
    }
    async createQualityHold(tenantId, plantId, input, userId) {
        let resolvedBatchId = null;
        if (input.batchId) {
            if ((0, tenantContext_js_1.isValidUuid)(input.batchId)) {
                resolvedBatchId = input.batchId;
            }
            else {
                const [foundBatch] = await database_js_1.db
                    .select()
                    .from(production_js_1.batches)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(production_js_1.batches.tenantId, tenantId), (0, drizzle_orm_1.eq)(production_js_1.batches.batchNumber, input.batchId)))
                    .limit(1);
                if (foundBatch)
                    resolvedBatchId = foundBatch.id;
            }
        }
        let resolvedHoldBy = userId;
        if (!resolvedHoldBy || !(0, tenantContext_js_1.isValidUuid)(resolvedHoldBy)) {
            const [firstUser] = await database_js_1.db.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.tenantId, tenantId)).limit(1);
            resolvedHoldBy = firstUser?.id || "923145ab-8812-4cf3-a12b-bba711200192";
        }
        const [hold] = await database_js_1.db
            .insert(quality_js_1.qualityHolds)
            .values({
            tenantId,
            plantId,
            lotNumber: input.lotNumber,
            batchId: resolvedBatchId,
            reason: input.reason,
            severity: input.severity,
            holdBy: resolvedHoldBy,
        })
            .returning();
        return hold;
    }
}
exports.QualityService = QualityService;
exports.qualityService = new QualityService();
//# sourceMappingURL=quality.service.js.map