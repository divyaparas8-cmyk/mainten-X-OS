export interface UserContext {
    tenantId?: string | null;
    plantId?: string | null;
    userId?: string | null;
    userName?: string;
}
export interface WhyTreeNode {
    id: string;
    question: string;
    answer: string;
}
export interface EightDSummary {
    d1Team?: string;
    d2Problem?: string;
    d3Containment?: string;
    d4RootCause?: string;
    d5CorrectiveAction?: string;
    d6Implementation?: string;
    d7Prevention?: string;
    d8Closure?: string;
}
export interface RCAInvestigationEntity {
    id: string;
    title: string;
    assetId: string;
    assetName: string;
    lineId: string;
    lineName: string;
    plantId: string;
    sourceBreakdownId?: string | null;
    sourceWorkOrderId?: string | null;
    severity: string;
    status: string;
    currentPhase: string;
    problemStatement: string;
    leadInvestigator: string;
    teamMembers?: string[];
    eventDate: string;
    daysActive: number;
    whyTree?: WhyTreeNode[];
    eightD?: EightDSummary;
    createdAt?: string;
    updatedAt?: string;
}
export interface CIProjectEntity {
    id: string;
    name: string;
    type: string;
    plantId: string;
    lineId: string;
    assetId?: string | null;
    linkedRcaId?: string | null;
    sponsor: string;
    owner: string;
    startDate: string;
    targetDate: string;
    status: string;
    progress: number;
    baselineMetric: string;
    targetMetric: string;
    currentMetric: string;
    projectedSavingsAnnual: number;
    realizedSavingsYTD: number;
    benefitStatus: string;
    lockedBy?: string | null;
    lockedAt?: string | null;
    unlockReason?: string | null;
    createdAt?: string;
}
export interface RcaEvidenceEntity {
    id: string;
    rcaId: string;
    type: string;
    title: string;
    details: string;
    fileUrl?: string | null;
    uploadedBy: string;
    date: string;
    createdAt?: string;
}
export interface RcaHypothesisEntity {
    id: string;
    rcaId: string;
    statement: string;
    testMethod: string;
    evidenceResult?: string | null;
    validationStatus: string;
    validatedBy?: string | null;
    validatedAt?: string | null;
    createdAt?: string;
}
export interface CapaActionEntity {
    id: string;
    rcaId?: string | null;
    projectId?: string | null;
    description: string;
    actionType: string;
    owner: string;
    dueDate: string;
    priority: string;
    status: string;
    completionDate?: string | null;
    evidenceNotes?: string | null;
    effectivenessResult?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    createdAt?: string;
}
export interface CILossEntity {
    id: string;
    category: string;
    plantId: string;
    lineId: string;
    assetId: string;
    eventName: string;
    hoursLost: number;
    unitsLost: number;
    financialImpactUSD: number;
    linkedRcaId?: string | null;
    linkedProjectId?: string | null;
    trend: string;
    date: string;
    createdAt?: string;
}
export interface CIStandardEntity {
    id: string;
    title: string;
    type: string;
    version: string;
    plantId: string;
    lineId: string;
    assetId?: string | null;
    sourceProjectId?: string | null;
    sourceRcaId?: string | null;
    owner: string;
    status: string;
    effectiveDate: string;
    reviewDate: string;
    approvedBy?: string | null;
    createdAt?: string;
}
export interface CIVerifiedSolutionEntity {
    id: string;
    assetId: string;
    assetName: string;
    failureMode: string;
    symptom: string;
    rootCause: string;
    solutionSteps: string;
    partsUsed?: string | null;
    sourceRcaId?: string | null;
    verifiedBy: string;
    verifiedDate: string;
    status: string;
    createdAt?: string;
}
export interface CICapexProjectEntity {
    id: string;
    name: string;
    plantId: string;
    lineId: string;
    assetId: string;
    linkedRcaId?: string | null;
    linkedProjectId?: string | null;
    budget: number;
    estimatedCost: number;
    actualCost: number;
    engineeringJustification: string;
    status: string;
    owner: string;
    targetCommissionDate: string;
    dossierRef: string;
    approvalStatus: string;
    createdAt?: string;
}
export interface CIReliabilityRecordEntity {
    id: string;
    assetId: string;
    assetName: string;
    lineId: string;
    lineName: string;
    plantId: string;
    failuresCount: number;
    totalDowntimeMin: number;
    mtbfHrs: number;
    mttrMin: number;
    lastFailureDate: string;
    failureCategory: string;
    criticality: string;
    isBadActor: boolean;
    badActorReason?: string | null;
    createdAt?: string;
}
export declare class CIService {
    private logAudit;
    getDashboardSummary(plantId?: string): Promise<{
        financials: {
            projectedSavings: number;
            realizedSavings: number;
            totalLossUSD: number;
            totalHoursLost: number;
        };
        reliability: {
            badActorsCount: number;
            avgMtbfHrs: number;
            avgMttrMin: number;
        };
        rca: {
            totalRCA: number;
            openRCA: number;
            validatedRCA: number;
            closedRCA: number;
        };
        projects: {
            total: number;
            completed: number;
            pendingBenefits: number;
        };
        capa: {
            total: number;
            pending: number;
            verified: number;
            overdue: number;
        };
        capex: {
            total: number;
            open: number;
        };
        standards: {
            total: number;
            active: number;
        };
        solutions: {
            total: number;
        };
    }>;
    private mapInvestigation;
    listInvestigations(plantId?: string): Promise<RCAInvestigationEntity[]>;
    getInvestigation(id: string): Promise<RCAInvestigationEntity | undefined>;
    createInvestigation(data: Partial<RCAInvestigationEntity>, userContext?: UserContext): Promise<RCAInvestigationEntity>;
    updateInvestigation(id: string, data: Partial<RCAInvestigationEntity>, userContext?: UserContext): Promise<RCAInvestigationEntity>;
    advanceInvestigationPhase(id: string, nextPhase: string, userContext?: UserContext): Promise<RCAInvestigationEntity>;
    deleteInvestigation(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    getRCASummary(plantId?: string): Promise<{
        totalInvestigations: number;
        activeInvestigations: number;
        validatedRootCauses: number;
        criticalIncidents: number;
        avgDaysToRootCause: number;
        phaseDistribution: {
            event: number;
            evidence: number;
            hypothesis: number;
            occurrence: number;
            escape: number;
            capa: number;
            verification: number;
            closed: number;
        };
    }>;
    private mapEvidence;
    listEvidence(rcaId?: string): Promise<RcaEvidenceEntity[]>;
    createEvidence(data: Partial<RcaEvidenceEntity>, userContext?: UserContext): Promise<RcaEvidenceEntity>;
    deleteEvidence(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    private mapHypothesis;
    listHypotheses(rcaId?: string): Promise<RcaHypothesisEntity[]>;
    createHypothesis(data: Partial<RcaHypothesisEntity>, userContext?: UserContext): Promise<RcaHypothesisEntity>;
    validateHypothesis(id: string, validationStatus: "Confirmed Root Cause" | "Refuted" | "In Progress", evidenceResult?: string, userContext?: UserContext): Promise<RcaHypothesisEntity>;
    deleteHypothesis(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    private mapCapa;
    listCapaActions(filters?: {
        rcaId?: string;
        projectId?: string;
        actionType?: string;
        status?: string;
    }): Promise<CapaActionEntity[]>;
    createCapaAction(data: Partial<CapaActionEntity>, userContext?: UserContext): Promise<CapaActionEntity>;
    updateCapaStatus(id: string, status: string, completionDate?: string, evidenceNotes?: string, userContext?: UserContext): Promise<CapaActionEntity>;
    verifyCapaEffectiveness(id: string, effectivenessResult: string, userContext?: UserContext): Promise<CapaActionEntity>;
    deleteCapaAction(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    private mapLoss;
    listLosses(plantId?: string, category?: string): Promise<CILossEntity[]>;
    createLoss(data: Partial<CILossEntity>, userContext?: UserContext): Promise<CILossEntity>;
    deleteLoss(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    getLossSummary(plantId?: string): Promise<{
        totalUSD: number;
        totalHours: number;
        totalUnits: number;
        incidentsCount: number;
        breakdown: Record<string, {
            totalUSD: number;
            hours: number;
            count: number;
        }>;
    }>;
    private mapProject;
    listProjects(plantId?: string): Promise<CIProjectEntity[]>;
    getProject(id: string): Promise<CIProjectEntity | undefined>;
    createProject(input: Partial<CIProjectEntity>, userContext?: UserContext): Promise<CIProjectEntity>;
    updateProject(id: string, input: Partial<CIProjectEntity>, userContext?: UserContext): Promise<CIProjectEntity>;
    deleteProject(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    verifyAndLockBenefit(id: string, userContext?: UserContext): Promise<CIProjectEntity>;
    unlockBenefit(id: string, justification: string, userContext?: UserContext): Promise<CIProjectEntity>;
    getBenefitsSummary(plantId?: string): Promise<{
        verifiedCount: number;
        pendingCount: number;
        realizedSavingsTotal: number;
        projectedSavingsTotal: number;
        auditTrailStatus: string;
        complianceStandard: string;
        projectsCount: number;
    }>;
    private mapStandard;
    listStandards(plantId?: string, type?: string): Promise<CIStandardEntity[]>;
    createStandard(data: Partial<CIStandardEntity>, userContext?: UserContext): Promise<CIStandardEntity>;
    updateStandard(id: string, data: Partial<CIStandardEntity>, userContext?: UserContext): Promise<CIStandardEntity>;
    deleteStandard(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    private mapSolution;
    listSolutions(assetId?: string, search?: string): Promise<CIVerifiedSolutionEntity[]>;
    createSolution(data: Partial<CIVerifiedSolutionEntity>, userContext?: UserContext): Promise<CIVerifiedSolutionEntity>;
    deleteSolution(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    private mapCapex;
    listCapex(plantId?: string): Promise<CICapexProjectEntity[]>;
    createCapex(data: Partial<CICapexProjectEntity>, userContext?: UserContext): Promise<CICapexProjectEntity>;
    deleteCapex(id: string, userContext?: UserContext): Promise<{
        id: string;
        message: string;
    }>;
    private mapReliability;
    listReliabilityRecords(plantId?: string, onlyBadActors?: boolean): Promise<CIReliabilityRecordEntity[]>;
    launchRcaFromBadActor(assetId: string, userContext?: UserContext): Promise<RCAInvestigationEntity>;
}
export declare const ciService: CIService;
//# sourceMappingURL=ci.service.d.ts.map