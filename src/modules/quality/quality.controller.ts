import { FastifyReply, FastifyRequest } from "fastify";
import { qualityService } from "./quality.service.js";
import { 
  recordCcpCheckSchema, 
  qaBatchReleaseSchema, 
  createQualityHoldSchema,
  createDeviationSchema,
  submitPreOpSchema,
  submitSanitationSchema,
  clearAllergenAuditSchema,
  toggleLineReadinessSchema
} from "./quality.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { resolvePlantId } from "../../shared/utils/tenantContext.js";

export class QualityController {
  async getQualitySummary(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getQualitySummary(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getCcpChecks(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.listCcpChecks(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async recordCcpCheck(request: FastifyRequest, reply: FastifyReply) {
    const input = recordCcpCheckSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.recordCcpCheck(request.user.tenantId, plantId, input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, `CCP check recorded (${data.status})`));
  }

  async getQaReleaseQueue(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQaReleaseQueue(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async authorizeBatchRelease(request: FastifyRequest, reply: FastifyReply) {
    const input = qaBatchReleaseSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.authorizeBatchRelease(
      request.user.tenantId,
      plantId,
      input,
      request.user.userId,
      request.ip
    );
    return reply.send(formatSuccess(data, "Batch disposition digitally signed & QA Release approved (21 CFR Part 11)"));
  }

  async getQualityHolds(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQualityHolds(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createQualityHold(request: FastifyRequest, reply: FastifyReply) {
    const input = createQualityHoldSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.createQualityHold(request.user.tenantId, plantId, input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Lot placed on quarantine hold"));
  }

  async getDeviations(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listDeviations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async reportDeviation(request: FastifyRequest, reply: FastifyReply) {
    const input = createDeviationSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.reportDeviation(request.user.tenantId, plantId, input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Deviation reported successfully"));
  }

  async submitPreOp(request: FastifyRequest, reply: FastifyReply) {
    const input = submitPreOpSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.submitPreOpChecklist(request.user.tenantId, plantId, input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  async submitSanitation(request: FastifyRequest, reply: FastifyReply) {
    const input = submitSanitationSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.submitSanitationChecklist(request.user.tenantId, plantId, input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  async getAllergenAudits(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listAllergenAudits(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async clearAllergenAudit(request: FastifyRequest, reply: FastifyReply) {
    const input = clearAllergenAuditSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.clearAllergenAudit(request.user.tenantId, plantId, input, request.user.userId);
    return reply.send(formatSuccess(data, "Allergen verification cleared"));
  }

  async clearAllAllergenAudits(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.clearAllAllergenAudits(request.user.tenantId, plantId, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportAllergenAudits(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportAllergenAudits(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getLineReadiness(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listLineReadiness(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleLineReadiness(request: FastifyRequest, reply: FastifyReply) {
    const input = toggleLineReadinessSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.toggleLineReadiness(request.user.tenantId, plantId, input, request.user.userId);
    return reply.send(formatSuccess(data, `Line readiness updated to ${data.newStatus}`));
  }

  async authorizeAllLines(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.authorizeAllLines(request.user.tenantId, plantId, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportLineReadiness(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportLineReadiness(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getCleaningVerification(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getCleaningVerification(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async verifyCleaning(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.verifyCleaning(request.user.tenantId, plantId, request.body || {}, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async resetCleaningVerification(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.resetCleaningVerification(request.user.tenantId, plantId, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getProcessChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listProcessChecks(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async recordProcessCheck(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.recordProcessCheck(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.status(201).send(formatSuccess(data));
  }

  async toggleProcessCheck(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.toggleProcessCheck(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async calibrateAllProcessChecks(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.calibrateAllProcessChecks(request.user.tenantId, plantId, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportProcessChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportProcessChecks(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getProductChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listProductChecks(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async recordProductCheck(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.recordProductCheck(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.status(201).send(formatSuccess(data));
  }

  async exportProductChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportProductChecks(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getQualitySpecs(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQualitySpecs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createQualitySpec(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.createQualitySpec(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  async toggleQualitySpecCcp(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.toggleQualitySpecCcp(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportQualitySpecs(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportQualitySpecs(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportCcpChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportCcpChecks(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportDeviations(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportDeviations(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportNcrReports(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportNcrReports(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportQualityHolds(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportQualityHolds(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportInvestigations(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportInvestigations(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportBatchReviews(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportBatchReviews(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportReleaseQueue(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportReleaseQueue(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async startInvestigation(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.startInvestigation(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Investigation initiated"));
  }

  async getInvestigations(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listInvestigations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async saveInvestigationFinding(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.saveInvestigationFinding(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, "Investigation findings saved"));
  }

  async completeInvestigation(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.completeInvestigation(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getNcrReports(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listNcrReports(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createNcrReport(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.createNcrReport(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Non-Conformance Report logged"));
  }

  async reviewNcrReport(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.reviewNcrReport(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async reviewQualityHold(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.reviewQualityHold(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, "Quality hold reviewed"));
  }

  async releaseQualityHold(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.releaseQualityHold(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, "Lot released from quarantine hold"));
  }

  async getBatchQualityReviews(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listBatchQualityReviews(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async reviewBatchDossier(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.reviewBatchDossier(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getApprovedReleases(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listApprovedReleases(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleApprovedRelease(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.toggleApprovedReleaseStatus(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportApprovedReleases(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportApprovedReleases(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getBlockedBatches(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listBlockedBatches(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleBlockedBatch(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.toggleBlockedBatchStatus(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportBlockedBatches(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportBlockedBatches(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getDispositionRelease(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listDispositionRelease(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getDispositionRework(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getDispositionRework(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getDispositionReject(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getDispositionReject(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getDispositionDowngrade(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getDispositionDowngrade(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async authorizeDisposition(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.authorizeDisposition(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async submitReworkInstruction(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.submitReworkInstruction(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async submitRejectAuthorization(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.submitRejectAuthorization(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async submitDowngradeAuthorization(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.submitDowngradeAuthorization(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getCapaRecords(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listCapaRecords(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async saveCapaRecord(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.saveCapaRecord(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.status(201).send(formatSuccess(data, data.message));
  }

  async getAuditTrail(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listAuditTrail(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getReports(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQualityReports(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async generateReport(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.generateQualityReport(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async markNotificationRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.markNotificationRead(request.user.tenantId, request.body);
    return reply.send(formatSuccess(data, data.message));
  }

  async clearNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.clearNotifications(request.user.tenantId, request.body);
    return reply.send(formatSuccess(data, data.message));
  }

  async getQualityProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getQualityProfile(request.user.tenantId, request.user.userId);
    return reply.send(formatSuccess(data));
  }

  async updateQualityProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.updateQualityProfile(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async verifyQualityCert(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.verifyQualityCert(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ==========================================
  // PRE-OP & SANITATION CONTROLLERS
  // ==========================================

  async getPreOpChecklist(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getPreOpChecklist(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async savePreOpProgress(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.savePreOpProgress(request.user.tenantId, request.body || {}, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getSanitationChecklist(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.getSanitationChecklist(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async saveSanitationProgress(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.saveSanitationProgress(request.user.tenantId, request.body || {}, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getBatchHistory(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listBatchHistory(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async toggleBatchHistoryStatus(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await qualityService.toggleBatchHistoryStatus(request.user.tenantId, plantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportBatchHistory(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportBatchHistory(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getQualityRecords(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQualityRecords(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async exportQualityRecords(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.exportQualityRecords(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }
}

export const qualityController = new QualityController();



