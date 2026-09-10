import { FastifyReply, FastifyRequest } from "fastify";
import { ciService } from "./ci.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class CIController {
  // ============================================================================
  // 1. DASHBOARD
  // ============================================================================
  async getDashboardSummary(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.getDashboardSummary(plantId);
    return reply.send(formatSuccess(data));
  }

  // ============================================================================
  // 2. RCA INVESTIGATIONS
  // ============================================================================
  async getInvestigations(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.listInvestigations(plantId);
    return reply.send(formatSuccess(data));
  }

  async getInvestigation(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.getInvestigation(request.params.id);
    if (!data) {
      return reply.status(404).send({ success: false, message: "Investigation not found" });
    }
    return reply.send(formatSuccess(data));
  }

  async createInvestigation(request: FastifyRequest, reply: FastifyReply) {
    const userName = (request.user as any)?.name || (request.user as any)?.email || "David Kim (Lead CI Engineer)";
    const data = await ciService.createInvestigation(request.body as any, userName);
    return reply.status(201).send(formatSuccess(data, "RCA Investigation initiated successfully"));
  }

  async updateInvestigation(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.updateInvestigation(request.params.id, request.body as any);
    return reply.send(formatSuccess(data, "RCA Investigation updated successfully"));
  }

  async advanceInvestigationPhase(request: FastifyRequest<{ Params: { id: string }; Body: { phase: string } }>, reply: FastifyReply) {
    const phase = request.body?.phase;
    if (!phase) {
      return reply.status(400).send({ success: false, message: "Next phase is required" });
    }
    const data = await ciService.advanceInvestigationPhase(request.params.id, phase);
    return reply.send(formatSuccess(data, `RCA ${request.params.id} phase advanced to "${phase}"`));
  }

  async deleteInvestigation(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteInvestigation(request.params.id);
    return reply.send(formatSuccess(data, "RCA Investigation deleted successfully"));
  }

  async getRCASummary(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.getRCASummary(plantId);
    return reply.send(formatSuccess(data));
  }

  // ============================================================================
  // 3. EVIDENCE LOCKER
  // ============================================================================
  async getEvidence(request: FastifyRequest<{ Querystring: { rcaId?: string } }>, reply: FastifyReply) {
    const rcaId = request.query?.rcaId;
    const data = await ciService.listEvidence(rcaId);
    return reply.send(formatSuccess(data));
  }

  async createEvidence(request: FastifyRequest, reply: FastifyReply) {
    const userName = (request.user as any)?.name || (request.user as any)?.email || "David Kim";
    const data = await ciService.createEvidence(request.body as any, userName);
    return reply.status(201).send(formatSuccess(data, "Evidence logged successfully"));
  }

  async deleteEvidence(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteEvidence(request.params.id);
    return reply.send(formatSuccess(data, "Evidence deleted"));
  }

  // ============================================================================
  // 4. HYPOTHESES & VALIDATION
  // ============================================================================
  async getHypotheses(request: FastifyRequest<{ Querystring: { rcaId?: string } }>, reply: FastifyReply) {
    const rcaId = request.query?.rcaId;
    const data = await ciService.listHypotheses(rcaId);
    return reply.send(formatSuccess(data));
  }

  async createHypothesis(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createHypothesis(request.body as any);
    return reply.status(201).send(formatSuccess(data, "Hypothesis formulated successfully"));
  }

  async validateHypothesis(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { validationStatus: "Confirmed Root Cause" | "Refuted" | "In Progress"; evidenceResult?: string };
    }>,
    reply: FastifyReply
  ) {
    const { validationStatus, evidenceResult } = request.body || {};
    const userName = (request.user as any)?.name || (request.user as any)?.email || "Lead CI Engineer";
    if (!validationStatus) {
      return reply.status(400).send({ success: false, message: "validationStatus is required" });
    }
    const data = await ciService.validateHypothesis(request.params.id, validationStatus, evidenceResult, userName);
    return reply.send(formatSuccess(data, `Hypothesis marked as "${validationStatus}"`));
  }

  async deleteHypothesis(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteHypothesis(request.params.id);
    return reply.send(formatSuccess(data, "Hypothesis deleted"));
  }

  // ============================================================================
  // 5. CAPA ACTIONS
  // ============================================================================
  async getCapaActions(
    request: FastifyRequest<{ Querystring: { rcaId?: string; projectId?: string; actionType?: string; status?: string } }>,
    reply: FastifyReply
  ) {
    const data = await ciService.listCapaActions(request.query);
    return reply.send(formatSuccess(data));
  }

  async createCapaAction(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createCapaAction(request.body as any);
    return reply.status(201).send(formatSuccess(data, "CAPA Action created successfully"));
  }

  async updateCapaStatus(
    request: FastifyRequest<{ Params: { id: string }; Body: { status: string; completionDate?: string; evidenceNotes?: string } }>,
    reply: FastifyReply
  ) {
    const { status, completionDate, evidenceNotes } = request.body || {};
    if (!status) {
      return reply.status(400).send({ success: false, message: "Status is required" });
    }
    const data = await ciService.updateCapaStatus(request.params.id, status, completionDate, evidenceNotes);
    return reply.send(formatSuccess(data, `CAPA Action updated to ${status}`));
  }

  async verifyCapaEffectiveness(
    request: FastifyRequest<{ Params: { id: string }; Body: { effectivenessResult: string } }>,
    reply: FastifyReply
  ) {
    const { effectivenessResult } = request.body || {};
    const userName = (request.user as any)?.name || (request.user as any)?.email || "Quality Manager";
    const data = await ciService.verifyCapaEffectiveness(request.params.id, effectivenessResult || "Verified Effective", userName);
    return reply.send(formatSuccess(data, "CAPA Action verified effective"));
  }

  async deleteCapaAction(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteCapaAction(request.params.id);
    return reply.send(formatSuccess(data, "CAPA Action deleted"));
  }

  // ============================================================================
  // 6. LOSS ANALYSIS
  // ============================================================================
  async getLosses(request: FastifyRequest<{ Querystring: { plantId?: string; category?: string } }>, reply: FastifyReply) {
    const { plantId, category } = request.query || {};
    const data = await ciService.listLosses(plantId, category);
    return reply.send(formatSuccess(data));
  }

  async createLoss(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createLoss(request.body as any);
    return reply.status(201).send(formatSuccess(data, "Loss incident logged"));
  }

  async deleteLoss(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteLoss(request.params.id);
    return reply.send(formatSuccess(data, "Loss incident deleted"));
  }

  async getLossSummary(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.getLossSummary(plantId);
    return reply.send(formatSuccess(data));
  }

  // ============================================================================
  // 7. CI PROJECTS & BENEFITS
  // ============================================================================
  async getProjects(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.listProjects(plantId);
    return reply.send(formatSuccess(data));
  }

  async getProject(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.getProject(request.params.id);
    if (!data) {
      return reply.status(404).send({ success: false, message: "Project not found" });
    }
    return reply.send(formatSuccess(data));
  }

  async createProject(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createProject(request.body as any);
    return reply.status(201).send(formatSuccess(data, "CI Project created successfully"));
  }

  async updateProject(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.updateProject(request.params.id, request.body as any);
    return reply.send(formatSuccess(data, "CI Project updated successfully"));
  }

  async deleteProject(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteProject(request.params.id);
    return reply.send(formatSuccess(data, "CI Project deleted successfully"));
  }

  async verifyAndLockBenefit(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const userName = (request.user as any)?.name || (request.user as any)?.email || "David Kim (Lead CI)";
    const data = await ciService.verifyAndLockBenefit(request.params.id, userName);
    return reply.send(formatSuccess(data, `Project ${request.params.id} benefit certified and immutably locked`));
  }

  async unlockBenefit(request: FastifyRequest<{ Params: { id: string }; Body: { justification?: string } }>, reply: FastifyReply) {
    const userName = (request.user as any)?.name || (request.user as any)?.email || "David Kim (Lead CI)";
    const justification = request.body?.justification || "Engineering review and metric recalculation";
    const data = await ciService.unlockBenefit(request.params.id, justification, userName);
    return reply.send(formatSuccess(data, `Project ${request.params.id} benefit unlocked for recalculation`));
  }

  async getBenefitsSummary(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.getBenefitsSummary(plantId);
    return reply.send(formatSuccess(data));
  }

  // ============================================================================
  // 8. STANDARDS LIBRARY
  // ============================================================================
  async getStandards(request: FastifyRequest<{ Querystring: { plantId?: string; type?: string } }>, reply: FastifyReply) {
    const { plantId, type } = request.query || {};
    const data = await ciService.listStandards(plantId, type);
    return reply.send(formatSuccess(data));
  }

  async createStandard(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createStandard(request.body as any);
    return reply.status(201).send(formatSuccess(data, "Standard published successfully"));
  }

  async updateStandard(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.updateStandard(request.params.id, request.body as any);
    return reply.send(formatSuccess(data, "Standard revised successfully"));
  }

  async deleteStandard(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteStandard(request.params.id);
    return reply.send(formatSuccess(data, "Standard archived/deleted"));
  }

  // ============================================================================
  // 9. VERIFIED SOLUTIONS
  // ============================================================================
  async getSolutions(request: FastifyRequest<{ Querystring: { assetId?: string; search?: string } }>, reply: FastifyReply) {
    const { assetId, search } = request.query || {};
    const data = await ciService.listSolutions(assetId, search);
    return reply.send(formatSuccess(data));
  }

  async createSolution(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createSolution(request.body as any);
    return reply.status(201).send(formatSuccess(data, "Verified solution documented"));
  }

  async deleteSolution(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteSolution(request.params.id);
    return reply.send(formatSuccess(data, "Verified solution removed"));
  }

  // ============================================================================
  // 10. CAPEX PROJECTS
  // ============================================================================
  async getCapex(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const plantId = request.query?.plantId;
    const data = await ciService.listCapex(plantId);
    return reply.send(formatSuccess(data));
  }

  async createCapex(request: FastifyRequest, reply: FastifyReply) {
    const data = await ciService.createCapex(request.body as any);
    return reply.status(201).send(formatSuccess(data, "Capex project proposal submitted"));
  }

  async deleteCapex(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await ciService.deleteCapex(request.params.id);
    return reply.send(formatSuccess(data, "Capex proposal removed"));
  }

  // ============================================================================
  // 11. RELIABILITY & BAD ACTORS
  // ============================================================================
  async getReliabilityRecords(
    request: FastifyRequest<{ Querystring: { plantId?: string; onlyBadActors?: string } }>,
    reply: FastifyReply
  ) {
    const { plantId, onlyBadActors } = request.query || {};
    const data = await ciService.listReliabilityRecords(plantId, onlyBadActors === "true");
    return reply.send(formatSuccess(data));
  }

  async launchRcaFromBadActor(request: FastifyRequest<{ Params: { assetId: string } }>, reply: FastifyReply) {
    const userName = (request.user as any)?.name || (request.user as any)?.email || "David Kim (Lead CI)";
    const data = await ciService.launchRcaFromBadActor(request.params.assetId, userName);
    return reply.status(201).send(formatSuccess(data, `RCA launched for Bad Actor asset ${request.params.assetId}`));
  }
}

export const ciController = new CIController();
