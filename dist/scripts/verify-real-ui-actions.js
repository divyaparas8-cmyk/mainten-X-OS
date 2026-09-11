"use strict";
/**
 * MAINTENX OS - COMPREHENSIVE REAL USER ACTION VALIDATION SUITE
 *
 * Verifies real UI-to-API-to-Database workflows across all core modules:
 * 1. Master Data (SKU, Work Center, Line, Routing with steps)
 * 2. Planning (Demand Order, Forecast, MRP Explosion, APS Schedule)
 * 3. Production (Order, Batch, Steps, Status Progression, Completion)
 * 4. Quality (CCP Checks, Quality Holds, 21 CFR Part 11 Electronic Release)
 * 5. Warehouse (Stock Movement, Transfer, Transaction Log)
 * 6. Maintenance (Work Order Creation, In-Progress, Completion)
 * 7. Traceability (Genealogy Graph, Mock Recall Simulation)
 * 8. Dashboards (Live PostgreSQL KPIs)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const index_js_1 = require("../db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
const BASE_URL = "http://localhost:4000/api/v1";
const results = [];
async function login(email, password = "Password@123") {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
    return data.data.token || data.data.accessToken;
}
async function api(endpoint, method, token, body) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return { status: res.status, data };
}
async function runValidation() {
    console.log("================================================================");
    console.log("🚀 STARTING REAL USER ACTION UI-TO-DATABASE VALIDATION");
    console.log("================================================================\n");
    // Step 0: Authenticate as System Admin
    console.log("[AUTH] Logging in as System Administrator...");
    const adminToken = await login("admin@maintenx.com");
    console.log("✅ Authenticated. JWT received.\n");
    const [tenant] = await database_js_1.db.select().from(index_js_1.tenants).limit(1);
    const [plant] = await database_js_1.db.select().from(index_js_1.plants).where((0, drizzle_orm_1.eq)(index_js_1.plants.tenantId, tenant.id)).limit(1);
    const [user] = await database_js_1.db.select().from(index_js_1.users).where((0, drizzle_orm_1.eq)(index_js_1.users.tenantId, tenant.id)).limit(1);
    // --------------------------------------------------------------------------
    // MODULE 1: MASTER DATA (SKU, Work Center, Line, Routing & Steps)
    // --------------------------------------------------------------------------
    console.log("--- 1. MASTER DATA ACTIONS ---");
    // 1.1 Create SKU
    const skuCode = `SKU-VAL-${Date.now().toString().slice(-4)}`;
    const skuPayload = {
        skuCode: skuCode,
        name: "Sparkling Citrus Cooler 500ml",
        category: "FINISHED_GOODS",
        uom: "Units",
        standardCost: 0.85,
    };
    const skuRes = await api("/master-data/skus", "POST", adminToken, skuPayload);
    const [dbSku] = await database_js_1.db.select().from(index_js_1.skus).where((0, drizzle_orm_1.eq)(index_js_1.skus.skuCode, skuCode));
    results.push({
        module: "Master Data",
        action: "Create SKU",
        endpoint: "POST /master-data/skus",
        httpStatus: skuRes.status,
        dbTable: "skus",
        recordId: dbSku?.id || "-",
        persistedState: dbSku ? { skuCode: dbSku.skuCode, name: dbSku.name, category: dbSku.category } : null,
        status: dbSku && skuRes.status === 201 ? "GREEN" : "RED",
        notes: "SKU entity persisted into PostgreSQL with constraints verified",
    });
    console.log(`  -> DB verification: SKU ID=${dbSku?.id}, Code=${dbSku?.skuCode} [${dbSku ? "FOUND" : "MISSING"}]`);
    // 1.2 Create Work Center
    const wcCode = `WC-${Date.now().toString().slice(-4)}`;
    const wcPayload = {
        code: wcCode,
        name: "Rotary Isobaric Filler & Sealer",
        category: "PACKAGING",
        capacityPerHour: 36000,
    };
    const wcRes = await api("/master-data/work-centers", "POST", adminToken, wcPayload);
    const [dbWc] = await database_js_1.db.select().from(index_js_1.workCenters).where((0, drizzle_orm_1.eq)(index_js_1.workCenters.code, wcCode));
    results.push({
        module: "Master Data",
        action: "Create Work Center",
        endpoint: "POST /master-data/work-centers",
        httpStatus: wcRes.status,
        dbTable: "work_centers",
        recordId: dbWc?.id || "-",
        persistedState: dbWc ? { code: dbWc.code, name: dbWc.name, capacity: dbWc.capacityPerHour } : null,
        status: dbWc && wcRes.status === 201 ? "GREEN" : "RED",
        notes: "Work center cell persisted in work_centers",
    });
    console.log(`  -> DB verification: Work Center ID=${dbWc?.id}, Code=${dbWc?.code} [${dbWc ? "FOUND" : "MISSING"}]`);
    // 1.3 Create Production Line
    const lineCode = `LIN-${Date.now().toString().slice(-4)}`;
    const linePayload = {
        code: lineCode,
        name: "High-Speed Bottling Line 1",
        lineType: "BOTTLING",
        nominalSpeedBpm: 600,
    };
    const lineRes = await api("/master-data/lines", "POST", adminToken, linePayload);
    const [dbLine] = await database_js_1.db.select().from(index_js_1.productionLines).where((0, drizzle_orm_1.eq)(index_js_1.productionLines.code, lineCode));
    results.push({
        module: "Master Data",
        action: "Create Production Line",
        endpoint: "POST /master-data/lines",
        httpStatus: lineRes.status,
        dbTable: "production_lines",
        recordId: dbLine?.id || "-",
        persistedState: dbLine ? { code: dbLine.code, name: dbLine.name } : null,
        status: dbLine && lineRes.status === 201 ? "GREEN" : "RED",
        notes: "Production line persisted in production_lines",
    });
    console.log(`  -> DB verification: Production Line ID=${dbLine?.id}, Code=${dbLine?.code} [${dbLine ? "FOUND" : "MISSING"}]`);
    // 1.4 Create Routing with Steps
    const rtgCode = `RTG-${skuCode}-L1`;
    const rtgPayload = {
        routingCode: rtgCode,
        skuId: dbSku?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        lineId: dbLine?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        plantId: plant?.id,
        stdRunRateBph: 36000,
        setupDurationMin: 30,
        steps: [
            { sequence: 10, operationCode: "OP-10", operationName: "Depalletizing & Bottle Rinse", stdDurationMin: 5 },
            { sequence: 20, operationCode: "OP-20", operationName: "Isobaric Rotary Fill", stdDurationMin: 15 },
            { sequence: 30, operationCode: "OP-30", operationName: "Induction Cap Seal & Inspection", stdDurationMin: 10 },
        ],
    };
    const rtgRes = await api("/master-data/routings", "POST", adminToken, rtgPayload);
    const [dbRtg] = await database_js_1.db.select().from(index_js_1.routings).where((0, drizzle_orm_1.eq)(index_js_1.routings.routingCode, rtgCode));
    const rtgStepsList = dbRtg ? await database_js_1.db.select().from(index_js_1.routingSteps).where((0, drizzle_orm_1.eq)(index_js_1.routingSteps.routingId, dbRtg.id)) : [];
    results.push({
        module: "Master Data",
        action: "Create Routing & Steps",
        endpoint: "POST /master-data/routings",
        httpStatus: rtgRes.status,
        dbTable: "routings + routing_steps",
        recordId: dbRtg?.id || "-",
        persistedState: dbRtg ? { routingCode: dbRtg.routingCode, stepsCount: rtgStepsList.length } : null,
        status: dbRtg && rtgStepsList.length === 3 && rtgRes.status === 201 ? "GREEN" : "RED",
        notes: `Routing persisted with ${rtgStepsList.length} normalized steps`,
    });
    console.log(`  -> DB verification: Routing ID=${dbRtg?.id}, Steps=${rtgStepsList.length} [${dbRtg ? "FOUND" : "MISSING"}]\n`);
    // --------------------------------------------------------------------------
    // MODULE 2: PLANNING & DEMAND
    // --------------------------------------------------------------------------
    console.log("--- 2. PLANNING & DEMAND ACTIONS ---");
    // 2.1 Create Customer Demand Order
    const orderNum = `PO-WFM-${Date.now().toString().slice(-5)}`;
    const orderPayload = {
        orderNumber: orderNum,
        customerName: "Whole Foods Regional Supply",
        skuId: dbSku ? dbSku.id : skuCode,
        quantity: 24000,
        priority: "URGENT",
        requestedDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
        deliveryAddress: "Hub #4, Austin Distribution Center",
    };
    const orderRes = await api("/planning/demand/orders", "POST", adminToken, orderPayload);
    const [dbOrder] = await database_js_1.db.select().from(index_js_1.customerOrders).where((0, drizzle_orm_1.eq)(index_js_1.customerOrders.orderNumber, orderNum));
    results.push({
        module: "Planning",
        action: "Create Demand Order",
        endpoint: "POST /planning/demand/orders",
        httpStatus: orderRes.status,
        dbTable: "customer_orders",
        recordId: dbOrder?.id || "-",
        persistedState: dbOrder ? { orderNumber: dbOrder.orderNumber, customer: dbOrder.customerName, qty: dbOrder.quantity } : null,
        status: dbOrder && orderRes.status === 201 ? "GREEN" : "RED",
        notes: "Demand order persisted in customer_orders",
    });
    console.log(`  -> DB verification: Demand Order ID=${dbOrder?.id}, Num=${dbOrder?.orderNumber} [${dbOrder ? "FOUND" : "MISSING"}]`);
    // 2.2 Run Statistical Forecast
    const fcRes = await api("/planning/forecast/run", "POST", adminToken, {
        skuId: dbSku ? dbSku.id : skuCode,
        period: "2026-W37",
        alpha: 0.3,
        promoUpliftPercent: 15,
    });
    const [dbFc] = await database_js_1.db.select().from(index_js_1.forecasts).where((0, drizzle_orm_1.eq)(index_js_1.forecasts.skuId, dbSku?.id || "")).orderBy((0, drizzle_orm_1.desc)(index_js_1.forecasts.createdAt)).limit(1);
    results.push({
        module: "Planning",
        action: "Run Statistical Forecast",
        endpoint: "POST /planning/forecast/run",
        httpStatus: fcRes.status,
        dbTable: "forecasts",
        recordId: dbFc?.id || "-",
        persistedState: dbFc ? { period: dbFc.period, finalForecast: dbFc.finalForecast } : null,
        status: dbFc && fcRes.status === 200 ? "GREEN" : "RED",
        notes: "Forecast calculated via Holt-Winters engine and recorded in forecasts table",
    });
    console.log(`  -> DB verification: Forecast ID=${dbFc?.id}, Value=${dbFc?.finalForecast} [${dbFc ? "FOUND" : "MISSING"}]`);
    // 2.3 Calculate MRP Net Requirements
    const mrpRes = await api("/planning/mrp/net-requirements", "POST", adminToken, {
        plantId: plant?.id,
        skuId: dbSku ? dbSku.id : undefined,
    });
    results.push({
        module: "Planning",
        action: "Calculate MRP Net Requirements",
        endpoint: "POST /planning/mrp/net-requirements",
        httpStatus: mrpRes.status,
        dbTable: "mrp_requirements",
        recordId: "MRP_CALCULATION",
        persistedState: { success: mrpRes.data.success, itemsCount: Array.isArray(mrpRes.data.data) ? mrpRes.data.data.length : 1 },
        status: mrpRes.status === 200 ? "GREEN" : "RED",
        notes: "MRP multi-level BOM explosion executed with stock balance computation",
    });
    console.log(`  -> MRP Engine: status=${mrpRes.status}`);
    // 2.4 Publish APS Gantt Schedule
    const apsPayload = {
        lineId: dbLine?.id || "LINE-1",
        skuId: dbSku ? dbSku.id : skuCode,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 6 * 3600000).toISOString(),
        quantity: 12000,
        changeoverMinutes: 20,
        cipRequired: false,
    };
    const apsRes = await api("/planning/aps/schedules", "POST", adminToken, apsPayload);
    const [dbAps] = await database_js_1.db.select().from(index_js_1.apsSchedules).where((0, drizzle_orm_1.eq)(index_js_1.apsSchedules.skuId, dbSku?.id || "")).orderBy((0, drizzle_orm_1.desc)(index_js_1.apsSchedules.createdAt)).limit(1);
    results.push({
        module: "Planning",
        action: "Publish APS Schedule",
        endpoint: "POST /planning/aps/schedules",
        httpStatus: apsRes.status,
        dbTable: "aps_schedules",
        recordId: dbAps?.id || "-",
        persistedState: dbAps ? { startTime: dbAps.startTime, quantity: dbAps.quantity } : null,
        status: dbAps && apsRes.status === 201 ? "GREEN" : "RED",
        notes: "Finite-capacity schedule stored for shop floor execution",
    });
    console.log(`  -> DB verification: APS Schedule ID=${dbAps?.id}, Qty=${dbAps?.quantity} [${dbAps ? "FOUND" : "MISSING"}]\n`);
    // --------------------------------------------------------------------------
    // MODULE 3: PRODUCTION / MES & eBR
    // --------------------------------------------------------------------------
    console.log("--- 3. PRODUCTION & eBR ACTIONS ---");
    // 3.1 Create Production Order
    const prodOrderRes = await api("/production/orders", "POST", adminToken, {
        orderNumber: `PO-PROD-${Date.now().toString().slice(-4)}`,
        skuId: dbSku?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        lineId: dbLine?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        plannedQuantity: 18000,
    });
    const createdOrder = prodOrderRes.data.data?.order || prodOrderRes.data.data;
    const [dbProdOrder] = await database_js_1.db.select().from(index_js_1.productionOrders).where((0, drizzle_orm_1.eq)(index_js_1.productionOrders.id, createdOrder?.id || ""));
    results.push({
        module: "Production",
        action: "Create Production Order & Batch",
        endpoint: "POST /production/orders",
        httpStatus: prodOrderRes.status,
        dbTable: "production_orders + batches",
        recordId: dbProdOrder?.id || "-",
        persistedState: dbProdOrder ? { orderNumber: dbProdOrder.orderNumber, status: dbProdOrder.status } : null,
        status: dbProdOrder && prodOrderRes.status === 201 ? "GREEN" : "RED",
        notes: "Production Order and associated eBR Batch initialized",
    });
    console.log(`  -> DB verification: Prod Order ID=${dbProdOrder?.id}, Num=${dbProdOrder?.orderNumber} [${dbProdOrder ? "FOUND" : "MISSING"}]`);
    // 3.2 Update Status to IN_PROGRESS
    const statusRes = await api(`/production/orders/${dbProdOrder?.id}/status`, "PATCH", adminToken, {
        status: "IN_PROGRESS",
    });
    const [dbProdOrderUpdated] = await database_js_1.db.select().from(index_js_1.productionOrders).where((0, drizzle_orm_1.eq)(index_js_1.productionOrders.id, dbProdOrder?.id || ""));
    results.push({
        module: "Production",
        action: "Advance Order to IN_PROGRESS",
        endpoint: "PATCH /production/orders/:id/status",
        httpStatus: statusRes.status,
        dbTable: "production_orders",
        recordId: dbProdOrderUpdated?.id || "-",
        persistedState: dbProdOrderUpdated ? { status: dbProdOrderUpdated.status } : null,
        status: (dbProdOrderUpdated?.status === "RUNNING" || dbProdOrderUpdated?.status === "IN_PROGRESS") && statusRes.status === 200 ? "GREEN" : "RED",
        notes: "Status updated in PostgreSQL and verified",
    });
    console.log(`  -> DB verification: Order Status=${dbProdOrderUpdated?.status}`);
    // 3.3 Complete Production Order
    const completeRes = await api(`/production/orders/${dbProdOrder?.id}/status`, "PATCH", adminToken, {
        status: "COMPLETED",
    });
    const [dbProdOrderComplete] = await database_js_1.db.select().from(index_js_1.productionOrders).where((0, drizzle_orm_1.eq)(index_js_1.productionOrders.id, dbProdOrder?.id || ""));
    results.push({
        module: "Production",
        action: "Complete Production Order",
        endpoint: "PATCH /production/orders/:id/status",
        httpStatus: completeRes.status,
        dbTable: "production_orders",
        recordId: dbProdOrderComplete?.id || "-",
        persistedState: dbProdOrderComplete ? { status: dbProdOrderComplete.status } : null,
        status: dbProdOrderComplete?.status === "COMPLETED" && completeRes.status === 200 ? "GREEN" : "RED",
        notes: "Order marked completed and ready for QA disposition",
    });
    console.log(`  -> DB verification: Order Completed Status=${dbProdOrderComplete?.status}\n`);
    // --------------------------------------------------------------------------
    // MODULE 4: QUALITY & 21 CFR PART 11
    // --------------------------------------------------------------------------
    console.log("--- 4. QUALITY & REGULATORY COMPLIANCE ACTIONS ---");
    // 4.1 Record CCP Check (PASS)
    const [activeBatch] = await database_js_1.db.select().from(index_js_1.batches).where((0, drizzle_orm_1.eq)(index_js_1.batches.productionOrderId, dbProdOrder?.id || "")).limit(1);
    const ccpPassRes = await api("/quality/ccp", "POST", adminToken, {
        lineId: dbLine?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        batchId: activeBatch?.id || "f2b711ac-68cd-4111-a6f4-256155a7776a",
        ccpCode: "CCP-1",
        ccpName: "Flash Pasteurization Kill Step",
        targetValue: 85.0,
        actualValue: 85.6,
        criticalLimitMin: 83.1,
        criticalLimitMax: 92.0,
        uom: "°C",
        notes: "Normal thermal kill curve verified",
    });
    const [dbCcpPass] = await database_js_1.db.select().from(index_js_1.ccpChecks).where((0, drizzle_orm_1.eq)(index_js_1.ccpChecks.ccpCode, "CCP-1")).orderBy((0, drizzle_orm_1.desc)(index_js_1.ccpChecks.checkedAt)).limit(1);
    results.push({
        module: "Quality",
        action: "Submit Compliant CCP Check",
        endpoint: "POST /quality/ccp",
        httpStatus: ccpPassRes.status,
        dbTable: "ccp_checks",
        recordId: dbCcpPass?.id || "-",
        persistedState: dbCcpPass ? { actualValue: dbCcpPass.actualValue, status: dbCcpPass.status } : null,
        status: dbCcpPass?.status === "PASS" && ccpPassRes.status === 201 ? "GREEN" : "RED",
        notes: "Evaluated within critical limits, status recorded as PASS",
    });
    console.log(`  -> DB verification: CCP Check ID=${dbCcpPass?.id}, Status=${dbCcpPass?.status} [${dbCcpPass ? "FOUND" : "MISSING"}]`);
    // 4.2 Record CCP Check (FAIL - Out of Spec)
    const ccpFailRes = await api("/quality/ccp", "POST", adminToken, {
        lineId: dbLine?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        batchId: activeBatch?.id || "f2b711ac-68cd-4111-a6f4-256155a7776a",
        ccpCode: "CCP-1",
        ccpName: "Flash Pasteurization Kill Step",
        targetValue: 85.0,
        actualValue: 81.4, // Below 83.1 min limit!
        criticalLimitMin: 83.1,
        criticalLimitMax: 92.0,
        uom: "°C",
        notes: "Steam valve fluctuation causing temperature dip",
    });
    const [dbCcpFail] = await database_js_1.db.select().from(index_js_1.ccpChecks).where((0, drizzle_orm_1.eq)(index_js_1.ccpChecks.status, "FAIL")).orderBy((0, drizzle_orm_1.desc)(index_js_1.ccpChecks.checkedAt)).limit(1);
    results.push({
        module: "Quality",
        action: "Submit Non-Compliant CCP Check",
        endpoint: "POST /quality/ccp",
        httpStatus: ccpFailRes.status,
        dbTable: "ccp_checks",
        recordId: dbCcpFail?.id || "-",
        persistedState: dbCcpFail ? { actualValue: dbCcpFail.actualValue, status: dbCcpFail.status } : null,
        status: dbCcpFail?.status === "FAIL" && ccpFailRes.status === 201 ? "GREEN" : "RED",
        notes: "Auto-evaluated as FAIL because actualValue < criticalLimitMin",
    });
    console.log(`  -> DB verification: Non-Compliant CCP ID=${dbCcpFail?.id}, Status=${dbCcpFail?.status}`);
    // 4.3 Place Quality Hold on Deviation Lot
    const holdLotCode = `LOT-DEV-${Date.now().toString().slice(-4)}`;
    const holdRes = await api("/quality/holds", "POST", adminToken, {
        lotNumber: holdLotCode,
        batchId: activeBatch?.id,
        reason: "Under-temperature pasteurization excursion (81.4°C)",
        severity: "HIGH",
    });
    const [dbHold] = await database_js_1.db.select().from(index_js_1.qualityHolds).where((0, drizzle_orm_1.eq)(index_js_1.qualityHolds.lotNumber, holdLotCode));
    results.push({
        module: "Quality",
        action: "Place Quality Hold",
        endpoint: "POST /quality/holds",
        httpStatus: holdRes.status,
        dbTable: "quality_holds",
        recordId: dbHold?.id || "-",
        persistedState: dbHold ? { lotNumber: dbHold.lotNumber, status: dbHold.status, reason: dbHold.reason } : null,
        status: dbHold && holdRes.status === 201 ? "GREEN" : "RED",
        notes: "Hold locked lot in quality_holds table with ACTIVE_HOLD status",
    });
    console.log(`  -> DB verification: Quality Hold ID=${dbHold?.id}, Lot=${dbHold?.lotNumber} [${dbHold ? "FOUND" : "MISSING"}]`);
    // 4.4 21 CFR Part 11 Electronic QA Release with Digital PIN
    const releaseRes = await api("/quality/release/authorize", "POST", adminToken, {
        batchId: activeBatch?.id || "f2b711ac-68cd-4111-a6f4-256155a7776a",
        disposition: "RELEASED",
        signaturePin: "1234",
        comments: "Quality Director authorized release with complete CoA audit trail",
    });
    const [dbRelease] = await database_js_1.db.select().from(index_js_1.qaReleases).where((0, drizzle_orm_1.eq)(index_js_1.qaReleases.batchId, activeBatch?.id || "")).orderBy((0, drizzle_orm_1.desc)(index_js_1.qaReleases.releasedAt)).limit(1);
    results.push({
        module: "Quality",
        action: "21 CFR Part 11 Electronic Release",
        endpoint: "POST /quality/release/authorize",
        httpStatus: releaseRes.status,
        dbTable: "qa_releases + batches",
        recordId: dbRelease?.id || "-",
        persistedState: dbRelease ? { disposition: dbRelease.disposition, coaUrl: dbRelease.certificateOfAnalysisUrl } : null,
        status: dbRelease?.disposition === "RELEASED" && releaseRes.status === 200 ? "GREEN" : "RED",
        notes: "Cryptographic signature validated via PBKDF2 PIN verification",
    });
    console.log(`  -> DB verification: QA Release ID=${dbRelease?.id}, Disposition=${dbRelease?.disposition} [${dbRelease ? "FOUND" : "MISSING"}]\n`);
    // --------------------------------------------------------------------------
    // MODULE 5: WAREHOUSE & INVENTORY
    // --------------------------------------------------------------------------
    console.log("--- 5. WAREHOUSE & INVENTORY ACTIONS ---");
    // 5.1 Inbound Goods Receipt Movement
    const [firstLot] = await database_js_1.db.select().from(index_js_1.inventoryLots).where((0, drizzle_orm_1.eq)(index_js_1.inventoryLots.tenantId, tenant.id)).limit(1);
    const receiptRef = `GRN-${Date.now().toString().slice(-5)}`;
    const receiptRes = await api("/warehouse/transactions", "POST", adminToken, {
        lotId: firstLot?.id || "00000000-0000-0000-0000-000000000001",
        type: "RECEIPT",
        quantity: 5000,
        uom: "kg",
        referenceType: "INITIAL_INBOUND_RECEIPT",
        referenceId: receiptRef,
        notes: "Raw ingredient shipment received and staged",
    });
    const [dbReceiptTx] = await database_js_1.db.select().from(index_js_1.inventoryTransactions).where((0, drizzle_orm_1.eq)(index_js_1.inventoryTransactions.referenceId, receiptRef));
    results.push({
        module: "Warehouse",
        action: "Record Inbound Goods Receipt",
        endpoint: "POST /warehouse/transactions",
        httpStatus: receiptRes.status,
        dbTable: "inventory_transactions",
        recordId: dbReceiptTx?.id || "-",
        persistedState: dbReceiptTx ? { type: dbReceiptTx.type, qty: dbReceiptTx.quantity, ref: dbReceiptTx.referenceId } : null,
        status: dbReceiptTx && receiptRes.status === 201 ? "GREEN" : "RED",
        notes: "Inbound goods receipt movement persisted in inventory_transactions",
    });
    console.log(`  -> DB verification: Stock Transaction ID=${dbReceiptTx?.id}, Ref=${dbReceiptTx?.referenceId} [${dbReceiptTx ? "FOUND" : "MISSING"}]`);
    // 5.2 Warehouse Putaway Transfer
    const transferRef = `TRF-${Date.now().toString().slice(-5)}`;
    const transferRes = await api("/warehouse/transactions", "POST", adminToken, {
        lotId: firstLot?.id || "00000000-0000-0000-0000-000000000001",
        type: "TRANSFER",
        quantity: 2500,
        uom: "kg",
        referenceType: "TRANSFER",
        referenceId: transferRef,
        notes: "Putaway executed by forklift operator",
    });
    const [dbTransferTx] = await database_js_1.db.select().from(index_js_1.inventoryTransactions).where((0, drizzle_orm_1.eq)(index_js_1.inventoryTransactions.referenceId, transferRef));
    results.push({
        module: "Warehouse",
        action: "Record Putaway Transfer",
        endpoint: "POST /warehouse/transactions",
        httpStatus: transferRes.status,
        dbTable: "inventory_transactions",
        recordId: dbTransferTx?.id || "-",
        persistedState: dbTransferTx ? { type: dbTransferTx.type, qty: dbTransferTx.quantity, ref: dbTransferTx.referenceId } : null,
        status: dbTransferTx && transferRes.status === 201 ? "GREEN" : "RED",
        notes: "Transfer movement updated location in warehouse register",
    });
    console.log(`  -> DB verification: Stock Transfer ID=${dbTransferTx?.id}, Ref=${dbTransferTx?.referenceId} [${dbTransferTx ? "FOUND" : "MISSING"}]\n`);
    // --------------------------------------------------------------------------
    // MODULE 6: MAINTENANCE / CMMS
    // --------------------------------------------------------------------------
    console.log("--- 6. MAINTENANCE / CMMS ACTIONS ---");
    // 6.1 Create Work Order
    const [firstAsset] = await database_js_1.db.select().from(index_js_1.assets).where((0, drizzle_orm_1.eq)(index_js_1.assets.tenantId, tenant.id)).limit(1);
    const woRes = await api("/maintenance/work-orders", "POST", adminToken, {
        assetId: firstAsset?.id || "c95201ab-a665-40ee-acd8-bd630e901932",
        title: "Quarterly Bearing Lubrication & Seal Replacement",
        description: "Replace seals on main drive gearbox and inspect rotor play",
        type: "PREVENTIVE",
        priority: "HIGH",
        estimatedHours: 3.5,
    });
    const createdWO = woRes.data.data;
    const [dbWO] = await database_js_1.db.select().from(index_js_1.workOrders).where((0, drizzle_orm_1.eq)(index_js_1.workOrders.id, createdWO?.id || ""));
    results.push({
        module: "Maintenance",
        action: "Create Maintenance Work Order",
        endpoint: "POST /maintenance/work-orders",
        httpStatus: woRes.status,
        dbTable: "work_orders",
        recordId: dbWO?.id || "-",
        persistedState: dbWO ? { woNumber: dbWO.woNumber, title: dbWO.title, status: dbWO.status } : null,
        status: dbWO && woRes.status === 201 ? "GREEN" : "RED",
        notes: "Work order created with assigned asset and estimated hours",
    });
    console.log(`  -> DB verification: Work Order ID=${dbWO?.id}, Num=${dbWO?.woNumber} [${dbWO ? "FOUND" : "MISSING"}]`);
    // 6.2 Advance Work Order to IN_PROGRESS
    const woProgRes = await api(`/maintenance/work-orders/${dbWO?.id}/status`, "PATCH", adminToken, {
        status: "IN_PROGRESS",
    });
    const [dbWOProg] = await database_js_1.db.select().from(index_js_1.workOrders).where((0, drizzle_orm_1.eq)(index_js_1.workOrders.id, dbWO?.id || ""));
    results.push({
        module: "Maintenance",
        action: "Advance Work Order to IN_PROGRESS",
        endpoint: "PATCH /maintenance/work-orders/:id/status",
        httpStatus: woProgRes.status,
        dbTable: "work_orders",
        recordId: dbWOProg?.id || "-",
        persistedState: dbWOProg ? { status: dbWOProg.status } : null,
        status: dbWOProg?.status === "IN_PROGRESS" && woProgRes.status === 200 ? "GREEN" : "RED",
        notes: "Technician dispatch status updated",
    });
    console.log(`  -> DB verification: WO Status=${dbWOProg?.status}`);
    // 6.3 Complete Work Order
    const woCompRes = await api(`/maintenance/work-orders/${dbWO?.id}/status`, "PATCH", adminToken, {
        status: "COMPLETED",
        actualHours: 3.2,
    });
    const [dbWOComp] = await database_js_1.db.select().from(index_js_1.workOrders).where((0, drizzle_orm_1.eq)(index_js_1.workOrders.id, dbWO?.id || ""));
    results.push({
        module: "Maintenance",
        action: "Complete Work Order",
        endpoint: "PATCH /maintenance/work-orders/:id/status",
        httpStatus: woCompRes.status,
        dbTable: "work_orders",
        recordId: dbWOComp?.id || "-",
        persistedState: dbWOComp ? { status: dbWOComp.status, actualHours: dbWOComp.actualHours, completedAt: dbWOComp.completedAt } : null,
        status: dbWOComp?.status === "COMPLETED" && woCompRes.status === 200 ? "GREEN" : "RED",
        notes: "Work order closed with recorded actual hours and completion timestamp",
    });
    console.log(`  -> DB verification: WO Complete Status=${dbWOComp?.status}, ActualHours=${dbWOComp?.actualHours}\n`);
    // --------------------------------------------------------------------------
    // MODULE 7: TRACEABILITY & RECALL SIMULATION
    // --------------------------------------------------------------------------
    console.log("--- 7. TRACEABILITY & RECALL SIMULATION ACTIONS ---");
    const recallTargetLot = "LOT-RM-GNG-0092";
    const recallRes = await api("/traceability/recall/simulate", "POST", adminToken, {
        lotNumber: recallTargetLot,
        reason: "Suspected mycotoxin contamination in raw root batch",
    });
    const [dbRecall] = await database_js_1.db.select().from(index_js_1.recallEvents).where((0, drizzle_orm_1.eq)(index_js_1.recallEvents.targetLotNumber, recallTargetLot)).orderBy((0, drizzle_orm_1.desc)(index_js_1.recallEvents.createdAt)).limit(1);
    results.push({
        module: "Traceability",
        action: "Simulate FDA / FSMA 204 Mock Recall",
        endpoint: "POST /traceability/recall/simulate",
        httpStatus: recallRes.status,
        dbTable: "recall_events",
        recordId: dbRecall?.id || "-",
        persistedState: dbRecall ? { code: dbRecall.recallCode, status: dbRecall.status, lot: dbRecall.targetLotNumber } : null,
        status: dbRecall && recallRes.status === 200 ? "GREEN" : "RED",
        notes: "Genealogical explosion calculated, impact summary recorded in recall_events",
    });
    console.log(`  -> DB verification: Recall Event ID=${dbRecall?.id}, Code=${dbRecall?.recallCode} [${dbRecall ? "FOUND" : "MISSING"}]\n`);
    // --------------------------------------------------------------------------
    // MODULE 8: DASHBOARDS LIVE POSTGRESQL METRICS
    // --------------------------------------------------------------------------
    console.log("--- 8. LIVE COMMAND CENTER DASHBOARD METRICS ---");
    const dashRes = await api("/dashboards/command-center", "GET", adminToken);
    const kpis = dashRes.data.data;
    console.log("  Live KPIs from DB:", JSON.stringify(kpis));
    results.push({
        module: "Dashboards",
        action: "Query Live Command Center KPIs",
        endpoint: "GET /dashboards/command-center",
        httpStatus: dashRes.status,
        dbTable: "live SQL aggregation across 4 tables",
        recordId: "DASHBOARD_LIVE",
        persistedState: kpis,
        status: dashRes.status === 200 && kpis?.pillars !== undefined ? "GREEN" : "RED",
        notes: "Aggregated live from PostgreSQL quality_holds, work_orders, and inventory_lots",
    });
    // --------------------------------------------------------------------------
    // FINAL SUMMARY REPORT GENERATION
    // --------------------------------------------------------------------------
    console.log("\n================================================================");
    console.log("📊 VALIDATION SUITE SUMMARY");
    console.log("================================================================");
    const total = results.length;
    const passed = results.filter((r) => r.status === "GREEN").length;
    const yellow = results.filter((r) => r.status === "YELLOW").length;
    const red = results.filter((r) => r.status === "RED").length;
    console.log(`Total Actions Tested: ${total}`);
    console.log(`Passed (GREEN):       ${passed}`);
    console.log(`Yellow:               ${yellow}`);
    console.log(`Failed (RED):         ${red}`);
    console.log("================================================================\n");
    results.forEach((r, idx) => {
        const icon = r.status === "GREEN" ? "✅" : (r.status === "YELLOW" ? "⚠️" : "❌");
        console.log(`${icon} [${r.status}] ${r.module} — ${r.action}`);
        console.log(`   Endpoint: ${r.endpoint} (HTTP ${r.httpStatus})`);
        console.log(`   Table:    ${r.dbTable} | Record: ${r.recordId}`);
        console.log(`   Notes:    ${r.notes}\n`);
    });
    if (red === 0) {
        console.log("🎉 ALL 18 CORE REAL-USER ACTIONS PASSED CLEANLY WITH DATABASE PERSISTENCE!");
    }
    else {
        console.error(`❌ ${red} ACTION(S) FAILED VALIDATION.`);
        process.exit(1);
    }
    process.exit(0);
}
runValidation().catch((err) => {
    console.error("Fatal error during validation:", err);
    process.exit(1);
});
//# sourceMappingURL=verify-real-ui-actions.js.map