import { FastifyInstance } from "fastify";
import { ciController } from "./ci.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function ciRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // 1. Executive CI Dashboard
  fastify.get("/dashboard/summary", { schema: { tags: ["CI Dashboard"], summary: "Get Executive CI KPIs" } }, ciController.getDashboardSummary.bind(ciController));

  // 2. CI Projects & 21 CFR Part 11 Benefits
  fastify.get("/projects", { schema: { tags: ["CI Projects"], summary: "List CI Projects" } }, ciController.getProjects.bind(ciController));
  fastify.post("/projects", { schema: { tags: ["CI Projects"], summary: "Create CI Project" } }, ciController.createProject.bind(ciController));
  fastify.get("/projects/:id", { schema: { tags: ["CI Projects"], summary: "Get CI Project Details" } }, ciController.getProject.bind(ciController));
  fastify.put("/projects/:id", { schema: { tags: ["CI Projects"], summary: "Update CI Project" } }, ciController.updateProject.bind(ciController));
  fastify.delete("/projects/:id", { schema: { tags: ["CI Projects"], summary: "Delete CI Project" } }, ciController.deleteProject.bind(ciController));
  fastify.post("/projects/:id/verify-lock", { schema: { tags: ["CI Projects"], summary: "Verify & Immutably Lock Benefit (21 CFR Part 11)" } }, ciController.verifyAndLockBenefit.bind(ciController));
  fastify.post("/projects/:id/unlock", { schema: { tags: ["CI Projects"], summary: "Unlock Benefit with Justification" } }, ciController.unlockBenefit.bind(ciController));
  fastify.get("/benefits/summary", { schema: { tags: ["CI Projects"], summary: "Get Benefits Verification Summary KPIs" } }, ciController.getBenefitsSummary.bind(ciController));
  fastify.get("/benefits/ledger", { schema: { tags: ["CI Projects"], summary: "Get Benefits Verification Ledger" } }, ciController.getProjects.bind(ciController));

  // 3. RCA 2.0 Investigations Hub
  fastify.get("/rca/investigations", { schema: { tags: ["RCA 2.0"], summary: "List RCA Investigations" } }, ciController.getInvestigations.bind(ciController));
  fastify.post("/rca/investigations", { schema: { tags: ["RCA 2.0"], summary: "Initiate RCA Investigation" } }, ciController.createInvestigation.bind(ciController));
  fastify.get("/rca/investigations/:id", { schema: { tags: ["RCA 2.0"], summary: "Get RCA Investigation Details" } }, ciController.getInvestigation.bind(ciController));
  fastify.put("/rca/investigations/:id", { schema: { tags: ["RCA 2.0"], summary: "Update RCA Investigation" } }, ciController.updateInvestigation.bind(ciController));
  fastify.post("/rca/investigations/:id/phase", { schema: { tags: ["RCA 2.0"], summary: "Advance RCA Investigation Phase" } }, ciController.advanceInvestigationPhase.bind(ciController));
  fastify.delete("/rca/investigations/:id", { schema: { tags: ["RCA 2.0"], summary: "Delete RCA Investigation" } }, ciController.deleteInvestigation.bind(ciController));
  fastify.get("/rca/summary", { schema: { tags: ["RCA 2.0"], summary: "Get RCA Hub Summary KPIs" } }, ciController.getRCASummary.bind(ciController));

  // 4. Evidence Locker
  fastify.get("/rca/evidence", { schema: { tags: ["RCA 2.0"], summary: "List RCA Evidence Items" } }, ciController.getEvidence.bind(ciController));
  fastify.post("/rca/evidence", { schema: { tags: ["RCA 2.0"], summary: "Log RCA Evidence Item" } }, ciController.createEvidence.bind(ciController));
  fastify.delete("/rca/evidence/:id", { schema: { tags: ["RCA 2.0"], summary: "Delete RCA Evidence Item" } }, ciController.deleteEvidence.bind(ciController));

  // 5. Hypotheses & Validation Tests
  fastify.get("/rca/hypotheses", { schema: { tags: ["RCA 2.0"], summary: "List RCA Hypotheses" } }, ciController.getHypotheses.bind(ciController));
  fastify.post("/rca/hypotheses", { schema: { tags: ["RCA 2.0"], summary: "Formulate RCA Hypothesis" } }, ciController.createHypothesis.bind(ciController));
  fastify.post("/rca/hypotheses/:id/validate", { schema: { tags: ["RCA 2.0"], summary: "Validate/Refute RCA Hypothesis" } }, ciController.validateHypothesis.bind(ciController));
  fastify.delete("/rca/hypotheses/:id", { schema: { tags: ["RCA 2.0"], summary: "Delete RCA Hypothesis" } }, ciController.deleteHypothesis.bind(ciController));

  // 6. CAPA Action Items
  fastify.get("/capa/actions", { schema: { tags: ["CAPA"], summary: "List CAPA Actions" } }, ciController.getCapaActions.bind(ciController));
  fastify.post("/capa/actions", { schema: { tags: ["CAPA"], summary: "Create CAPA Action" } }, ciController.createCapaAction.bind(ciController));
  fastify.patch("/capa/actions/:id/status", { schema: { tags: ["CAPA"], summary: "Update CAPA Action Status" } }, ciController.updateCapaStatus.bind(ciController));
  fastify.post("/capa/actions/:id/verify", { schema: { tags: ["CAPA"], summary: "Verify CAPA Effectiveness" } }, ciController.verifyCapaEffectiveness.bind(ciController));
  fastify.delete("/capa/actions/:id", { schema: { tags: ["CAPA"], summary: "Delete CAPA Action" } }, ciController.deleteCapaAction.bind(ciController));

  // 7. Loss Analysis
  fastify.get("/losses", { schema: { tags: ["Loss Analysis"], summary: "List Loss Incidents" } }, ciController.getLosses.bind(ciController));
  fastify.post("/losses", { schema: { tags: ["Loss Analysis"], summary: "Log Loss Incident" } }, ciController.createLoss.bind(ciController));
  fastify.delete("/losses/:id", { schema: { tags: ["Loss Analysis"], summary: "Delete Loss Incident" } }, ciController.deleteLoss.bind(ciController));
  fastify.get("/losses/summary", { schema: { tags: ["Loss Analysis"], summary: "Get Loss Summary Breakdown" } }, ciController.getLossSummary.bind(ciController));

  // 8. Standards Library
  fastify.get("/standards", { schema: { tags: ["Standards"], summary: "List Standards & SOPs" } }, ciController.getStandards.bind(ciController));
  fastify.post("/standards", { schema: { tags: ["Standards"], summary: "Publish Standard" } }, ciController.createStandard.bind(ciController));
  fastify.put("/standards/:id", { schema: { tags: ["Standards"], summary: "Revise Standard" } }, ciController.updateStandard.bind(ciController));
  fastify.delete("/standards/:id", { schema: { tags: ["Standards"], summary: "Delete Standard" } }, ciController.deleteStandard.bind(ciController));

  // 9. Verified Solutions Knowledge Base
  fastify.get("/solutions", { schema: { tags: ["Verified Solutions"], summary: "List Verified Solutions" } }, ciController.getSolutions.bind(ciController));
  fastify.post("/solutions", { schema: { tags: ["Verified Solutions"], summary: "Document Verified Solution" } }, ciController.createSolution.bind(ciController));
  fastify.delete("/solutions/:id", { schema: { tags: ["Verified Solutions"], summary: "Delete Verified Solution" } }, ciController.deleteSolution.bind(ciController));

  // 10. Engineering Capex
  fastify.get("/capex", { schema: { tags: ["Capex"], summary: "List Capex Redesign Projects" } }, ciController.getCapex.bind(ciController));
  fastify.post("/capex", { schema: { tags: ["Capex"], summary: "Submit Capex Proposal" } }, ciController.createCapex.bind(ciController));
  fastify.delete("/capex/:id", { schema: { tags: ["Capex"], summary: "Delete Capex Proposal" } }, ciController.deleteCapex.bind(ciController));

  // 11. Reliability & Bad Actors
  fastify.get("/reliability", { schema: { tags: ["Reliability"], summary: "List Reliability & Bad Actor Records" } }, ciController.getReliabilityRecords.bind(ciController));
  fastify.post("/reliability/:assetId/launch-rca", { schema: { tags: ["Reliability"], summary: "Launch Systematic RCA from Bad Actor Asset" } }, ciController.launchRcaFromBadActor.bind(ciController));
}
