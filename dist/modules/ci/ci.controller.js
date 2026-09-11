"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ciController = exports.CIController = void 0;
const ci_service_js_1 = require("./ci.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class CIController {
    // ============================================================================
    // 1. DASHBOARD
    // ============================================================================
    async getDashboardSummary(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.getDashboardSummary(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ============================================================================
    // 2. RCA INVESTIGATIONS
    // ============================================================================
    async getInvestigations(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.listInvestigations(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getInvestigation(request, reply) {
        const data = await ci_service_js_1.ciService.getInvestigation(request.params.id);
        if (!data) {
            return reply.status(404).send({ success: false, message: "Investigation not found" });
        }
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createInvestigation(request, reply) {
        const userName = request.user?.name || request.user?.email || "David Kim (Lead CI Engineer)";
        const data = await ci_service_js_1.ciService.createInvestigation(request.body, userName);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "RCA Investigation initiated successfully"));
    }
    async updateInvestigation(request, reply) {
        const data = await ci_service_js_1.ciService.updateInvestigation(request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "RCA Investigation updated successfully"));
    }
    async advanceInvestigationPhase(request, reply) {
        const phase = request.body?.phase;
        if (!phase) {
            return reply.status(400).send({ success: false, message: "Next phase is required" });
        }
        const data = await ci_service_js_1.ciService.advanceInvestigationPhase(request.params.id, phase);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `RCA ${request.params.id} phase advanced to "${phase}"`));
    }
    async deleteInvestigation(request, reply) {
        const data = await ci_service_js_1.ciService.deleteInvestigation(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "RCA Investigation deleted successfully"));
    }
    async getRCASummary(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.getRCASummary(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ============================================================================
    // 3. EVIDENCE LOCKER
    // ============================================================================
    async getEvidence(request, reply) {
        const rcaId = request.query?.rcaId;
        const data = await ci_service_js_1.ciService.listEvidence(rcaId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createEvidence(request, reply) {
        const userName = request.user?.name || request.user?.email || "David Kim";
        const data = await ci_service_js_1.ciService.createEvidence(request.body, userName);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Evidence logged successfully"));
    }
    async deleteEvidence(request, reply) {
        const data = await ci_service_js_1.ciService.deleteEvidence(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Evidence deleted"));
    }
    // ============================================================================
    // 4. HYPOTHESES & VALIDATION
    // ============================================================================
    async getHypotheses(request, reply) {
        const rcaId = request.query?.rcaId;
        const data = await ci_service_js_1.ciService.listHypotheses(rcaId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createHypothesis(request, reply) {
        const data = await ci_service_js_1.ciService.createHypothesis(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Hypothesis formulated successfully"));
    }
    async validateHypothesis(request, reply) {
        const { validationStatus, evidenceResult } = request.body || {};
        const userName = request.user?.name || request.user?.email || "Lead CI Engineer";
        if (!validationStatus) {
            return reply.status(400).send({ success: false, message: "validationStatus is required" });
        }
        const data = await ci_service_js_1.ciService.validateHypothesis(request.params.id, validationStatus, evidenceResult, userName);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Hypothesis marked as "${validationStatus}"`));
    }
    async deleteHypothesis(request, reply) {
        const data = await ci_service_js_1.ciService.deleteHypothesis(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Hypothesis deleted"));
    }
    // ============================================================================
    // 5. CAPA ACTIONS
    // ============================================================================
    async getCapaActions(request, reply) {
        const data = await ci_service_js_1.ciService.listCapaActions(request.query);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCapaAction(request, reply) {
        const data = await ci_service_js_1.ciService.createCapaAction(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "CAPA Action created successfully"));
    }
    async updateCapaStatus(request, reply) {
        const { status, completionDate, evidenceNotes } = request.body || {};
        if (!status) {
            return reply.status(400).send({ success: false, message: "Status is required" });
        }
        const data = await ci_service_js_1.ciService.updateCapaStatus(request.params.id, status, completionDate, evidenceNotes);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `CAPA Action updated to ${status}`));
    }
    async verifyCapaEffectiveness(request, reply) {
        const { effectivenessResult } = request.body || {};
        const userName = request.user?.name || request.user?.email || "Quality Manager";
        const data = await ci_service_js_1.ciService.verifyCapaEffectiveness(request.params.id, effectivenessResult || "Verified Effective", userName);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "CAPA Action verified effective"));
    }
    async deleteCapaAction(request, reply) {
        const data = await ci_service_js_1.ciService.deleteCapaAction(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "CAPA Action deleted"));
    }
    // ============================================================================
    // 6. LOSS ANALYSIS
    // ============================================================================
    async getLosses(request, reply) {
        const { plantId, category } = request.query || {};
        const data = await ci_service_js_1.ciService.listLosses(plantId, category);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLoss(request, reply) {
        const data = await ci_service_js_1.ciService.createLoss(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Loss incident logged"));
    }
    async deleteLoss(request, reply) {
        const data = await ci_service_js_1.ciService.deleteLoss(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Loss incident deleted"));
    }
    async getLossSummary(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.getLossSummary(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ============================================================================
    // 7. CI PROJECTS & BENEFITS
    // ============================================================================
    async getProjects(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.listProjects(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getProject(request, reply) {
        const data = await ci_service_js_1.ciService.getProject(request.params.id);
        if (!data) {
            return reply.status(404).send({ success: false, message: "Project not found" });
        }
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createProject(request, reply) {
        const data = await ci_service_js_1.ciService.createProject(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "CI Project created successfully"));
    }
    async updateProject(request, reply) {
        const data = await ci_service_js_1.ciService.updateProject(request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "CI Project updated successfully"));
    }
    async deleteProject(request, reply) {
        const data = await ci_service_js_1.ciService.deleteProject(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "CI Project deleted successfully"));
    }
    async verifyAndLockBenefit(request, reply) {
        const userName = request.user?.name || request.user?.email || "David Kim (Lead CI)";
        const data = await ci_service_js_1.ciService.verifyAndLockBenefit(request.params.id, userName);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Project ${request.params.id} benefit certified and immutably locked`));
    }
    async unlockBenefit(request, reply) {
        const userName = request.user?.name || request.user?.email || "David Kim (Lead CI)";
        const justification = request.body?.justification || "Engineering review and metric recalculation";
        const data = await ci_service_js_1.ciService.unlockBenefit(request.params.id, justification, userName);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Project ${request.params.id} benefit unlocked for recalculation`));
    }
    async getBenefitsSummary(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.getBenefitsSummary(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ============================================================================
    // 8. STANDARDS LIBRARY
    // ============================================================================
    async getStandards(request, reply) {
        const { plantId, type } = request.query || {};
        const data = await ci_service_js_1.ciService.listStandards(plantId, type);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createStandard(request, reply) {
        const data = await ci_service_js_1.ciService.createStandard(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Standard published successfully"));
    }
    async updateStandard(request, reply) {
        const data = await ci_service_js_1.ciService.updateStandard(request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Standard revised successfully"));
    }
    async deleteStandard(request, reply) {
        const data = await ci_service_js_1.ciService.deleteStandard(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Standard archived/deleted"));
    }
    // ============================================================================
    // 9. VERIFIED SOLUTIONS
    // ============================================================================
    async getSolutions(request, reply) {
        const { assetId, search } = request.query || {};
        const data = await ci_service_js_1.ciService.listSolutions(assetId, search);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSolution(request, reply) {
        const data = await ci_service_js_1.ciService.createSolution(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Verified solution documented"));
    }
    async deleteSolution(request, reply) {
        const data = await ci_service_js_1.ciService.deleteSolution(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Verified solution removed"));
    }
    // ============================================================================
    // 10. CAPEX PROJECTS
    // ============================================================================
    async getCapex(request, reply) {
        const plantId = request.query?.plantId;
        const data = await ci_service_js_1.ciService.listCapex(plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCapex(request, reply) {
        const data = await ci_service_js_1.ciService.createCapex(request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Capex project proposal submitted"));
    }
    async deleteCapex(request, reply) {
        const data = await ci_service_js_1.ciService.deleteCapex(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Capex proposal removed"));
    }
    // ============================================================================
    // 11. RELIABILITY & BAD ACTORS
    // ============================================================================
    async getReliabilityRecords(request, reply) {
        const { plantId, onlyBadActors } = request.query || {};
        const data = await ci_service_js_1.ciService.listReliabilityRecords(plantId, onlyBadActors === "true");
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async launchRcaFromBadActor(request, reply) {
        const userName = request.user?.name || request.user?.email || "David Kim (Lead CI)";
        const data = await ci_service_js_1.ciService.launchRcaFromBadActor(request.params.assetId, userName);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `RCA launched for Bad Actor asset ${request.params.assetId}`));
    }
}
exports.CIController = CIController;
exports.ciController = new CIController();
//# sourceMappingURL=ci.controller.js.map