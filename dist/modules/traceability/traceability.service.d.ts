export declare class TraceabilityService {
    get360Genealogy(tenantId: string, lotNumber: string): Promise<{
        lotNumber: string;
        queryType: string;
        traceabilityGraph: import("../../shared/engines/genealogyEngine.js").GenealogyNode;
        auditTimestamp: string;
    }>;
    runRecallSimulation(tenantId: string, plantId: string, lotNumber: string, reason: string, userId: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        tenantId: string;
        plantId: string;
        reason: string;
        recallCode: string;
        initiatedBy: string;
        targetLotNumber: string;
        scope: string;
        impactSummary: unknown;
    }>;
}
export declare const traceabilityService: TraceabilityService;
//# sourceMappingURL=traceability.service.d.ts.map