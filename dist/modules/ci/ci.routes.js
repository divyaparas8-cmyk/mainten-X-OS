"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ciRoutes = ciRoutes;
const ci_controller_js_1 = require("./ci.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function ciRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    // 1. Executive CI Dashboard
    fastify.get("/dashboard/summary", { schema: { tags: ["CI Dashboard"], summary: "Get Executive CI KPIs" } }, ci_controller_js_1.ciController.getDashboardSummary.bind(ci_controller_js_1.ciController));
    // 2. CI Projects & 21 CFR Part 11 Benefits
    fastify.get("/projects", { schema: { tags: ["CI Projects"], summary: "List CI Projects" } }, ci_controller_js_1.ciController.getProjects.bind(ci_controller_js_1.ciController));
    fastify.post("/projects", { schema: { tags: ["CI Projects"], summary: "Create CI Project" } }, ci_controller_js_1.ciController.createProject.bind(ci_controller_js_1.ciController));
    fastify.get("/projects/:id", { schema: { tags: ["CI Projects"], summary: "Get CI Project Details" } }, ci_controller_js_1.ciController.getProject.bind(ci_controller_js_1.ciController));
    fastify.put("/projects/:id", { schema: { tags: ["CI Projects"], summary: "Update CI Project" } }, ci_controller_js_1.ciController.updateProject.bind(ci_controller_js_1.ciController));
    fastify.delete("/projects/:id", { schema: { tags: ["CI Projects"], summary: "Delete CI Project" } }, ci_controller_js_1.ciController.deleteProject.bind(ci_controller_js_1.ciController));
    fastify.post("/projects/:id/verify-lock", { schema: { tags: ["CI Projects"], summary: "Verify & Immutably Lock Benefit (21 CFR Part 11)" } }, ci_controller_js_1.ciController.verifyAndLockBenefit.bind(ci_controller_js_1.ciController));
    fastify.post("/projects/:id/unlock", { schema: { tags: ["CI Projects"], summary: "Unlock Benefit with Justification" } }, ci_controller_js_1.ciController.unlockBenefit.bind(ci_controller_js_1.ciController));
    fastify.get("/benefits/summary", { schema: { tags: ["CI Projects"], summary: "Get Benefits Verification Summary KPIs" } }, ci_controller_js_1.ciController.getBenefitsSummary.bind(ci_controller_js_1.ciController));
    fastify.get("/benefits/ledger", { schema: { tags: ["CI Projects"], summary: "Get Benefits Verification Ledger" } }, ci_controller_js_1.ciController.getProjects.bind(ci_controller_js_1.ciController));
    // 3. RCA 2.0 Investigations Hub
    fastify.get("/rca/investigations", { schema: { tags: ["RCA 2.0"], summary: "List RCA Investigations" } }, ci_controller_js_1.ciController.getInvestigations.bind(ci_controller_js_1.ciController));
    fastify.post("/rca/investigations", { schema: { tags: ["RCA 2.0"], summary: "Initiate RCA Investigation" } }, ci_controller_js_1.ciController.createInvestigation.bind(ci_controller_js_1.ciController));
    fastify.get("/rca/investigations/:id", { schema: { tags: ["RCA 2.0"], summary: "Get RCA Investigation Details" } }, ci_controller_js_1.ciController.getInvestigation.bind(ci_controller_js_1.ciController));
    fastify.put("/rca/investigations/:id", { schema: { tags: ["RCA 2.0"], summary: "Update RCA Investigation" } }, ci_controller_js_1.ciController.updateInvestigation.bind(ci_controller_js_1.ciController));
    fastify.post("/rca/investigations/:id/phase", { schema: { tags: ["RCA 2.0"], summary: "Advance RCA Investigation Phase" } }, ci_controller_js_1.ciController.advanceInvestigationPhase.bind(ci_controller_js_1.ciController));
    fastify.delete("/rca/investigations/:id", { schema: { tags: ["RCA 2.0"], summary: "Delete RCA Investigation" } }, ci_controller_js_1.ciController.deleteInvestigation.bind(ci_controller_js_1.ciController));
    fastify.get("/rca/summary", { schema: { tags: ["RCA 2.0"], summary: "Get RCA Hub Summary KPIs" } }, ci_controller_js_1.ciController.getRCASummary.bind(ci_controller_js_1.ciController));
    // 4. Evidence Locker
    fastify.get("/rca/evidence", { schema: { tags: ["RCA 2.0"], summary: "List RCA Evidence Items" } }, ci_controller_js_1.ciController.getEvidence.bind(ci_controller_js_1.ciController));
    fastify.post("/rca/evidence", { schema: { tags: ["RCA 2.0"], summary: "Log RCA Evidence Item" } }, ci_controller_js_1.ciController.createEvidence.bind(ci_controller_js_1.ciController));
    fastify.delete("/rca/evidence/:id", { schema: { tags: ["RCA 2.0"], summary: "Delete RCA Evidence Item" } }, ci_controller_js_1.ciController.deleteEvidence.bind(ci_controller_js_1.ciController));
    // 5. Hypotheses & Validation Tests
    fastify.get("/rca/hypotheses", { schema: { tags: ["RCA 2.0"], summary: "List RCA Hypotheses" } }, ci_controller_js_1.ciController.getHypotheses.bind(ci_controller_js_1.ciController));
    fastify.post("/rca/hypotheses", { schema: { tags: ["RCA 2.0"], summary: "Formulate RCA Hypothesis" } }, ci_controller_js_1.ciController.createHypothesis.bind(ci_controller_js_1.ciController));
    fastify.post("/rca/hypotheses/:id/validate", { schema: { tags: ["RCA 2.0"], summary: "Validate/Refute RCA Hypothesis" } }, ci_controller_js_1.ciController.validateHypothesis.bind(ci_controller_js_1.ciController));
    fastify.delete("/rca/hypotheses/:id", { schema: { tags: ["RCA 2.0"], summary: "Delete RCA Hypothesis" } }, ci_controller_js_1.ciController.deleteHypothesis.bind(ci_controller_js_1.ciController));
    // 6. CAPA Action Items
    fastify.get("/capa/actions", { schema: { tags: ["CAPA"], summary: "List CAPA Actions" } }, ci_controller_js_1.ciController.getCapaActions.bind(ci_controller_js_1.ciController));
    fastify.post("/capa/actions", { schema: { tags: ["CAPA"], summary: "Create CAPA Action" } }, ci_controller_js_1.ciController.createCapaAction.bind(ci_controller_js_1.ciController));
    fastify.patch("/capa/actions/:id/status", { schema: { tags: ["CAPA"], summary: "Update CAPA Action Status" } }, ci_controller_js_1.ciController.updateCapaStatus.bind(ci_controller_js_1.ciController));
    fastify.post("/capa/actions/:id/verify", { schema: { tags: ["CAPA"], summary: "Verify CAPA Effectiveness" } }, ci_controller_js_1.ciController.verifyCapaEffectiveness.bind(ci_controller_js_1.ciController));
    fastify.delete("/capa/actions/:id", { schema: { tags: ["CAPA"], summary: "Delete CAPA Action" } }, ci_controller_js_1.ciController.deleteCapaAction.bind(ci_controller_js_1.ciController));
    // 7. Loss Analysis
    fastify.get("/losses", { schema: { tags: ["Loss Analysis"], summary: "List Loss Incidents" } }, ci_controller_js_1.ciController.getLosses.bind(ci_controller_js_1.ciController));
    fastify.post("/losses", { schema: { tags: ["Loss Analysis"], summary: "Log Loss Incident" } }, ci_controller_js_1.ciController.createLoss.bind(ci_controller_js_1.ciController));
    fastify.delete("/losses/:id", { schema: { tags: ["Loss Analysis"], summary: "Delete Loss Incident" } }, ci_controller_js_1.ciController.deleteLoss.bind(ci_controller_js_1.ciController));
    fastify.get("/losses/summary", { schema: { tags: ["Loss Analysis"], summary: "Get Loss Summary Breakdown" } }, ci_controller_js_1.ciController.getLossSummary.bind(ci_controller_js_1.ciController));
    // 8. Standards Library
    fastify.get("/standards", { schema: { tags: ["Standards"], summary: "List Standards & SOPs" } }, ci_controller_js_1.ciController.getStandards.bind(ci_controller_js_1.ciController));
    fastify.post("/standards", { schema: { tags: ["Standards"], summary: "Publish Standard" } }, ci_controller_js_1.ciController.createStandard.bind(ci_controller_js_1.ciController));
    fastify.put("/standards/:id", { schema: { tags: ["Standards"], summary: "Revise Standard" } }, ci_controller_js_1.ciController.updateStandard.bind(ci_controller_js_1.ciController));
    fastify.delete("/standards/:id", { schema: { tags: ["Standards"], summary: "Delete Standard" } }, ci_controller_js_1.ciController.deleteStandard.bind(ci_controller_js_1.ciController));
    // 9. Verified Solutions Knowledge Base
    fastify.get("/solutions", { schema: { tags: ["Verified Solutions"], summary: "List Verified Solutions" } }, ci_controller_js_1.ciController.getSolutions.bind(ci_controller_js_1.ciController));
    fastify.post("/solutions", { schema: { tags: ["Verified Solutions"], summary: "Document Verified Solution" } }, ci_controller_js_1.ciController.createSolution.bind(ci_controller_js_1.ciController));
    fastify.delete("/solutions/:id", { schema: { tags: ["Verified Solutions"], summary: "Delete Verified Solution" } }, ci_controller_js_1.ciController.deleteSolution.bind(ci_controller_js_1.ciController));
    // 10. Engineering Capex
    fastify.get("/capex", { schema: { tags: ["Capex"], summary: "List Capex Redesign Projects" } }, ci_controller_js_1.ciController.getCapex.bind(ci_controller_js_1.ciController));
    fastify.post("/capex", { schema: { tags: ["Capex"], summary: "Submit Capex Proposal" } }, ci_controller_js_1.ciController.createCapex.bind(ci_controller_js_1.ciController));
    fastify.delete("/capex/:id", { schema: { tags: ["Capex"], summary: "Delete Capex Proposal" } }, ci_controller_js_1.ciController.deleteCapex.bind(ci_controller_js_1.ciController));
    // 11. Reliability & Bad Actors
    fastify.get("/reliability", { schema: { tags: ["Reliability"], summary: "List Reliability & Bad Actor Records" } }, ci_controller_js_1.ciController.getReliabilityRecords.bind(ci_controller_js_1.ciController));
    fastify.post("/reliability/:assetId/launch-rca", { schema: { tags: ["Reliability"], summary: "Launch Systematic RCA from Bad Actor Asset" } }, ci_controller_js_1.ciController.launchRcaFromBadActor.bind(ci_controller_js_1.ciController));
}
//# sourceMappingURL=ci.routes.js.map