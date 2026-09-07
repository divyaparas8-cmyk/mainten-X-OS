"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityService = exports.QualityService = void 0;
const database_js_1 = require("../../config/database.js");
const quality_js_1 = require("../../db/schema/quality.js");
const production_js_1 = require("../../db/schema/production.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
const auth_service_js_1 = require("../auth/auth.service.js");
const auditContext_js_1 = require("../../middleware/auditContext.js");
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
        const [check] = await database_js_1.db
            .insert(quality_js_1.ccpChecks)
            .values({
            tenantId,
            plantId,
            lineId: input.lineId,
            batchId: input.batchId,
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
        const [hold] = await database_js_1.db
            .insert(quality_js_1.qualityHolds)
            .values({
            tenantId,
            plantId,
            lotNumber: input.lotNumber,
            batchId: input.batchId,
            reason: input.reason,
            severity: input.severity,
            holdBy: userId,
        })
            .returning();
        return hold;
    }
}
exports.QualityService = QualityService;
exports.qualityService = new QualityService();
//# sourceMappingURL=quality.service.js.map