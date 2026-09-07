"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSampleTraceabilityTree = buildSampleTraceabilityTree;
function buildSampleTraceabilityTree(lotNumber) {
    return {
        id: "node-supp-1",
        type: "SUPPLIER",
        label: "SunGrow Organic Citrus Ltd (Valencia Farms)",
        code: "VEND-ORG-88",
        status: "APPROVED_A_PLUS",
        children: [
            {
                id: "node-raw-1",
                type: "RAW_LOT",
                label: "Valencia Organic Orange Juice Concentrate 65° Brix",
                code: lotNumber || "LOT-RM-ORG-4402",
                status: "QA_RELEASED",
                details: {
                    initialQty: "10,000 Liters",
                    currentBalance: "4,200 Liters",
                    brix: "65.2° Brix",
                    location: "Cold Vault Zone B-02",
                },
                children: [
                    {
                        id: "node-batch-1",
                        type: "BATCH",
                        label: "Sparkling Organic Orange Soda Formulation",
                        code: "BAT-2026-0885",
                        status: "COMPLETED_eBR",
                        details: {
                            tank: "T-01 (Blender)",
                            volume: "12,000 Liters",
                            ccp1Pasteurizer: "83.4°C (PASS)",
                            ccp2MetalDetector: "0 Detections (PASS)",
                        },
                        children: [
                            {
                                id: "node-fg-1",
                                type: "FINISHED_LOT",
                                label: "Sparkling Organic Orange Soda 330ml Slim Can",
                                code: "LOT-FG-2026-0885",
                                status: "21_CFR_QA_RELEASED",
                                details: {
                                    producedQty: "24,000 Cans",
                                    coaSignedBy: "Dr. Rachel Thorne (QA Lead)",
                                    mfgDate: "2026-09-01",
                                    expiryDate: "2027-09-01",
                                },
                                children: [
                                    {
                                        id: "node-ship-1",
                                        type: "SHIPMENT",
                                        label: "Refrigerated Carrier Swift Logistics #9921",
                                        code: "SHIP-2026-0819",
                                        status: "DELIVERED",
                                        children: [
                                            {
                                                id: "node-cust-1",
                                                type: "CUSTOMER",
                                                label: "Kroger Supermarkets Distribution Hub #14",
                                                code: "CUST-KROGER-MW",
                                                status: "ACCEPTED",
                                                details: {
                                                    deliveryTime: "2026-09-04 14:15",
                                                    poReference: "PO-KR-99321",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
}
//# sourceMappingURL=genealogyEngine.js.map