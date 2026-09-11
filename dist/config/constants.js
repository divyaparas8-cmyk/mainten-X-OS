"use strict";
// ==============================================================================
// MAINTENX OS - SYSTEM CONSTANTS & MANUFACTURING ENUMS
// ==============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_PAGE_LIMIT = exports.DEFAULT_PAGE_LIMIT = exports.EXCEPTION_SEVERITY = exports.WORK_ORDER_STATUS = exports.CCP_LIMITS = exports.BATCH_STATUS = exports.BATCH_STEPS = exports.PRODUCTION_ORDER_STATUS = exports.SYSTEM_ROLES = void 0;
exports.SYSTEM_ROLES = {
    MASTER_ADMIN: "master_admin",
    ADMIN: "admin",
    PLANT_MANAGER: "plant_manager",
    PLANNER: "planner",
    OPERATOR: "operator",
    QA: "qa",
    WAREHOUSE: "warehouse",
    SUPERVISOR: "supervisor",
    MAINTENANCE: "maintenance",
};
exports.PRODUCTION_ORDER_STATUS = {
    PLANNED: "PLANNED",
    SCHEDULED: "SCHEDULED",
    RELEASED: "RELEASED",
    RUNNING: "RUNNING",
    COMPLETED: "COMPLETED",
    QA_PENDING: "QA_PENDING",
    RELEASED_TO_WAREHOUSE: "RELEASED_TO_WAREHOUSE",
    CANCELLED: "CANCELLED",
};
exports.BATCH_STEPS = {
    STEP_1_SCAN: 1, // Barcode Verification
    STEP_2_WEIGH: 2, // Tare & Dispensing
    STEP_3_MIX: 3, // Heat & Agitation
    STEP_4_CCP: 4, // In-Process Critical Control Point
    STEP_5_PACKAGE: 5, // Inline Packaging & Weight Check
    STEP_6_COMPLETE: 6, // Digital Sign & QA Queue Dispatch
};
exports.BATCH_STATUS = {
    DRAFT: "Draft",
    IN_PROGRESS: "In Process",
    MIXING: "Mixing",
    PACKAGING: "Packaging",
    COMPLETED: "Completed",
    QA_PENDING: "QA Pending",
    RELEASED: "Released",
    QUARANTINED: "Quarantined",
};
exports.CCP_LIMITS = {
    PASTEURIZER_MIN_TEMP: 83.1, // °C
    PASTEURIZER_HOLD_TIME: 15, // seconds
    METAL_DETECTOR_FE_MAX: 0.0, // mm (0 detections permitted)
    PH_MIN: 3.2,
    PH_MAX: 3.8,
    BRIX_MIN: 11.5,
    BRIX_MAX: 12.2,
};
exports.WORK_ORDER_STATUS = {
    OPEN: "OPEN",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN_PROGRESS",
    WAITING_FOR_PARTS: "WAITING_FOR_PARTS",
    COMPLETED: "COMPLETED",
    CLOSED: "CLOSED",
};
exports.EXCEPTION_SEVERITY = {
    P1: "P1", // Critical Stoppage
    P2: "P2", // Major Delay / Risk
    P3: "P3", // Warning
};
exports.DEFAULT_PAGE_LIMIT = 20;
exports.MAX_PAGE_LIMIT = 100;
//# sourceMappingURL=constants.js.map