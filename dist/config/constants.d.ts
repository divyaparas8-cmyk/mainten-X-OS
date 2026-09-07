export declare const SYSTEM_ROLES: {
    readonly MASTER_ADMIN: "master_admin";
    readonly ADMIN: "admin";
    readonly PLANT_MANAGER: "plant_manager";
    readonly PLANNER: "planner";
    readonly OPERATOR: "operator";
    readonly QA: "qa";
    readonly WAREHOUSE: "warehouse";
    readonly SUPERVISOR: "supervisor";
    readonly MAINTENANCE: "maintenance";
};
export type SystemRole = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES];
export declare const PRODUCTION_ORDER_STATUS: {
    readonly PLANNED: "PLANNED";
    readonly SCHEDULED: "SCHEDULED";
    readonly RELEASED: "RELEASED";
    readonly RUNNING: "RUNNING";
    readonly COMPLETED: "COMPLETED";
    readonly QA_PENDING: "QA_PENDING";
    readonly RELEASED_TO_WAREHOUSE: "RELEASED_TO_WAREHOUSE";
    readonly CANCELLED: "CANCELLED";
};
export type ProductionOrderStatus = typeof PRODUCTION_ORDER_STATUS[keyof typeof PRODUCTION_ORDER_STATUS];
export declare const BATCH_STEPS: {
    readonly STEP_1_SCAN: 1;
    readonly STEP_2_WEIGH: 2;
    readonly STEP_3_MIX: 3;
    readonly STEP_4_CCP: 4;
    readonly STEP_5_PACKAGE: 5;
    readonly STEP_6_COMPLETE: 6;
};
export declare const BATCH_STATUS: {
    readonly DRAFT: "Draft";
    readonly IN_PROGRESS: "In Process";
    readonly MIXING: "Mixing";
    readonly PACKAGING: "Packaging";
    readonly COMPLETED: "Completed";
    readonly QA_PENDING: "QA Pending";
    readonly RELEASED: "Released";
    readonly QUARANTINED: "Quarantined";
};
export declare const CCP_LIMITS: {
    readonly PASTEURIZER_MIN_TEMP: 83.1;
    readonly PASTEURIZER_HOLD_TIME: 15;
    readonly METAL_DETECTOR_FE_MAX: 0;
    readonly PH_MIN: 3.2;
    readonly PH_MAX: 3.8;
    readonly BRIX_MIN: 11.5;
    readonly BRIX_MAX: 12.2;
};
export declare const WORK_ORDER_STATUS: {
    readonly OPEN: "OPEN";
    readonly ASSIGNED: "ASSIGNED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly WAITING_FOR_PARTS: "WAITING_FOR_PARTS";
    readonly COMPLETED: "COMPLETED";
    readonly CLOSED: "CLOSED";
};
export declare const EXCEPTION_SEVERITY: {
    readonly P1: "P1";
    readonly P2: "P2";
    readonly P3: "P3";
};
export declare const DEFAULT_PAGE_LIMIT = 20;
export declare const MAX_PAGE_LIMIT = 100;
//# sourceMappingURL=constants.d.ts.map