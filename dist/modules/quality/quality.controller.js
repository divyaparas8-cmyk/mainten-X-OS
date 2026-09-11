"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityController = exports.QualityController = void 0;
const quality_service_js_1 = require("./quality.service.js");
const quality_schema_js_1 = require("./quality.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class QualityController {
    async getQualitySummary(request, reply) {
        const data = await quality_service_js_1.qualityService.getQualitySummary(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getCcpChecks(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.listCcpChecks(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async recordCcpCheck(request, reply) {
        const input = quality_schema_js_1.recordCcpCheckSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.recordCcpCheck(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `CCP check recorded (${data.status})`));
    }
    async getQaReleaseQueue(request, reply) {
        const data = await quality_service_js_1.qualityService.listQaReleaseQueue(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async authorizeBatchRelease(request, reply) {
        const input = quality_schema_js_1.qaBatchReleaseSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.authorizeBatchRelease(request.user.tenantId, plantId, input, request.user.userId, request.ip);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Batch disposition digitally signed & QA Release approved (21 CFR Part 11)"));
    }
    async getQualityHolds(request, reply) {
        const data = await quality_service_js_1.qualityService.listQualityHolds(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createQualityHold(request, reply) {
        const input = quality_schema_js_1.createQualityHoldSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.createQualityHold(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Lot placed on quarantine hold"));
    }
    async getDeviations(request, reply) {
        const data = await quality_service_js_1.qualityService.listDeviations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async reportDeviation(request, reply) {
        const input = quality_schema_js_1.createDeviationSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.reportDeviation(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Deviation reported successfully"));
    }
    async submitPreOp(request, reply) {
        const input = quality_schema_js_1.submitPreOpSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.submitPreOpChecklist(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async submitSanitation(request, reply) {
        const input = quality_schema_js_1.submitSanitationSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.submitSanitationChecklist(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getAllergenAudits(request, reply) {
        const data = await quality_service_js_1.qualityService.listAllergenAudits(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async clearAllergenAudit(request, reply) {
        const input = quality_schema_js_1.clearAllergenAuditSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.clearAllergenAudit(request.user.tenantId, plantId, input, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Allergen verification cleared"));
    }
    async clearAllAllergenAudits(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.clearAllAllergenAudits(request.user.tenantId, plantId, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportAllergenAudits(request, reply) {
        const data = await quality_service_js_1.qualityService.exportAllergenAudits(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getLineReadiness(request, reply) {
        const data = await quality_service_js_1.qualityService.listLineReadiness(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleLineReadiness(request, reply) {
        const input = quality_schema_js_1.toggleLineReadinessSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.toggleLineReadiness(request.user.tenantId, plantId, input, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Line readiness updated to ${data.newStatus}`));
    }
    async authorizeAllLines(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.authorizeAllLines(request.user.tenantId, plantId, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportLineReadiness(request, reply) {
        const data = await quality_service_js_1.qualityService.exportLineReadiness(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getCleaningVerification(request, reply) {
        const data = await quality_service_js_1.qualityService.getCleaningVerification(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async verifyCleaning(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.verifyCleaning(request.user.tenantId, plantId, request.body || {}, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async resetCleaningVerification(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.resetCleaningVerification(request.user.tenantId, plantId, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getProcessChecks(request, reply) {
        const data = await quality_service_js_1.qualityService.listProcessChecks(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async recordProcessCheck(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.recordProcessCheck(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleProcessCheck(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.toggleProcessCheck(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async calibrateAllProcessChecks(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.calibrateAllProcessChecks(request.user.tenantId, plantId, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportProcessChecks(request, reply) {
        const data = await quality_service_js_1.qualityService.exportProcessChecks(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getProductChecks(request, reply) {
        const data = await quality_service_js_1.qualityService.listProductChecks(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async recordProductCheck(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.recordProductCheck(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async exportProductChecks(request, reply) {
        const data = await quality_service_js_1.qualityService.exportProductChecks(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getQualitySpecs(request, reply) {
        const data = await quality_service_js_1.qualityService.listQualitySpecs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createQualitySpec(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.createQualitySpec(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async toggleQualitySpecCcp(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.toggleQualitySpecCcp(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportQualitySpecs(request, reply) {
        const data = await quality_service_js_1.qualityService.exportQualitySpecs(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportCcpChecks(request, reply) {
        const data = await quality_service_js_1.qualityService.exportCcpChecks(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportDeviations(request, reply) {
        const data = await quality_service_js_1.qualityService.exportDeviations(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportNcrReports(request, reply) {
        const data = await quality_service_js_1.qualityService.exportNcrReports(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportQualityHolds(request, reply) {
        const data = await quality_service_js_1.qualityService.exportQualityHolds(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportInvestigations(request, reply) {
        const data = await quality_service_js_1.qualityService.exportInvestigations(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportBatchReviews(request, reply) {
        const data = await quality_service_js_1.qualityService.exportBatchReviews(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportReleaseQueue(request, reply) {
        const data = await quality_service_js_1.qualityService.exportReleaseQueue(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async startInvestigation(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.startInvestigation(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Investigation initiated"));
    }
    async getInvestigations(request, reply) {
        const data = await quality_service_js_1.qualityService.listInvestigations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async saveInvestigationFinding(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.saveInvestigationFinding(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Investigation findings saved"));
    }
    async completeInvestigation(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.completeInvestigation(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getNcrReports(request, reply) {
        const data = await quality_service_js_1.qualityService.listNcrReports(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createNcrReport(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.createNcrReport(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Non-Conformance Report logged"));
    }
    async reviewNcrReport(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.reviewNcrReport(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async reviewQualityHold(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.reviewQualityHold(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Quality hold reviewed"));
    }
    async releaseQualityHold(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.releaseQualityHold(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Lot released from quarantine hold"));
    }
    async getBatchQualityReviews(request, reply) {
        const data = await quality_service_js_1.qualityService.listBatchQualityReviews(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async reviewBatchDossier(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.reviewBatchDossier(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getApprovedReleases(request, reply) {
        const data = await quality_service_js_1.qualityService.listApprovedReleases(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleApprovedRelease(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.toggleApprovedReleaseStatus(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportApprovedReleases(request, reply) {
        const data = await quality_service_js_1.qualityService.exportApprovedReleases(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getBlockedBatches(request, reply) {
        const data = await quality_service_js_1.qualityService.listBlockedBatches(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleBlockedBatch(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.toggleBlockedBatchStatus(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportBlockedBatches(request, reply) {
        const data = await quality_service_js_1.qualityService.exportBlockedBatches(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getDispositionRelease(request, reply) {
        const data = await quality_service_js_1.qualityService.listDispositionRelease(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getDispositionRework(request, reply) {
        const data = await quality_service_js_1.qualityService.getDispositionRework(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getDispositionReject(request, reply) {
        const data = await quality_service_js_1.qualityService.getDispositionReject(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getDispositionDowngrade(request, reply) {
        const data = await quality_service_js_1.qualityService.getDispositionDowngrade(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async authorizeDisposition(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.authorizeDisposition(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async submitReworkInstruction(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.submitReworkInstruction(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async submitRejectAuthorization(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.submitRejectAuthorization(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async submitDowngradeAuthorization(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.submitDowngradeAuthorization(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getCapaRecords(request, reply) {
        const data = await quality_service_js_1.qualityService.listCapaRecords(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async saveCapaRecord(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.saveCapaRecord(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getAuditTrail(request, reply) {
        const data = await quality_service_js_1.qualityService.listAuditTrail(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getReports(request, reply) {
        const data = await quality_service_js_1.qualityService.listQualityReports(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async generateReport(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.generateQualityReport(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getNotifications(request, reply) {
        const data = await quality_service_js_1.qualityService.listNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markNotificationRead(request, reply) {
        const data = await quality_service_js_1.qualityService.markNotificationRead(request.user.tenantId, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clearNotifications(request, reply) {
        const data = await quality_service_js_1.qualityService.clearNotifications(request.user.tenantId, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getQualityProfile(request, reply) {
        const data = await quality_service_js_1.qualityService.getQualityProfile(request.user.tenantId, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateQualityProfile(request, reply) {
        const data = await quality_service_js_1.qualityService.updateQualityProfile(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async verifyQualityCert(request, reply) {
        const data = await quality_service_js_1.qualityService.verifyQualityCert(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ==========================================
    // PRE-OP & SANITATION CONTROLLERS
    // ==========================================
    async getPreOpChecklist(request, reply) {
        const data = await quality_service_js_1.qualityService.getPreOpChecklist(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async savePreOpProgress(request, reply) {
        const data = await quality_service_js_1.qualityService.savePreOpProgress(request.user.tenantId, request.body || {}, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getSanitationChecklist(request, reply) {
        const data = await quality_service_js_1.qualityService.getSanitationChecklist(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async saveSanitationProgress(request, reply) {
        const data = await quality_service_js_1.qualityService.saveSanitationProgress(request.user.tenantId, request.body || {}, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getBatchHistory(request, reply) {
        const data = await quality_service_js_1.qualityService.listBatchHistory(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async toggleBatchHistoryStatus(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await quality_service_js_1.qualityService.toggleBatchHistoryStatus(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportBatchHistory(request, reply) {
        const data = await quality_service_js_1.qualityService.exportBatchHistory(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getQualityRecords(request, reply) {
        const data = await quality_service_js_1.qualityService.listQualityRecords(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async exportQualityRecords(request, reply) {
        const data = await quality_service_js_1.qualityService.exportQualityRecords(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
}
exports.QualityController = QualityController;
exports.qualityController = new QualityController();
//# sourceMappingURL=quality.controller.js.map