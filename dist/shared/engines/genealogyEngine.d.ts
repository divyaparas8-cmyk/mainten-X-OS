export interface GenealogyNode {
    id: string;
    type: "SUPPLIER" | "RAW_LOT" | "BATCH" | "FINISHED_LOT" | "PALLET" | "SHIPMENT" | "CUSTOMER";
    label: string;
    code: string;
    status: string;
    details?: Record<string, any>;
    children?: GenealogyNode[];
}
export declare function buildSampleTraceabilityTree(lotNumber: string): GenealogyNode;
//# sourceMappingURL=genealogyEngine.d.ts.map