import { db } from "../../config/database.js";
import { productionOrders, batches, downtimeLogs, shiftLogs } from "../../db/schema/production.js";
import { qualityHolds, ccpChecks } from "../../db/schema/quality.js";
import { workOrders } from "../../db/schema/maintenance.js";
import { inventoryLots } from "../../db/schema/warehouse.js";
import { exceptions } from "../../db/schema/common.js";
import { eq, and } from "drizzle-orm";
import { calculateOEE } from "../../shared/engines/oeeEngine.js";

export class DashboardsService {
  // ─── LINE LEAD DASHBOARD ────────────────────────────────────────────────────

  async getLineLeadDashboard(tenantId: string) {
    return {
      kpi: {
        currentHB: { actual: 18950, target: 24000, paceBPM: 580, targetPaceBPM: 600, remainingHours: 3.5 },
        eodProjection: "On Target",
        recoveryPaceBPM: 24,
      },
      staffing: { present: 5, total: 5, status: "Fully Staffed" },
      nextChangeover: { minutesAway: 45, toSKU: "SKU-AJ-1L-ORG" },
      downtime: { totalMinutes: 35, microStopsActive: true },
      materialAlert: { lotId: "LOT-ORG-442", lowStockItem: "Orange Caps", supplyStatus: "Low" },
      qualityHolds: { activeBatches: 0, lastCheckTime: "14:00", lastCheckResult: "PASSED" },
      maintenance: { openWorkOrders: 3, escalatedP1: 1 },
    };
  }

  async getMaterialLog(tenantId: string) {
    return {
      lotId: "LOT-ORG-442",
      lowStockAlert: { item: "Orange Screw Caps (500ml PET)", remainingMinutes: 45, paceBPM: 580 },
      items: [
        { name: "Orange Screw Caps (500ml PET)", lot: "LOT-CAP-901", qty: "1,200 caps", status: "Low Stock" },
        { name: "Organic Cold-Pressed Juice Base", lot: "LOT-ORG-442", qty: "8,400 Liters", status: "Optimal" },
        { name: "500ml Clear PET Bottles", lot: "LOT-BOT-112", qty: "22,000 units", status: "Optimal" },
        { name: "Carton Outer Boxes (12x500ml)", lot: "LOT-BOX-880", qty: "4,500 boxes", status: "Optimal" },
      ],
    };
  }

  async getQualityLog(tenantId: string) {
    return {
      activeBatchesOnHold: 0,
      overallStatus: "Green",
      checkpoints: [
        { ccp: "CCP 1 — Pasteurizer Thermal Limit", target: "83.5°C (Min 82.0°C)", actual: "83.5°C", time: "14:00", result: "PASSED" },
        { ccp: "CCP 2 — Brix Sugar Concentration", target: "11.9 °BX (Range 11.5 - 12.2)", actual: "11.9 °BX", time: "13:45", result: "PASSED" },
        { ccp: "Quality Check — Bottle pH Value", target: "3.72 pH (Range 3.60 - 3.85)", actual: "3.72 pH", time: "13:45", result: "PASSED" },
        { ccp: "Nozzle Seal & Capping Torque", target: "1.8 Nm ± 0.2", actual: "1.85 Nm", time: "13:30", result: "PASSED" },
      ],
    };
  }

  async logQaSampleCheck(tenantId: string, payload: { lineId?: string; notes?: string }) {
    const timestamp = new Date().toISOString();
    return {
      id: `QA-${Date.now()}`,
      lineId: payload.lineId || "LINE-1",
      result: "PASSED",
      loggedAt: timestamp,
      message: "QA sample check logged successfully. All CCP limits within range.",
    };
  }

  async acknowledgeMicroStop(tenantId: string, payload: { lineId?: string; reason?: string }) {
    const timestamp = new Date().toISOString();
    return {
      id: `DT-${Date.now()}`,
      lineId: payload.lineId || "LINE-1",
      type: "Micro-Stop",
      reason: payload.reason || "Jam acknowledged by Line Lead",
      acknowledgedAt: timestamp,
      message: "Micro-stop jam acknowledged & logged in Downtime Ledger.",
    };
  }

  async requestStockReplenishment(tenantId: string, payload: { item: string; lotId: string; requestedBy?: string }) {
    const timestamp = new Date().toISOString();
    return {
      requestId: `SR-${Date.now()}`,
      item: payload.item,
      lotId: payload.lotId,
      requestedAt: timestamp,
      sentTo: "Warehouse",
      status: "Expedited",
      message: `Expedited material request for ${payload.item} sent to Warehouse.`,
    };
  }

  async proposeLineSpeedUp(tenantId: string, payload: { proposedBPM: number; lineId?: string; requestedBy?: string }) {
    const timestamp = new Date().toISOString();
    return {
      proposalId: `SP-${Date.now()}`,
      lineId: payload.lineId || "LINE-1",
      proposedBPM: payload.proposedBPM,
      currentBPM: 580,
      submittedAt: timestamp,
      status: "Pending Supervisor Approval",
      message: `Proposed speed increase to ${payload.proposedBPM} BPM submitted to Supervisor for authorization.`,
    };
  }

  // ─── H/B (HOUR-BY-HOUR) MANAGEMENT ──────────────────────────────────────────

  private hbLogs: any[] = [
    { id: "HB-1", hour: "06:00 - 07:00", target: 3000, actual: 3100, variance: 100, lossDriver: "None", status: "PASSED", notes: "Smooth run, zero downtime." },
    { id: "HB-2", hour: "07:00 - 08:00", target: 3000, actual: 2850, variance: -150, lossDriver: "Micro-Stop / Jam", status: "FAILED", notes: "Bottling star-wheel jam cleared in 4 mins." },
    { id: "HB-3", hour: "08:00 - 09:00", target: 3000, actual: 3050, variance: 50, lossDriver: "None", status: "PASSED", notes: "Speed adjusted to optimal pace." },
    { id: "HB-4", hour: "09:00 - 10:00", target: 3000, actual: 1200, variance: -1800, lossDriver: "Mechanical Failure", status: "FAILED", notes: "Capper motor overheating breakdown." },
    { id: "HB-5", hour: "10:00 - 11:00", target: 3000, actual: 2900, variance: -100, lossDriver: "Changeover", status: "FAILED", notes: "Labeler roll replacement." },
  ];

  async getHbLogs(tenantId: string) {
    return {
      shiftDate: new Date().toISOString().split("T")[0],
      lineId: "LINE-1",
      logs: this.hbLogs,
      summary: {
        totalTarget: this.hbLogs.reduce((s, l) => s + l.target, 0),
        totalActual: this.hbLogs.reduce((s, l) => s + l.actual, 0),
        totalVariance: this.hbLogs.reduce((s, l) => s + l.variance, 0),
        passedHours: this.hbLogs.filter(l => l.status === "PASSED").length,
        failedHours: this.hbLogs.filter(l => l.status === "FAILED").length,
      },
    };
  }

  async saveHbRecord(tenantId: string, payload: { hour: string; target: number; actual: number; lossDriver?: string; notes?: string }) {
    const variance = payload.actual - payload.target;
    const record = {
      id: `HB-${Date.now()}`,
      hour: payload.hour,
      target: payload.target,
      actual: payload.actual,
      variance,
      lossDriver: variance < 0 ? (payload.lossDriver || "None") : "None",
      status: variance >= 0 ? "PASSED" : "FAILED",
      notes: payload.notes || "",
      recordedAt: new Date().toISOString(),
    };
    this.hbLogs.push(record);
    return {
      ...record,
      message: `Hour log for ${payload.hour} recorded successfully.`,
    };
  }

  async updateHbRecord(tenantId: string, id: string, payload: { hour?: string; target?: number; actual?: number; lossDriver?: string; notes?: string }) {
    const idx = this.hbLogs.findIndex(l => l.id === id);
    if (idx === -1) {
      throw new Error(`H/B record ${id} not found`);
    }
    const existing = this.hbLogs[idx];
    const target = Number(payload.target ?? existing.target);
    const actual = Number(payload.actual ?? existing.actual);
    const variance = actual - target;
    const updated = {
      ...existing,
      hour: payload.hour ?? existing.hour,
      target,
      actual,
      variance,
      lossDriver: variance < 0 ? (payload.lossDriver ?? existing.lossDriver) : "None",
      status: variance >= 0 ? "PASSED" : "FAILED",
      notes: payload.notes ?? existing.notes,
      updatedAt: new Date().toISOString(),
    };
    this.hbLogs[idx] = updated;
    return {
      ...updated,
      message: `Hour record ${updated.hour} updated successfully.`,
    };
  }

  async recalculateCatchUp(tenantId: string, payload: { lineId?: string }) {
    const totalTarget = this.hbLogs.reduce((s, l) => s + l.target, 0);
    const totalActual = this.hbLogs.reduce((s, l) => s + l.actual, 0);
    const deficit = Math.max(0, totalTarget - totalActual);
    const remainingHours = 3;
    const catchUpTarget = deficit > 0 ? Math.ceil(3000 + deficit / remainingHours) : 3000;
    return {
      lineId: payload.lineId || "LINE-1",
      currentDeficit: deficit,
      recommendedHourlyTarget: catchUpTarget,
      remainingHours,
      message: `Catch-up schedule calculated: Target re-baselined to ${catchUpTarget.toLocaleString()} bottles/hr.`,
      calculatedAt: new Date().toISOString(),
    };
  }

  async bulkReconcileShift(tenantId: string, payload: { lineId?: string; submittedBy?: string }) {
    const totalTarget = this.hbLogs.reduce((s, l) => s + l.target, 0);
    const totalActual = this.hbLogs.reduce((s, l) => s + l.actual, 0);
    return {
      reconcileId: `REC-${Date.now()}`,
      lineId: payload.lineId || "LINE-1",
      submittedBy: payload.submittedBy || "Line Lead",
      totalHoursReconciled: this.hbLogs.length,
      totalTarget,
      totalActual,
      totalVariance: totalActual - totalTarget,
      submittedAt: new Date().toISOString(),
      status: "Submitted to Supervisor Queue",
      message: "All shift H/B hour records reconciled and submitted to Supervisor queue.",
    };
  }

  // ─── DOWNTIME & LOSS (RCA 2.0) ───────────────────────────────────────────────

  private downtimeLogs: any[] = [
    { id: "DT-001", assetId: "LB-204", assetName: "Krones Autocol Rotary Labeler", failureCategory: "Mechanical Failure", startTime: "2026-09-02 05:18", symptom: "\"trhrhrthy\"", durationMinutes: 15, status: "Investigating", endTime: null },
    { id: "DT-002", assetId: "HT-105", assetName: "Plate Heat Exchanger & Pasteurizer HTST-300", failureCategory: "Hydraulic / Pressure Loss", startTime: "2026-08-30 04:15", symptom: "\"Sudden pressure loss on Section 3 plates with temperature deviation alarm > 4°C above setpoint.\"", durationMinutes: 185, status: "Active Repair", endTime: null },
    { id: "DT-003", assetId: "FM-001", assetName: "High-Speed Rotary Filler 12-Head", failureCategory: "Mechanical / Bearing Fatigue", startTime: "2026-08-28 13:20", symptom: "\"Main drive torque overload alarm tripped during 600 BPM run; severe acoustic vibration.\"", durationMinutes: 105, status: "Resolved", endTime: "2026-08-28 15:05" },
  ];

  async getDowntimeLogs(tenantId: string) {
    return {
      logs: this.downtimeLogs,
      summary: {
        activeCount: this.downtimeLogs.filter(l => !l.endTime).length,
        resolvedCount: this.downtimeLogs.filter(l => !!l.endTime).length,
        totalDowntimeMinutes: this.downtimeLogs.reduce((s, l) => s + l.durationMinutes, 0),
      },
    };
  }

  async logBreakdown(tenantId: string, payload: { assetName: string; assetId?: string; failureCategory: string; symptom: string }) {
    const record = {
      id: `DT-${Date.now().toString().slice(-4)}`,
      assetId: payload.assetId || "AST-UNKNOWN",
      assetName: payload.assetName,
      failureCategory: payload.failureCategory,
      startTime: new Date().toISOString().replace("T", " ").slice(0, 16),
      symptom: `"${payload.symptom}"`,
      durationMinutes: 0,
      status: "Investigating",
      endTime: null,
      loggedAt: new Date().toISOString(),
    };
    this.downtimeLogs.unshift(record);
    return {
      ...record,
      message: `Unscheduled Breakdown recorded for ${payload.assetName}. Loss Driver: ${payload.failureCategory}.`,
    };
  }

  async acknowledgeDowntime(tenantId: string, id: string) {
    const idx = this.downtimeLogs.findIndex(l => l.id === id);
    if (idx === -1) throw new Error(`Downtime log ${id} not found`);
    this.downtimeLogs[idx].status = "Acknowledged";
    this.downtimeLogs[idx].acknowledgedAt = new Date().toISOString();
    return {
      id,
      status: "Acknowledged",
      acknowledgedAt: this.downtimeLogs[idx].acknowledgedAt,
      message: `Downtime event ${id} acknowledged by Line Lead.`,
    };
  }

  async dispatchTech(tenantId: string, id: string, payload: { assetName?: string; failureCategory?: string; symptom?: string }) {
    const workOrderId = `WO-${Date.now().toString().slice(-5)}`;
    return {
      workOrderId,
      downtimeId: id,
      assetName: payload.assetName || "Unknown Asset",
      title: `Corrective Maintenance: ${payload.failureCategory || "Breakdown"} on L1`,
      description: `Immediate dispatch requested for downtime event ${id}. Symptoms: ${payload.symptom || "N/A"}`,
      priority: "P1 - Critical",
      status: "Assigned",
      assignedAt: new Date().toISOString(),
      message: `Corrective Work Order ${workOrderId} created for ${payload.assetName}. Maintenance dispatched.`,
    };
  }

  // ─── CHANGEOVER CONTROL ──────────────────────────────────────────────────────

  private changeoverSession: any = {
    active: false,
    activeStep: 0,
    startedAt: null,
    currentSKU: "SKU-AJ-500ML-ORG",
    targetSKU: "SKU-AJ-1L-ORG",
    steps: [
      { id: "CO-1", name: "CIP Flushes & Nozzles Clean", duration: "15 min", completed: false },
      { id: "CO-2", name: "Guide Plate Swap", duration: "20 min", completed: false },
      { id: "CO-3", name: "Stock Cap Chute & Barcode Check", duration: "10 min", completed: false },
      { id: "CO-4", name: "Hourly Quality Torque Test", duration: "5 min", completed: false },
    ],
  };

  async getChangeoverStatus(tenantId: string) {
    return { ...this.changeoverSession };
  }

  async startChangeover(tenantId: string, payload: { lineId?: string }) {
    this.changeoverSession.active = true;
    this.changeoverSession.activeStep = 0;
    this.changeoverSession.startedAt = new Date().toISOString();
    this.changeoverSession.steps = this.changeoverSession.steps.map((s: any) => ({ ...s, completed: false }));
    return {
      ...this.changeoverSession,
      message: "Changeover sequence initiated. HMI Terminal locked.",
    };
  }

  async completeChangeoverStep(tenantId: string, stepId: string) {
    const idx = this.changeoverSession.steps.findIndex((s: any) => s.id === stepId);
    if (idx === -1) throw new Error(`Changeover step ${stepId} not found`);
    this.changeoverSession.steps[idx].completed = true;
    this.changeoverSession.steps[idx].completedAt = new Date().toISOString();
    this.changeoverSession.activeStep = idx + 1;
    return {
      stepId,
      stepName: this.changeoverSession.steps[idx].name,
      activeStep: this.changeoverSession.activeStep,
      totalSteps: this.changeoverSession.steps.length,
      message: `Changeover Step "${this.changeoverSession.steps[idx].name}" completed.`,
    };
  }

  async finishChangeover(tenantId: string, payload: { lineId?: string }) {
    const finishedAt = new Date().toISOString();
    const result = {
      changeoverSessionId: `CO-${Date.now().toString().slice(-6)}`,
      lineId: payload.lineId || "LINE-1",
      fromSKU: this.changeoverSession.currentSKU,
      toSKU: this.changeoverSession.targetSKU,
      startedAt: this.changeoverSession.startedAt,
      finishedAt,
      status: "Completed",
      message: "Changeover finished. Line 1 status set to Running.",
    };
    // Reset session
    this.changeoverSession.active = false;
    this.changeoverSession.activeStep = 0;
    this.changeoverSession.startedAt = null;
    this.changeoverSession.steps = this.changeoverSession.steps.map((s: any) => ({ ...s, completed: false }));
    return result;
  }

  async logChangeoverDelay(tenantId: string, payload: { exceededMins: number; reason: string; stepName?: string }) {
    return {
      delayId: `CDL-${Date.now().toString().slice(-5)}`,
      exceededMins: payload.exceededMins,
      reason: payload.reason,
      stepName: payload.stepName || "General Changeover Delay",
      loggedAt: new Date().toISOString(),
      sentTo: "Supervisor",
      message: `Changeover delay of +${payload.exceededMins} mins logged. Reason: ${payload.reason}. Sent to Supervisor.`,
    };
  }

  // ─── PLANT MANAGER COMMAND CENTER ───────────────────────────────────────────

  async getPlantManagerCommandCenter(tenantId: string, plantId?: string) {
    // 1. Transaction-Backed H/B Engine
    const hbSummary = {
      processing: {
        target: 12000,
        actual: 11850,
        variance: -150,
        recoveryPace: "+35 units/hr",
        eodProjection: 23800,
        status: "Recovering",
      },
      packaging: {
        target: 12000,
        actual: 12050,
        variance: 50,
        recoveryPace: "On Pace (0 Delta)",
        eodProjection: 24100,
        status: "Ahead",
      },
      total: {
        target: 24000,
        actual: 23900,
        netVariance: -100,
        shiftPacing: "99.6% Shift Pace",
        eodProjection: 23950,
        status: "On Track",
      },
    };

    // 2. 9 Operational Pillars
    const oeeCalc = calculateOEE({
      plannedProductionMinutes: 480,
      downtimeMinutes: 38,
      idealCycleTimeSeconds: 0.24,
      totalUnitsProduced: 24000,
      goodUnitsProduced: 23800,
    });

    const pillars = {
      hbPacing: { value: "23,900", unit: "/ 24,000 units", trend: "Delta: -100 units (99.6% pacing)", status: "positive" },
      oeeScore: { value: `${oeeCalc.overallOEEPercent}%`, unit: "Overall", trend: `A: ${oeeCalc.availabilityPercent}% • P: ${oeeCalc.performancePercent}% • Q: ${oeeCalc.qualityPercent}%`, status: "positive" },
      productionOutput: { value: "142,500", unit: "Bottles/Day", trend: "Line 1: 98.5% | Line 2: 94.2%", status: "positive" },
      qualityYield: { value: "99.2%", unit: "Pass Rate", trend: "0 active lot holds", status: "positive" },
      labourStaffing: { value: "100%", unit: "28 / 28 Present", trend: "Shift A: 0 Callouts", status: "positive" },
      maintenanceMtbf: { value: "240.0", unit: "hrs MTBF", trend: "1 Scheduled Maintenance", status: "positive" },
      materialStockHealth: { value: "98.1%", unit: "Availability", trend: "0 Stockout Alerts", status: "positive" },
      scheduleRecovery: { value: "+45 mins", unit: "Paced", trend: "Catch-up strategy activated", status: "positive" },
      riskRadar: { value: "Low / Guarded", unit: "Risk Level", trend: "0 P1 Stoppage Alarms", status: "positive" },
    };

    const hourlyLedger = [
      { hour: "06:00 - 07:00", target: 3000, actual: 3050, delta: "+50", status: "Ahead" },
      { hour: "07:00 - 08:00", target: 3000, actual: 3020, delta: "+20", status: "Ahead" },
      { hour: "08:00 - 09:00", target: 3000, actual: 2800, delta: "-200", status: "Behind (Micro-jam)" },
      { hour: "09:00 - 10:00", target: 3000, actual: 3100, delta: "+100", status: "Recovering" },
      { hour: "10:00 - 11:00", target: 3000, actual: 3050, delta: "+50", status: "On Target" },
      { hour: "11:00 - 12:00", target: 3000, actual: 2980, delta: "-20", status: "On Target" },
    ];

    return {
      plantCode: "INDORE-PLANT-01",
      plantStatus: "LIVE",
      hbSummary,
      pillars,
      hourlyLedger,
    };
  }

  // ─── Staffing & Roster Allocation ──────────────────────────────────────────
  async getStaffingRoster(tenantId: string) {
    return [
      { id: 1, name: "Elena Rostova", role: "Lead Operator", station: "Filler HMI", status: "Active", cert: "Aseptic Certified" },
      { id: 2, name: "Carlos Mendez", role: "Packer Operator", station: "End-of-Line Case Packer", status: "Active", cert: "Packaging Controls" },
      { id: 3, name: "Sarah Jenkins", role: "Sanitation Specialist", station: "CIP Station L1", status: "Active", cert: "Chemical Safety" },
      { id: 4, name: "David Kim", role: "Maintenance Technician", station: "Tool Bench L1", status: "On Standby", cert: "Electrical & High-Temp" }
    ];
  }

  async swapStaffingStations(tenantId: string, payload: { op1Id: number; op2Id: number }) {
    return {
      message: `Station assignment successfully swapped between operators #${payload.op1Id} and #${payload.op2Id}.`,
      op1Id: payload.op1Id,
      op2Id: payload.op2Id,
    };
  }

  async requestReliefOperator(tenantId: string, payload: { lineId?: string; reason?: string }) {
    return {
      message: `Relief operator request dispatched to Supervisor & Shift HR for Line 1 rotation.`,
      requestedAt: new Date().toISOString(),
      status: "DISPATCHED"
    };
  }

  async reassignOperatorStation(tenantId: string, id: string | number, payload: { newStation: string }) {
    return {
      message: `Operator #${id} station reassigned to ${payload.newStation}.`,
      operatorId: id,
      newStation: payload.newStation
    };
  }

  async requestOperatorReplacement(tenantId: string, id: string | number, payload: { reason?: string }) {
    return {
      message: `Replacement request generated for Operator #${id}. Shift Supervisor notified.`,
      operatorId: id,
      status: "PENDING_APPROVAL"
    };
  }

  // ─── Production Performance & Pace Analytics ──────────────────────────────
  async getProductionPerformance(tenantId: string) {
    return {
      orderNumber: "PO-2026-8801",
      productName: "500ml Organic Orange Juice",
      producedQuantity: 18950,
      targetQuantity: 24000,
      currentSpeedBPM: 580,
      targetSpeedBPM: 600,
      hoursLeft: 3.5,
      unit: "Bottles"
    };
  }

  async simulateRecoverySpeed(tenantId: string, payload: { remainingHours: number; targetOutput: number; actualProduced: number }) {
    const remaining = Math.max(0, (payload.targetOutput || 24000) - (payload.actualProduced || 18950));
    const calculatedBPM = Math.round(remaining / ((payload.remainingHours || 3.5) * 60)) || 0;
    return {
      remainingQuantity: remaining,
      simulatedHours: payload.remainingHours,
      requiredBPM: calculatedBPM,
      message: `Simulation calculated: ${calculatedBPM} BPM required for ${payload.remainingHours} hours remaining.`
    };
  }

  async applyTargetOverride(tenantId: string, payload: { orderNumber?: string; overrideTarget: number; calculatedRecoveryBPM: number; reason?: string }) {
    return {
      message: `Production target override of ${payload.overrideTarget?.toLocaleString()} applied. New recovery pace: ${payload.calculatedRecoveryBPM} BPM.`,
      overrideTarget: payload.overrideTarget,
      calculatedRecoveryBPM: payload.calculatedRecoveryBPM,
      reason: payload.reason || "Shift Downtime Catch-up",
      appliedAt: new Date().toISOString()
    };
  }

  async resetTargetOverride(tenantId: string, payload: { orderNumber?: string }) {
    return {
      message: "Target override reset to standard master schedule target of 24,000 units.",
      targetQuantity: 24000
    };
  }

  // ─── Schedule Recovery Management ──────────────────────────────────────────
  async getRecoveryStatus(tenantId: string) {
    return {
      deficitUnits: 1800,
      reason: "Plate heat exchanger breakdown downtime earlier.",
      countermeasures: [
        { id: 1, name: "Line Speed Optimization (600 BPM)", type: "Speed Increase", expectedRecovery: "+2,500 units", active: false },
        { id: 2, name: "Shift Extension Overtime (30 mins)", type: "Labor", expectedRecovery: "+3,000 units", active: false },
        { id: 3, name: "Auxiliary Packer Operator Reallocation", type: "Crew", expectedRecovery: "+1,500 units", active: false }
      ],
      logs: [
        { time: "11:15", countermeasure: "Nitrogen Flush Pressure Tune", status: "Active" }
      ]
    };
  }

  async activateCountermeasure(tenantId: string, id: string | number, payload: { name?: string }) {
    return {
      message: `Recovery countermeasure activated: ${payload.name || id}`,
      id,
      name: payload.name,
      activatedAt: new Date().toISOString()
    };
  }

  async submitRecoveryProposal(tenantId: string, payload: { lineId?: string }) {
    return {
      message: "Recovery plan package submitted to Supervisor's approval queue.",
      submittedAt: new Date().toISOString(),
      status: "SUBMITTED"
    };
  }

  // ─── Escalations Console (P1 Control Tower) ─────────────────────────────────
  async getEscalations(tenantId: string) {
    return [
      { id: "EXC-2026-174", severity: "P1", title: "Mechanical breakdown: High-Speed Rotary Filler 12-Head", owner: "Unassigned", details: "ewqd" },
      { id: "EXC-2026-081", severity: "P1", title: "Pasteurizer HTST-300 Unplanned Breakdown (Loop Pressure Loss)", owner: "David Kim (Thermal Tech)", details: "Line 2 halted. 1,200L blend buffer on QA hold. 5,000L order delayed." },
      { id: "EXC-2026-080", severity: "P1", title: "Pasteurization Thermal Excursion below Critical Control Limit (83.1°C)", owner: "Sarah Jenkins (QA Lead)", details: "CCP violation alarm triggered. Tank TK-04 quarantined under RED hold tag." }
    ];
  }

  async dispatchEscalation(tenantId: string, payload: { targetRole: string; subject: string; details: string }) {
    const id = `EXC-2026-${Math.floor(100 + Math.random() * 900)}`;
    return {
      id,
      severity: "P1",
      title: `Escalation to ${payload.targetRole}: ${payload.subject}`,
      owner: payload.targetRole,
      details: payload.details,
      message: `Critical Escalation #${id} dispatched to ${payload.targetRole}.`
    };
  }

  async attachEscalationEvidence(tenantId: string, id: string, payload: { evidenceNote: string }) {
    return {
      id,
      evidenceNote: payload.evidenceNote,
      message: `RCA 2.0 Evidence file attached to Escalation #${id}.`
    };
  }

  // ─── Line Lead Notifications ──────────────────────────────────────────────
  async getNotifications(tenantId: string) {
    return [
      { id: 1, type: "system", read: false, title: "Allergen Cleared Line 1", msg: "Sanitation check signed off by Quality QA.", time: "15 min ago" },
      { id: 2, type: "wo", read: false, title: "Maintenance dispatched", msg: "Technician David Kim assigned to work order WO-0888.", time: "45 min ago" },
      { id: 3, type: "material", read: false, title: "Low Stock Warning - Orange Caps", msg: "WMS inventory stock below safety limit threshold.", time: "2 hours ago" }
    ];
  }

  async markNotificationRead(tenantId: string, id: string | number) {
    return {
      message: `Notification #${id} marked as read.`,
      id,
      read: true
    };
  }

  async deleteNotification(tenantId: string, id: string | number) {
    return {
      message: `Notification #${id} deleted.`,
      id
    };
  }

  async markAllNotificationsRead(tenantId: string) {
    return {
      message: "All line lead notifications marked as read.",
      success: true
    };
  }

  async clearAllNotifications(tenantId: string) {
    return {
      message: "All line lead notifications cleared.",
      success: true
    };
  }

  // ─── Line Lead Profile ────────────────────────────────────────────────────
  async getUserProfile(tenantId: string) {
    return {
      id: "EMP-3092",
      name: "Elena Rostova",
      role: "Aseptic Line Lead",
      email: "elena.rostova@maintenx.internal",
      phone: "+1 (555) 234-9011",
      plant: "Plant 1 — Main Processing Facility",
      shift: "Shift A (06:00 - 14:00)",
      certifications: [
        { name: "Continuous Improvement Green Belt", desc: "Certified practitioner for process optimization.", level: "LSS Certified" },
        { name: "High-Speed Bottling Diagnostics v2.0", desc: "Advanced troubleshooting for bottling line 1.", level: "Advanced" },
        { name: "Shift Leadership & Communication", desc: "Completed cross-functional leadership training.", level: "Competent" }
      ]
    };
  }

  async updateUserProfile(tenantId: string, payload: any) {
    return {
      message: "User profile updated successfully.",
      profile: payload
    };
  }

  // ─── Operator Dashboard & HMI Console ──────────────────────────────────────
  async getOperatorDashboard(tenantId: string) {
    return {
      activeOrder: {
        id: "ORD-904",
        orderNumber: "ORD-904-ASEPTIC-JUICE",
        productCode: "SKU-AJ-500ML-ORG",
        productName: "Organic Cold-Pressed Orange Juice 500ml",
        status: "Completed",
        producedQuantity: 18950,
        targetQuantity: 24000,
        targetSpeedBPM: 600,
        currentSpeedBPM: 580,
        activeBatchId: "BAT-2026-0892",
        unit: "Bottles"
      },
      scadaTelemetry: {
        hbTarget: 36000,
        actualAttainment: 34800,
        vibration: 2.1,
        temperature: 62.4
      },
      qualityMaterial: {
        brix: "11.9 °BX (PASS)",
        ph: "3.72 pH (PASS)",
        lotId: "LOT-ORG-442"
      }
    };
  }

  async logOperatorMicroStop(tenantId: string, payload: { durationMins: number; reason: string }) {
    return {
      message: `Micro-stop of ${payload.durationMins || 3} mins logged (${payload.reason || "Sensor Misalignment"}). Recorded to H/B shift log.`,
      loggedAt: new Date().toISOString()
    };
  }

  async updateJobStatus(tenantId: string, jobId: string, payload: { status: string }) {
    return {
      message: `Job ${jobId} status updated to ${payload.status}.`,
      jobId,
      status: payload.status
    };
  }

  // ─── Operator My Jobs Queue ────────────────────────────────────────────────
  async getOperatorJobs(tenantId: string) {
    return [
      {
        id: "ORD-904",
        orderNumber: "ORD-904-ASEPTIC-JUICE",
        productName: "Organic Cold-Pressed Orange Juice 500ml",
        productCode: "SKU-AJ-500ML-ORG",
        status: "Completed",
        line: "Line 1 (Aseptic Bottling)",
        activeBatchId: "BAT-2026-0892",
        producedQuantity: 18950,
        targetQuantity: 24000,
        currentSpeedBPM: 580,
        targetSpeedBPM: 600,
        unit: "Bottles"
      },
      {
        id: "ORD-905",
        orderNumber: "ORD-905-FORMULATION-BLEND",
        productName: "Artisan Ginger-Lime Concentrate Batch 5000L",
        productCode: "SKU-BLK-SYRUP-1000L",
        status: "Completed",
        line: "Line 2 (Formulation & Blending)",
        activeBatchId: "BAT-2026-0890",
        producedQuantity: 1200,
        targetQuantity: 5000,
        currentSpeedBPM: 0,
        targetSpeedBPM: 1200,
        unit: "Liters"
      },
      {
        id: "ORD-906",
        orderNumber: "ORD-906-CAN-SPARKLING",
        productName: "Sparkling Yuzu Sparkling Tea 330ml Can",
        productCode: "SKU-CAN-330ML-LEMI",
        status: "Completed",
        line: "Line 3 (Canning Line)",
        activeBatchId: "BAT-2026-0885",
        producedQuantity: 36000,
        targetQuantity: 36000,
        currentSpeedBPM: 0,
        targetSpeedBPM: 750,
        unit: "Cans"
      }
    ];
  }

  async startOperatorJob(tenantId: string, jobId: string, payload: { assetId?: string; operatorPin?: string }) {
    return {
      message: `Job ${jobId} initiated on asset ${payload.assetId || "FM-001 High-Speed Filler"}. Line status: Running.`,
      jobId,
      status: "Running"
    };
  }

  async completeOperatorJob(tenantId: string, jobId: string) {
    return {
      message: `Job ${jobId} has been marked as Completed.`,
      jobId,
      status: "Completed"
    };
  }

  // ─── Operator Work Instructions & SOPs ─────────────────────────────────────
  async getWorkInstructions(tenantId: string) {
    return {
      activeOrderNumber: "ORD-904-ASEPTIC-JUICE",
      productName: "Organic Cold-Pressed Orange Juice 500ml",
      workInstructions: "SOP-PKG-042: High-Speed Aseptic Cold Fill & Nitrogen Flush Procedures v4.1",
      acknowledged: false
    };
  }

  async acknowledgeWorkInstructions(tenantId: string, payload: { sopId?: string }) {
    return {
      message: "SOP safety, PPE requirements, and CCP operational controls acknowledged.",
      acknowledgedAt: new Date().toISOString()
    };
  }

  // ─── Operator Production Entry & Output Logging ────────────────────────────
  async getProductionEntryStatus(tenantId: string) {
    return {
      activeOrderNumber: "ORD-904-ASEPTIC-JUICE",
      productName: "Organic Cold-Pressed Orange Juice 500ml",
      producedQuantity: 18450,
      targetQuantity: 24000,
      scrapQuantity: 210,
      reworkQuantity: 65,
      unit: "Bottles",
      recentLogs: [
        { id: "LOG-104", time: "11:00 AM", operator: "Alexander Vance", goodUnits: 500, scrapUnits: 10, runningTotal: 18450, notes: "Pallet #37 completed and stretch-wrapped" },
        { id: "LOG-103", time: "10:30 AM", operator: "Alexander Vance", goodUnits: 500, scrapUnits: 5, runningTotal: 17950, notes: "Routine hourly run log" }
      ]
    };
  }

  async submitProductionLog(tenantId: string, payload: { goodUnits: number; scrapUnits: number; reworkUnits: number }) {
    const logId = `LOG-${Math.floor(100 + Math.random() * 900)}`;
    return {
      logId,
      goodUnits: payload.goodUnits || 0,
      scrapUnits: payload.scrapUnits || 0,
      reworkUnits: payload.reworkUnits || 0,
      message: `Successfully logged +${payload.goodUnits || 0} bottles produced!`
    };
  }

  async logScrapDefect(tenantId: string, payload: { defectCode: string; scrapAdd: number; notes?: string }) {
    return {
      defectCode: payload.defectCode,
      scrapAdd: payload.scrapAdd,
      message: `Scrap reject of +${payload.scrapAdd} units logged under defect category: "${payload.defectCode}".`
    };
  }

  // ─── Operator Downtime & Loss ───────────────────────────────────────────────
  async getOperatorDowntime(tenantId: string) {
    return [
      { id: "BD-2026-081", assetId: "L1-206", assetName: "Krones Autocol Rotary Labeler", failureCategory: "MECHANICAL FAILURE", startTime: "2026-09-02 05:18" },
      { id: "BD-2026-080", assetId: "HT-105", assetName: "Plate Heat Exchanger & Pasteurizer HTST-300", failureCategory: "HYDRAULIC / PRESSURE LOSS", startTime: "2026-08-30 04:15" }
    ];
  }

  async logOperatorDowntimeEvent(tenantId: string, payload: { assetId: string; category: string; duration: number; symptom: string }) {
    const id = `BD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      id,
      assetId: payload.assetId,
      category: payload.category,
      duration: payload.duration,
      message: `Successfully reported downtime for asset #${payload.assetId || "FM-001"}. Asset marked as Out of Service.`
    };
  }

  async logOperatorDowntimeMicroStop(tenantId: string, payload: { microMins: number; microReason: string }) {
    return {
      message: `Micro-stop (${payload.microMins || 2} mins) logged: "${payload.microReason || "Conveyor Jam"}". Added to shift loss logs.`,
      loggedAt: new Date().toISOString()
    };
  }

  // ─── Operator Quality & CCP Checks ──────────────────────────────────────────
  async getOperatorQualityChecks(tenantId: string) {
    return [
      { time: "14:00", brix: "11.7 °Bx", ph: "3.71 pH", torque: "14 in-lbs", seal: "PASS" },
      { time: "13:30", brix: "11.8 °Bx", ph: "3.75 pH", torque: "15 in-lbs", seal: "PASS" },
      { time: "13:00", brix: "11.9 °Bx", ph: "3.72 pH", torque: "16 in-lbs", seal: "PASS" }
    ];
  }

  async submitQualityChecklist(tenantId: string, payload: { brix: string; ph: string; torque: string; sealPassed: boolean }) {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isPass = payload.sealPassed !== false;
    return {
      time: timeString,
      result: isPass ? "PASS" : "FAIL",
      message: isPass ? "Hourly quality parameter checklist logged successfully." : "Quality check failed limits! CCP Deviation Incident logged."
    };
  }

  async triggerQualityHold(tenantId: string, payload: { ccpParameter: string; holdReason: string }) {
    const ticketId = `HOLD-${Math.floor(100 + Math.random() * 900)}`;
    return {
      ticketId,
      ccpParameter: payload.ccpParameter,
      message: `CCP Deviation triggered: "${payload.ccpParameter || "General Deviation"}". Quality Hold Ticket #${ticketId} raised. Batch LOCKED.`
    };
  }

  // ─── Operator Material Requisition ─────────────────────────────────────────
  async getOperatorMaterialRequests(tenantId: string) {
    return [
      { id: "REQ-402", sku: "ING-1001 (Liquid Cane Sugar 67°Bx)", qty: 8500, priority: "Standard", status: "Delivered", time: "10:30" },
      { id: "REQ-403", sku: "PKG-2001 (28mm Tamper-Evident Closures)", qty: 15000, priority: "Urgent", status: "In Transit", time: "12:15" }
    ];
  }

  async callWarehouseRunner(tenantId: string, payload: { lineId?: string }) {
    return {
      message: "Urgent notification & pager ping sent to Warehouse Staging Kitting Runner.",
      calledAt: new Date().toISOString()
    };
  }

  async submitMaterialRequisition(tenantId: string, payload: { sku: string; qty: number; priority: string }) {
    const id = `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      id,
      sku: payload.sku,
      qty: payload.qty,
      priority: payload.priority,
      status: "Pending Dispatch",
      time,
      message: `Material request for ${payload.qty} units of SKU ${payload.sku} dispatched to WMS warehouse queue.`
    };
  }

  async confirmMaterialReceipt(tenantId: string, id: string) {
    return {
      id,
      status: "Delivered",
      message: `Confirmed receipt of materials for Request ${id}.`
    };
  }

  // ─── Operator Barcode & QR Scan ─────────────────────────────────────────────
  async parseBarcode(tenantId: string, payload: { code: string; type?: string }) {
    const code = payload.code || "LOT-ORG-442";
    const type = payload.type || (code.startsWith("PAL") ? "pallet" : code.startsWith("FM") ? "asset" : "lot");

    if (type === "lot" || code.startsWith("LOT")) {
      return {
        type: "Raw Material Lot",
        id: code,
        item: "Organic Orange Concentrate 1000L",
        supplier: "Valley Organic Farms Co.",
        expiryDate: "2026-12-15",
        qaStatus: "RELEASED",
        allergenFree: "Yes"
      };
    } else if (type === "pallet" || code.startsWith("PAL")) {
      return {
        type: "Finished Goods Pallet",
        id: code,
        item: "Organic Cold-Pressed Orange Juice 500ml",
        producedDate: "2026-08-31 08:30",
        quantity: "1,200 Bottles",
        qaStatus: "RELEASED",
        storageBin: "BIN-Z2-R14"
      };
    } else {
      return {
        type: "Maintenance Asset QR",
        id: code,
        item: "Aseptic Liquid Filler Station L1",
        lastPMDate: "2026-08-25",
        nextPMDueDate: "2026-09-25",
        safetyTagStatus: "SIGNED OFF",
        assetHealth: "94%"
      };
    }
  }

  async attachLotToBatch(tenantId: string, payload: { lotId: string; batchId: string }) {
    return {
      lotId: payload.lotId,
      batchId: payload.batchId,
      message: `Lot Tag ${payload.lotId || "LOT-ORG-442"} verified and attached to Active Batch ${payload.batchId || "BAT-2026-904"}. Traceability record updated.`
    };
  }

  // ─── Operator Report Issue & Safety Exception ──────────────────────────────
  async submitReportIssue(tenantId: string, payload: { issueType: string; assetId: string; severity: string; description: string }) {
    const ticketId = `EXC-${Math.floor(100 + Math.random() * 900)}`;
    return {
      ticketId,
      severity: payload.severity,
      message: `Critical ${payload.severity || "P1"} Exception Ticket #${ticketId} logged successfully.`
    };
  }

  async triggerEmergencyCall(tenantId: string, payload: { hazardType: string }) {
    return {
      hazardType: payload.hazardType,
      message: `EMERGENCY ALERT: Pager broadcast dispatched to Maintenance Tech Lead & Safety Officer for "${payload.hazardType || "Emergency Hazard"}".`
    };
  }

  // ─── Operator Shift Handoff ─────────────────────────────────────────────────
  async getShiftHandoffs(tenantId: string) {
    return [
      {
        id: "HO-991",
        shiftFrom: "Shift C (Night)",
        shiftTo: "Shift A (Day)",
        handedOverBy: "Carlos Mendez",
        receivedBy: "Elena Rostova",
        notes: "Line 1 running at 580 BPM. Clean In Place (CIP) passed at 04:30. Filler head #7 seal replaced.",
        status: "SIGNED OFF",
        timestamp: "2026-08-31 05:55"
      }
    ];
  }

  async submitShiftHandoff(tenantId: string, payload: { shiftFrom: string; shiftTo: string; receivedBy: string; notes: string; pin?: string }) {
    const id = `HO-${Math.floor(100 + Math.random() * 900)}`;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    return {
      id,
      shiftFrom: payload.shiftFrom,
      shiftTo: payload.shiftTo,
      handedOverBy: "Elena Rostova",
      receivedBy: payload.receivedBy,
      notes: payload.notes,
      status: "SIGNED OFF",
      timestamp,
      message: `Operator shift handoff signed and locked with PIN verification. Session transferred to ${payload.receivedBy}.`
    };
  }

  // ─── Operator Notifications ─────────────────────────────────────────────────
  async getOperatorNotifications(tenantId: string) {
    return [
      { id: 1, type: "system", read: false, title: "Allergen Cleared Line 1", msg: "Sanitation and allergen wipe-down release signed off by QA team.", time: "10 min ago", path: "/operator/dashboard" },
      { id: 2, type: "sop", read: false, title: "SOP Update v4.1", msg: "Aseptic Bottling packaging procedures updated. Acknowledgement required.", time: "1 hour ago", path: "/operator/work-instructions" },
      { id: 3, type: "pm", read: false, title: "PM checklist scheduled", msg: "Line 1 hourly inspection check due. Perform Brix and pH logs.", time: "2 hours ago", path: "/operator/quality-checks" }
    ];
  }

  async markOperatorNotificationRead(tenantId: string, id: number) {
    return { id, read: true, message: "Notification marked as read." };
  }

  async markAllOperatorNotificationsRead(tenantId: string) {
    return { message: "All notifications marked as read." };
  }

  async deleteOperatorNotification(tenantId: string, id: number) {
    return { id, message: "Notification deleted." };
  }

  async clearAllOperatorNotifications(tenantId: string) {
    return { message: "All notifications cleared." };
  }

  // ─── Operator Profile ────────────────────────────────────────────────────────
  async getOperatorProfile(tenantId: string) {
    return {
      name: "Elena Rostova",
      title: "Lead Line Operator",
      employeeId: "EMP-3092",
      email: "elena.rostova@maintenx.internal",
      phone: "+1 (555) 234-9011",
      plant: "Plant 1 — Main Processing Facility",
      shift: "Shift A (06:00 - 14:00)",
      certifications: [
        { name: "Aseptic Filler Calibration", desc: "Expert calibration and preventative maintenance.", level: "Expert", variant: "emerald" },
        { name: "Allergen Control Protocol", desc: "Completed critical safety and sanitation compliance.", level: "Certified", variant: "emerald" },
        { name: "Raw Product Recipe Formulation", desc: "Advanced training in recipe changeovers.", level: "Advanced", variant: "cyan" },
        { name: "SCADA HMI Line Diagnostics", desc: "Competent at level 1 equipment troubleshooting.", level: "Competent", variant: "cyan" }
      ]
    };
  }

  async updateOperatorProfile(tenantId: string, payload: { email: string; phone: string; plant: string; shift: string }) {
    return {
      ...payload,
      message: "Profile updated successfully."
    };
  }

  // ─── Operations Supervisor Command Center ──────────────────────────────────
  async authorizeSupervisorShift(tenantId: string, payload: { shiftName: string }) {
    return {
      shiftName: payload.shiftName,
      message: `Shift Authorized successfully: ${payload.shiftName || "Shift A"}. All lines linked.`
    };
  }

  // ─── Operations Supervisor Department Run Schedule ─────────────────────────
  async getSupervisorDeptSchedule(tenantId: string) {
    return [
      { id: "SCH-1", line: "Line 1 (Aseptic Bottling)", order: "ORD-904", target: "24,000 Bottles", shift: "Shift A (Day)", status: "Running" },
      { id: "SCH-2", line: "Line 2 (Formulation & Blending)", order: "ORD-905", target: "5,000 Liters", shift: "Shift A (Day)", status: "Paused" },
      { id: "SCH-3", line: "Line 3 (Bulk Filling)", order: "ORD-906", target: "10,000 Liters", shift: "Shift B (Evening)", status: "Scheduled" }
    ];
  }

  async resequenceSupervisorDeptSchedule(tenantId: string) {
    return {
      message: "APS Re-sequence request dispatched to Master Production Schedule planner engine."
    };
  }

  async authorizeSupervisorDeptSchedule(tenantId: string, id: string) {
    return {
      id,
      status: "Authorized",
      message: `Schedule run ${id} authorized for execution.`
    };
  }

  async pauseSupervisorDeptSchedule(tenantId: string, id: string) {
    return {
      id,
      status: "Paused",
      message: `Schedule run ${id} paused by Supervisor.`
    };
  }

  async resumeSupervisorDeptSchedule(tenantId: string, id: string) {
    return {
      id,
      status: "Running",
      message: `Schedule run ${id} resumed to active running state.`
    };
  }

  // ─── Operations Supervisor Workforce / Employee List ───────────────────────
  async getSupervisorWorkforce(tenantId: string) {
    return []; // Returns empty array to let frontend default to INITIAL_EMPLOYEES if needed or fallback cleanly
  }

  async addSupervisorWorkforceEmployee(tenantId: string, payload: any) {
    return {
      ...payload,
      message: `Employee ${payload.name || payload.id} registered into factory workforce.`
    };
  }

  async updateSupervisorWorkforceEmployee(tenantId: string, id: string, payload: any) {
    return {
      id,
      ...payload,
      message: `Employee ${payload.name || id} updated successfully.`
    };
  }

  async assignSupervisorWorkforceSkill(tenantId: string, id: string, payload: { skillName: string; skillCategory: string; skillLevel: string }) {
    return {
      id,
      ...payload,
      message: `Skill "${payload.skillName}" (${payload.skillLevel}) assigned successfully.`
    };
  }

  async assignSupervisorWorkforceTraining(tenantId: string, id: string, payload: { trainingProgram: string; trainingType: string; trainer: string; targetDate: string }) {
    return {
      id,
      ...payload,
      message: `Enrolled employee in "${payload.trainingProgram}". Target: ${payload.targetDate}.`
    };
  }

  // ─── Operations Supervisor Labour Time & Allocations ───────────────────────
  async getSupervisorLabourTime(tenantId: string) {
    return {
      plannedLabour: 48,
      actualLabour: 46,
      availableLabour: 45,
      labourUtilization: 95.8,
      labourProductivity: 154,
      labourProductivityTrend: "+3.2%",
      labourProductivityTarget: "150",
      labourAllocationDirect: 88.5,
      labourAllocationIndirect: 11.5,
      lines: [
        { line: "Line 1 — High-Speed Aseptic Bottling", department: "Packaging", planned: 14, actual: 14, available: 14, utilization: "98.2%", productivity: 164, lead: "Elena Rostova", status: "Optimal" },
        { line: "Line 2 — Formulation, Batching & CIP", department: "Processing", planned: 10, actual: 10, available: 10, utilization: "96.4%", productivity: 148, lead: "Sarah Jenkins", status: "Optimal" },
        { line: "Line 3 — Canning & Seaming Automation", department: "Packaging", planned: 12, actual: 11, available: 11, utilization: "93.0%", productivity: 152, lead: "David Kim", status: "Understaffed (-1)" },
        { line: "Line 4 — Case Packing & Palletizing", department: "Warehouse", planned: 8, actual: 7, available: 7, utilization: "94.1%", productivity: 142, lead: "Carlos Mendez", status: "Understaffed (-1)" },
        { line: "QA In-Line Lab & Sanitation", department: "Quality Assurance", planned: 4, actual: 4, available: 4, utilization: "99.0%", productivity: 168, lead: "Thomas Sterling", status: "Optimal" }
      ],
      shifts: [
        { shift: "Shift A (Day)", planned: 20, actual: 20, available: 20, utilization: "97.8%", productivity: 158, status: "Full Coverage" },
        { shift: "Shift B (Evening)", planned: 16, actual: 15, available: 15, utilization: "94.6%", productivity: 151, status: "Minor Deficit (-1)" },
        { shift: "Shift C (Night)", planned: 12, actual: 11, available: 11, utilization: "93.0%", productivity: 148, status: "Minor Deficit (-1)" }
      ]
    };
  }

  async authorizeSupervisorOvertime(tenantId: string, payload?: any) {
    return {
      success: true,
      message: "Shift Overtime authorized (+2.0 hrs) for Line 3 canning crew."
    };
  }

  async rebalanceSupervisorCrew(tenantId: string, payload: { fromLine: string; toLine: string; operatorsCount: number }) {
    const fromLineShort = (payload.fromLine || "").split("—")[0].trim();
    const toLineShort = (payload.toLine || "").split("—")[0].trim();
    return {
      ...payload,
      message: `Rebalanced ${payload.operatorsCount || 1} operator(s) from "${fromLineShort}" to "${toLineShort}".`
    };
  }

  // ─── Operations Supervisor Live H/B Management ─────────────────────────────
  async getSupervisorLiveHB(tenantId: string) {
    return [
      { id: "HB-01", hour: "06:00 - 07:00", shift: "Shift A (Day)", line: "Line 1 — Bottling", department: "Packaging", plannedHB: 14, actualHB: 14, requiredHB: 14, availableHB: 14, shortage: 0, status: "Full Coverage", operatorNotes: "Nominal start of shift." },
      { id: "HB-02", hour: "07:00 - 08:00", shift: "Shift A (Day)", line: "Line 1 — Bottling", department: "Packaging", plannedHB: 14, actualHB: 14, requiredHB: 14, availableHB: 14, shortage: 0, status: "Full Coverage", operatorNotes: "Pacing at 102% efficiency." },
      { id: "HB-03", hour: "08:00 - 09:00", shift: "Shift A (Day)", line: "Line 1 — Bottling", department: "Packaging", plannedHB: 14, actualHB: 13, requiredHB: 14, availableHB: 13, shortage: -1, status: "Shortage (-1)", operatorNotes: "1 operator call-in sick." },
      { id: "HB-04", hour: "09:00 - 10:00", shift: "Shift A (Day)", line: "Line 1 — Bottling", department: "Packaging", plannedHB: 14, actualHB: 14, requiredHB: 14, availableHB: 14, shortage: 0, status: "Full Coverage", operatorNotes: "Float operator assigned." },
      { id: "HB-05", hour: "06:00 - 07:00", shift: "Shift A (Day)", line: "Line 2 — Formulation", department: "Processing", plannedHB: 10, actualHB: 10, requiredHB: 10, availableHB: 10, shortage: 0, status: "Full Coverage", operatorNotes: "Batching cycle running smooth." },
      { id: "HB-06", hour: "07:00 - 08:00", shift: "Shift A (Day)", line: "Line 2 — Formulation", department: "Processing", plannedHB: 10, actualHB: 9, requiredHB: 10, availableHB: 9, shortage: -1, status: "Shortage (-1)", operatorNotes: "CIP sanitation relief short 1 tech." },
      { id: "HB-07", hour: "06:00 - 07:00", shift: "Shift A (Day)", line: "Line 3 — Canning", department: "Packaging", plannedHB: 12, actualHB: 11, requiredHB: 12, availableHB: 11, shortage: -1, status: "Shortage (-1)", operatorNotes: "Seamer operator on medical break." },
      { id: "HB-08", hour: "07:00 - 08:00", shift: "Shift A (Day)", line: "Line 3 — Canning", department: "Packaging", plannedHB: 12, actualHB: 12, requiredHB: 12, availableHB: 12, shortage: 0, status: "Full Coverage", operatorNotes: "Relief operator active." }
    ];
  }

  async logSupervisorHB(tenantId: string, payload: any) {
    const id = `HB-0${Math.floor(10 + Math.random() * 90)}`;
    return {
      id,
      ...payload,
      message: `H/B record for ${payload.hour || "interval"} logged for ${payload.line || "line"}.`
    };
  }

  async dispatchSupervisorHBBackup(tenantId: string, payload: { pool: string; assignedCount: number; targetLine: string; recordId?: string }) {
    return {
      ...payload,
      message: `Dispatched ${payload.assignedCount || 1} backup operator from ${payload.pool || "pool"} to ${payload.targetLine || "line"}. Shortage resolved!`
    };
  }

  // ─── Operations Supervisor Skills & Qualification Matrix ────────────────────
  async getSupervisorSkills(tenantId: string) {
    return [
      { id: "SKL-01", skillName: "Aseptic Filling Machine Operation", skillCategory: "Machine Operation", employee: "Elena Rostova", employeeId: "EMP-101", skillLevel: "Expert", certification: "ISO 22000 Lead Tech", expiry: "2027-08-15", status: "Active" },
      { id: "SKL-02", skillName: "Automated Case Packer Operation", skillCategory: "Packaging", employee: "Carlos Mendez", employeeId: "EMP-102", skillLevel: "Intermediate", certification: "Packer Level 2", expiry: "2026-11-20", status: "Active" },
      { id: "SKL-03", skillName: "CIP & Allergen Wash Validation", skillCategory: "Quality / Sanitation", employee: "Sarah Jenkins", employeeId: "EMP-103", skillLevel: "Advanced", certification: "SQF Practitioner", expiry: "2027-04-12", status: "Active" },
      { id: "SKL-04", skillName: "Thermal Pasteurization Controls", skillCategory: "Processing", employee: "David Kim", employeeId: "EMP-104", skillLevel: "Intermediate", certification: "DPA Universal Tech", expiry: "2026-10-30", status: "Pending Re-Test" },
      { id: "SKL-05", skillName: "Fanuc High-Speed Robotic Arm", skillCategory: "Machine Operation", employee: "Liam Chen", employeeId: "EMP-105", skillLevel: "Expert", certification: "Fanuc Robotics Cert", expiry: "2027-05-18", status: "Active" },
      { id: "SKL-06", skillName: "High Voltage Electrical LOTO Safety", skillCategory: "Maintenance Safety", employee: "Marcus Vance", employeeId: "EMP-106", skillLevel: "Expert", certification: "NFPA 70E Arc Flash", expiry: "2027-09-01", status: "Active" },
      { id: "SKL-07", skillName: "Mixing Vessel Recipe Batching", skillCategory: "Processing", employee: "Amara Okafor", employeeId: "EMP-107", skillLevel: "Beginner", certification: "GMP Food Safety L1", expiry: "2026-12-15", status: "Active" }
    ];
  }

  async addSupervisorSkill(tenantId: string, payload: any) {
    const id = `SKL-0${Math.floor(10 + Math.random() * 90)}`;
    return {
      id,
      ...payload,
      message: `Skill "${payload.skillName}" (${payload.skillLevel}) added for ${payload.employee}.`
    };
  }

  async updateSupervisorSkillLevel(tenantId: string, id: string, payload: any) {
    return {
      id,
      ...payload,
      message: `Skill competency level for ${payload.employee || id} updated to ${payload.skillLevel || "new level"}.`
    };
  }

  // ─── Operations Supervisor Training & Certifications ───────────────────────
  async getSupervisorTraining(tenantId: string) {
    return [
      { id: "TRN-01", trainingProgram: "High-Speed Aseptic Sterilization & CIP Re-Certification", employee: "Carlos Mendez", employeeId: "EMP-106", trainingType: "Technical Qualification", completionDate: "2026-08-10", expiryDate: "2027-08-10", trainer: "Marcus Vance", status: "Completed", certification: "HACCP Safety L2 (CERT-2026-881)" },
      { id: "TRN-02", trainingProgram: "Arc Flash & Electrical Safety NFPA 70E", employee: "David Kim", employeeId: "EMP-104", trainingType: "Mandatory Safety", completionDate: "2025-09-15", expiryDate: "2026-09-15", trainer: "Marcus Vance", status: "Expired", certification: "NFPA 70E Arc Flash (CERT-2025-102)" },
      { id: "TRN-03", trainingProgram: "Automated Fanuc Robotic Palletizer Maintenance", employee: "Amara Okafor", employeeId: "EMP-107", trainingType: "Technical Qualification", completionDate: "Pending", expiryDate: "2027-02-01", trainer: "Liam Chen", status: "In Progress", certification: "Pending Exam Sign-Off" },
      { id: "TRN-04", trainingProgram: "Annual GMP, Hygiene & Allergen Cross-Contact Prevention", employee: "Elena Rostova", employeeId: "EMP-101", trainingType: "SOP Refresh", completionDate: "2026-05-20", expiryDate: "2027-05-20", trainer: "Sarah Jenkins", status: "Completed", certification: "GMP Master Hygiene (CERT-2026-440)" },
      { id: "TRN-05", trainingProgram: "Chemical Handling & Emergency Spill Response", employee: "Thomas Sterling", employeeId: "EMP-105", trainingType: "Mandatory Safety", completionDate: "Pending", expiryDate: "2026-12-30", trainer: "External Auditor (SafetyPro)", status: "Not Started", certification: "OSHA HAZMAT L1 (Scheduled)" }
    ];
  }

  async addSupervisorTraining(tenantId: string, payload: any) {
    const id = `TRN-0${Math.floor(10 + Math.random() * 90)}`;
    return {
      id,
      ...payload,
      message: `Enrolled ${payload.employee || "employee"} into "${payload.trainingProgram || "training program"}".`
    };
  }

  async completeSupervisorTraining(tenantId: string, id: string, payload: any) {
    return {
      id,
      ...payload,
      status: "Completed",
      message: `Training for ${payload.employee || id} marked Completed. Certificate ${payload.certificationNumber || "issued"}.`
    };
  }

  // ─── Operations Supervisor Labour Productivity ──────────────────────────────
  async getSupervisorProductivity(tenantId: string) {
    return {
      overallUnitsPerHour: 154,
      targetUnitsPerHour: 145,
      averageProductivity: "98.4%",
      labourUtilization: "95.8%",
      hoursWorkedMTD: 2840,
      grossFactoryOutput: 437360,
      byLine: [
        { line: "Line 1 — High-Speed Bottling", unitsPerHr: 164, variance: "+13.1%" },
        { line: "Line 2 — Formulation & CIP", unitsPerHr: 146, variance: "+0.7%" },
        { line: "Line 3 — Canning & Seaming", unitsPerHr: 152, variance: "+4.8%" }
      ],
      byShift: [
        { shift: "Shift A (Day)", outputUnits: 198480, hoursWorked: 1255, efficiency: "97.8%", pacingVsTarget: "+8.9%" },
        { shift: "Shift B (Evening)", outputUnits: 145280, hoursWorked: 968, efficiency: "95.4%", pacingVsTarget: "+4.1%" },
        { shift: "Shift C (Night)", outputUnits: 93768, hoursWorked: 625, efficiency: "94.2%", pacingVsTarget: "+3.4%" }
      ]
    };
  }

  // ─── Operations Supervisor Shift Management & Rostering ────────────────────
  async getSupervisorStaffing(tenantId: string) {
    return [
      { id: "SHF-01", shiftName: "Shift A — Day Production", shiftTiming: "06:00 - 14:30", date: "2026-09-05", line: "Line 1 — High-Speed Bottling", supervisor: "Thomas Sterling", operators: ["Elena Rostova", "Carlos Mendez"], plannedHeadcount: 14, actualHeadcount: 14, shiftStatus: "In Progress" },
      { id: "SHF-02", shiftName: "Shift B — Evening Formulation", shiftTiming: "14:30 - 22:30", date: "2026-09-05", line: "Line 2 — Formulation & CIP", supervisor: "Alexander Vance", operators: ["David Kim", "Amara Okafor"], plannedHeadcount: 10, actualHeadcount: 10, shiftStatus: "Scheduled" },
      { id: "SHF-03", shiftName: "Shift C — Night Canning", shiftTiming: "22:30 - 06:30", date: "2026-09-05", line: "Line 3 — Canning Automation", supervisor: "Liam Chen", operators: ["Liam Chen", "Carlos Mendez"], plannedHeadcount: 12, actualHeadcount: 11, shiftStatus: "Scheduled" },
      { id: "SHF-04", shiftName: "Shift A — Day Sanitation & Lab", shiftTiming: "06:00 - 14:30", date: "2026-09-04", line: "QA In-Line Lab & Sanitation", supervisor: "Thomas Sterling", operators: ["Sarah Jenkins", "Elena Rostova"], plannedHeadcount: 4, actualHeadcount: 4, shiftStatus: "Closed" }
    ];
  }

  async addSupervisorStaffing(tenantId: string, payload: any) {
    const id = `SHF-0${Math.floor(10 + Math.random() * 90)}`;
    return {
      id,
      ...payload,
      message: `Shift "${payload.shiftName}" scheduled for ${payload.date}.`
    };
  }

  async updateSupervisorStaffing(tenantId: string, id: string, payload: any) {
    return {
      id,
      ...payload,
      message: `Shift details for ${payload.shiftName || id} updated.`
    };
  }

  async assignSupervisorStaffingPersonnel(tenantId: string, id: string, payload: { employeeName: string }) {
    return {
      id,
      ...payload,
      message: `Assigned ${payload.employeeName} to shift.`
    };
  }

  async assignSupervisorStaffingStation(tenantId: string, id: string, payload: { operator: string; station: string }) {
    return {
      id,
      ...payload,
      message: `Operator ${payload.operator} assigned to station "${payload.station}".`
    };
  }

  async closeSupervisorStaffingShift(tenantId: string, id: string, payload: { notes?: string }) {
    return {
      id,
      ...payload,
      shiftStatus: "Closed",
      message: `Shift #${id} closed out successfully. Sign-off recorded.`
    };
  }

  // ─── Operations Supervisor Production Performance ──────────────────────────
  async setSupervisorProductionSpeedLimit(tenantId: string, payload: { speedLimit: number; line?: string }) {
    return {
      ...payload,
      message: `Line speed cap set to ${payload.speedLimit || 600} BPM for ${payload.line || "Line 1"}.`
    };
  }

  async getSupervisorDowntimePareto(tenantId: string) {
    return [
      { rank: 1, driver: "Mechanical Capper Motor Overheat", minutes: 45, lossPercentage: "48%" },
      { rank: 2, driver: "CIP Wash Sanitation Cycle", minutes: 25, lossPercentage: "27%" },
      { rank: 3, driver: "Labeler Roll Changeover", minutes: 15, lossPercentage: "16%" },
      { rank: 4, driver: "Minor Micro-Stops & Jams", minutes: 8, lossPercentage: "9%" }
    ];
  }

  // ─── Operations Supervisor Quality Quarantine Holds ─────────────────────────
  async getSupervisorHolds(tenantId: string) {
    return [
      { id: "HLD-102", batch: "BAT-2026-0890", reason: "Pasteurizer thermal excursion < 83.1°C", status: "Active Hold" },
      { id: "HLD-103", batch: "BAT-2026-0892", reason: "Brix concentration limit exceeded (12.4)", status: "Active Hold" }
    ];
  }

  async addSupervisorHoldNote(tenantId: string, id: string, payload: { noteText: string }) {
    return {
      id,
      ...payload,
      message: `QA Investigation remark attached to Hold #${id}.`
    };
  }

  async requestSupervisorHoldRework(tenantId: string, id: string, payload: { pin: string; batch?: string }) {
    return {
      id,
      ...payload,
      message: `Batch ${payload.batch || id} authorized for Rework Loop (PIN Verified).`
    };
  }

  async authorizeSupervisorHoldRelease(tenantId: string, id: string, payload: { pin: string; batch?: string }) {
    return {
      id,
      ...payload,
      message: `Batch ${payload.batch || id} released from Quality Hold (PIN Verified). Inventory gate UNLOCKED.`
    };
  }

  async scrapSupervisorHoldBatch(tenantId: string, id: string) {
    return {
      id,
      message: `Hold #${id} marked as SCRAPPED. Operations inventory adjusted.`
    };
  }

  // ─── Operations Supervisor Departmental Recovery Steering ─────────────────
  async getSupervisorRecoveryCountermeasures(tenantId: string) {
    return [
      { id: 1, name: "Reallocate Line 2 Operator to Line 1 Packer station", type: "Crew Allocation", impact: "+1,800 Bottles", active: false },
      { id: 2, name: "Authorize Line Speed Overclock to 620 BPM", type: "Speed Tune", impact: "+3,500 Bottles", active: false },
      { id: 3, name: "30-Minute Shift Extension Overtime", type: "Overtime Extension", impact: "+3,000 Bottles", active: false }
    ];
  }

  async authorizeSupervisorRecoveryCountermeasure(tenantId: string, id: string | number) {
    return {
      id,
      active: true,
      message: `Supervisor authorized countermeasure #${id}.`
    };
  }

  async authorizeAllSupervisorRecoveryCountermeasures(tenantId: string) {
    return {
      success: true,
      message: "All shift recovery countermeasures authorized for Line Lead execution."
    };
  }

  // ─── Operations Supervisor Pending Shift Approvals ─────────────────────────
  async getSupervisorApprovals(tenantId: string) {
    return [
      { id: "APP-901", type: "Sanitation Release", details: "Line 1 cleaning checklist signed off by operator. Requires supervisor sign-off.", status: "Pending" },
      { id: "APP-902", type: "Material Hold Release", details: "Rework request for batch BAT-2026-0890. Brix concentration deviation corrected.", status: "Pending" },
      { id: "APP-903", type: "PM Audit Verification", details: "Hourly calibration check audit signature required for Pasteurizer HTST-300.", status: "Pending" },
      { id: "APP-904", type: "Line Speed-Up Proposal", details: "Line Lead Elena Rostova requested speed boost from 580 BPM to 620 BPM to catch up 300 bottles deficit.", status: "Pending" }
    ];
  }

  async approveSupervisorApproval(tenantId: string, id: string, payload?: any) {
    return {
      id,
      status: payload?.proposedSpeed ? `Approved (${payload.proposedSpeed} BPM Authorized)` : "Approved",
      message: payload?.proposedSpeed ? `Line Speedup Authorized to ${payload.proposedSpeed} BPM.` : `Approval Request ${id} has been Authorized.`
    };
  }

  async rejectSupervisorApproval(tenantId: string, id: string) {
    return {
      id,
      status: "Rejected",
      message: `Approval Request ${id} has been Rejected.`
    };
  }

  async clarifySupervisorApproval(tenantId: string, id: string) {
    return {
      id,
      status: "Returned for Clarification",
      message: `Request ${id} returned to Line Lead for technical clarification.`
    };
  }

  async bulkApproveSupervisorApprovals(tenantId: string) {
    return {
      success: true,
      message: "All pending shift approval requests bulk-authorized."
    };
  }

  // ─── Operations Supervisor Reports ─────────────────────────────────────────
  async getSupervisorReportsList(tenantId: string) {
    return [
      { id: "SUP-01", name: "Shift A Production OEE Summary", category: "Operations", date: "2026-08-31", cadence: "Daily (End of Shift)", format: "PDF / Dashboard" },
      { id: "SUP-02", name: "Allergen Sanitation Clean Log", category: "Sanitation", date: "2026-08-31", cadence: "Daily", format: "PDF / Audit Log" },
      { id: "SUP-03", name: "CCP Parameter Compliance Audit", category: "Quality Compliance", date: "2026-08-30", cadence: "Weekly", format: "PDF / Compliance Form" }
    ];
  }

  // ─── Operations Supervisor Notifications ───────────────────────────────────
  async getSupervisorNotificationsList(tenantId: string) {
    return [
      { id: 1, type: "system", read: false, title: "Pending PM Audit", msg: "Sanitation check signed off by operator. Requires supervisor sign-off.", time: "10 min ago", path: "/supervisor/approvals" },
      { id: 2, type: "exception", read: false, title: "P1 Exception Escalated", msg: "Line 2 Formulation HTST temperature loop sensor failed.", time: "30 min ago", path: "/supervisor/exceptions" }
    ];
  }

  async markSupervisorNotificationRead(tenantId: string, id: string | number) {
    return {
      id,
      read: true,
      message: "Notification marked as read."
    };
  }

  async deleteSupervisorNotification(tenantId: string, id: string | number) {
    return {
      id,
      message: "Notification deleted."
    };
  }

  async markAllSupervisorNotificationsRead(tenantId: string) {
    return {
      success: true,
      message: "All notifications marked as read."
    };
  }

  async clearAllSupervisorNotifications(tenantId: string) {
    return {
      success: true,
      message: "All notifications cleared."
    };
  }

  // ─── Supervisor Profile ───────────────────────────────────────────────────
  async getSupervisorProfile(tenantId: string) {
    return {
      name: "Thomas Sterling",
      title: "Operations Shift Supervisor",
      employeeId: "EMP-1104",
      email: "thomas.sterling@maintenx.internal",
      phone: "+1 (555) 774-2993",
      plant: "Plant 1 — Main Processing Facility",
      shift: "Shift A (06:00 - 14:00)",
      certifications: [
        { name: "Operations Safety Sign-Off Authority", desc: "Authorized to override and clear safety lockouts.", level: "Level 3", variant: "emerald" },
        { name: "High-Speed Bottling Diagnostics", desc: "Master-level mechanical diagnostics and troubleshooting.", level: "Advanced", variant: "emerald" }
      ]
    };
  }

  async updateSupervisorProfile(tenantId: string, payload: { email?: string; phone?: string; plant?: string; shift?: string }) {
    return {
      ...payload,
      message: "Supervisor profile updated successfully."
    };
  }
}

export const dashboardsService = new DashboardsService();




