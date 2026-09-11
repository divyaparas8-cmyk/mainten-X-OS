export declare class ExceptionsService {
    listExceptions(plantId?: string, severity?: string, category?: string): Promise<any[]>;
    getException(id: string): Promise<any>;
    createException(input: {
        title: string;
        severity: string;
        category: string;
        assetOrOrder?: string;
        impactDescription: string;
        owner?: string;
        escalationLevel?: string;
        plantId?: string;
    }): Promise<any>;
    assignException(id: string, input: {
        owner?: string;
        escalationLevel?: string;
    }): Promise<any>;
    resolveException(id: string, input: {
        resolutionNotes: string;
    }): Promise<any>;
}
export declare const exceptionsService: ExceptionsService;
//# sourceMappingURL=exceptions.service.d.ts.map