import { pool } from "../../config/database.js";

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
  lineId?: string | null;
  assetId?: string | null;
  sourceProjectId?: string | null;
  sourceRcaId?: string | null;
  owner: string;
  status: string;
  effectiveDate: string;
  reviewDate: string;
  approvedBy: string;
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

export class CIService {
  // ============================================================================
  // 1. DASHBOARD SUMMARY
  // ============================================================================
  async getDashboardSummary(plantId?: string) {
    const isPlantFilter = plantId && plantId !== "ALL";
    const plantClause = isPlantFilter ? "WHERE plant_id = $1" : "";
    const params = isPlantFilter ? [plantId] : [];

    // Projects savings
    const projRes = await pool.query(
      `SELECT 
        COALESCE(SUM(projected_savings_annual), 0) AS projected_total,
        COALESCE(SUM(realized_savings_ytd), 0) AS realized_total,
        COUNT(*) AS total_projects,
        COUNT(CASE WHEN status = 'Completed' OR benefit_status = 'Verified & Locked' THEN 1 END) AS completed_projects
      FROM ci_projects ${plantClause}`,
      params
    );

    // RCA investigations
    const rcaRes = await pool.query(
      `SELECT 
        COUNT(*) AS total_rca,
        COUNT(CASE WHEN status = 'Open' OR status = 'In Progress' THEN 1 END) AS open_rca,
        COUNT(CASE WHEN status = 'Root Cause Validated' THEN 1 END) AS validated_rca,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) AS closed_rca
      FROM ci_rca_investigations ${plantClause}`,
      params
    );

    // Reliability & Bad Actors
    const relRes = await pool.query(
      `SELECT 
        COUNT(*) AS total_assets,
        COUNT(CASE WHEN is_bad_actor = true THEN 1 END) AS bad_actors_count,
        COALESCE(AVG(mtbf_hrs), 0) AS avg_mtbf,
        COALESCE(AVG(mttr_min), 0) AS avg_mttr
      FROM ci_reliability_records ${plantClause}`,
      params
    );

    // Losses
    const lossRes = await pool.query(
      `SELECT 
        COALESCE(SUM(hours_lost), 0) AS total_hours_lost,
        COALESCE(SUM(financial_impact_usd), 0) AS total_loss_usd
      FROM ci_losses ${plantClause}`,
      params
    );

    // CAPA actions
    const capaRes = await pool.query(
      `SELECT 
        COUNT(*) AS total_capa,
        COUNT(CASE WHEN status = 'Open' OR status = 'In Progress' THEN 1 END) AS pending_capa,
        COUNT(CASE WHEN status = 'Verified' THEN 1 END) AS verified_capa
      FROM ci_capa_actions`
    );

    const proj = projRes.rows[0];
    const rca = rcaRes.rows[0];
    const rel = relRes.rows[0];
    const loss = lossRes.rows[0];
    const capa = capaRes.rows[0];

    return {
      financials: {
        projectedSavings: Number(proj.projected_total),
        realizedSavings: Number(proj.realized_total),
        totalLossUSD: Number(loss.total_loss_usd),
        totalHoursLost: Number(loss.total_hours_lost),
      },
      reliability: {
        badActorsCount: Number(rel.bad_actors_count),
        avgMtbfHrs: Math.round(Number(rel.avg_mtbf)),
        avgMttrMin: Math.round(Number(rel.avg_mttr)),
      },
      rca: {
        totalRCA: Number(rca.total_rca),
        openRCA: Number(rca.open_rca),
        validatedRCA: Number(rca.validated_rca),
        closedRCA: Number(rca.closed_rca),
      },
      projects: {
        total: Number(proj.total_projects),
        completed: Number(proj.completed_projects),
      },
      capa: {
        total: Number(capa.total_capa),
        pending: Number(capa.pending_capa),
        verified: Number(capa.verified_capa),
      },
    };
  }

  // ============================================================================
  // 2. RCA INVESTIGATIONS
  // ============================================================================
  private mapInvestigation(r: any): RCAInvestigationEntity {
    return {
      id: r.id,
      plantId: r.plant_id,
      title: r.title,
      assetId: r.asset_id,
      assetName: r.asset_name,
      lineId: r.line_id,
      lineName: r.line_name,
      sourceBreakdownId: r.source_breakdown_id,
      sourceWorkOrderId: r.source_work_order_id,
      severity: r.severity,
      status: r.status,
      currentPhase: r.current_phase,
      problemStatement: r.problem_statement,
      leadInvestigator: r.lead_investigator,
      teamMembers: typeof r.team_members === "string" ? JSON.parse(r.team_members) : (r.team_members || []),
      eventDate: r.event_date,
      daysActive: Number(r.days_active || 0),
      whyTree: typeof r.why_tree === "string" ? JSON.parse(r.why_tree) : (r.why_tree || []),
      eightD: typeof r.eight_d === "string" ? JSON.parse(r.eight_d) : (r.eight_d || {}),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  async listInvestigations(plantId?: string): Promise<RCAInvestigationEntity[]> {
    let query = "SELECT * FROM ci_rca_investigations";
    const params: any[] = [];
    if (plantId && plantId !== "ALL") {
      query += " WHERE plant_id = $1";
      params.push(plantId);
    }
    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapInvestigation);
  }

  async getInvestigation(id: string): Promise<RCAInvestigationEntity | undefined> {
    const res = await pool.query("SELECT * FROM ci_rca_investigations WHERE id = $1", [id]);
    if (res.rows.length === 0) return undefined;
    return this.mapInvestigation(res.rows[0]);
  }

  async createInvestigation(data: Partial<RCAInvestigationEntity>, userName?: string): Promise<RCAInvestigationEntity> {
    const nextSeqRes = await pool.query("SELECT COUNT(*) FROM ci_rca_investigations");
    const count = Number(nextSeqRes.rows[0].count) + 1;
    const year = new Date().getFullYear();
    const newId = data.id || `RCA-${year}-${String(count).padStart(3, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_rca_investigations (
        id, plant_id, title, asset_id, asset_name, line_id, line_name,
        source_breakdown_id, source_work_order_id, severity, status,
        current_phase, problem_statement, lead_investigator, team_members,
        event_date, days_active, why_tree, eight_d
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        newId,
        data.plantId || "PLT-01",
        data.title || "Critical Component Failure Investigation",
        data.assetId || "AST-001",
        data.assetName || "Primary Production Asset",
        data.lineId || "LIN-01",
        data.lineName || "Line 1 — Production",
        data.sourceBreakdownId || null,
        data.sourceWorkOrderId || null,
        data.severity || "High",
        data.status || "Open",
        data.currentPhase || "Event",
        data.problemStatement || "Problem statement pending technical review.",
        data.leadInvestigator || userName || "David Kim (Lead CI Engineer)",
        JSON.stringify(data.teamMembers || [userName || "David Kim (Lead CI)"]),
        data.eventDate || new Date().toISOString().substring(0, 10),
        data.daysActive || 1,
        JSON.stringify(data.whyTree || []),
        JSON.stringify(data.eightD || {}),
      ]
    );

    return this.mapInvestigation(res.rows[0]);
  }

  async updateInvestigation(id: string, data: Partial<RCAInvestigationEntity>): Promise<RCAInvestigationEntity> {
    const current = await this.getInvestigation(id);
    if (!current) throw new Error(`RCA Investigation ${id} not found`);

    const updated = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const res = await pool.query(
      `UPDATE ci_rca_investigations SET
        title = $1,
        severity = $2,
        status = $3,
        current_phase = $4,
        problem_statement = $5,
        lead_investigator = $6,
        team_members = $7,
        why_tree = $8,
        eight_d = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *`,
      [
        updated.title,
        updated.severity,
        updated.status,
        updated.currentPhase,
        updated.problemStatement,
        updated.leadInvestigator,
        JSON.stringify(updated.teamMembers || []),
        JSON.stringify(updated.whyTree || []),
        JSON.stringify(updated.eightD || {}),
        id,
      ]
    );

    return this.mapInvestigation(res.rows[0]);
  }

  async advanceInvestigationPhase(id: string, nextPhase: string): Promise<RCAInvestigationEntity> {
    let newStatus: string | undefined;
    if (nextPhase === "Occurrence Cause" || nextPhase === "Escape Cause") {
      newStatus = "Root Cause Validated";
    } else if (nextPhase === "Closed") {
      newStatus = "Closed";
    }

    let query = "UPDATE ci_rca_investigations SET current_phase = $1, updated_at = NOW()";
    const params: any[] = [nextPhase];
    if (newStatus) {
      query += ", status = $2 WHERE id = $3 RETURNING *";
      params.push(newStatus, id);
    } else {
      query += " WHERE id = $2 RETURNING *";
      params.push(id);
    }

    const res = await pool.query(query, params);
    if (res.rows.length === 0) throw new Error(`RCA Investigation ${id} not found`);
    return this.mapInvestigation(res.rows[0]);
  }

  async deleteInvestigation(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_rca_evidence WHERE rca_id = $1", [id]);
    await pool.query("DELETE FROM ci_rca_hypotheses WHERE rca_id = $1", [id]);
    await pool.query("DELETE FROM ci_rca_investigations WHERE id = $1", [id]);
    return { id, message: "Investigation and linked items deleted successfully" };
  }

  async getRCASummary(plantId?: string) {
    const list = await this.listInvestigations(plantId);
    const total = list.length;
    const closed = list.filter((i) => i.status === "Closed" || i.currentPhase === "Closed").length;
    const active = total - closed;
    const validated = list.filter((i) => i.status === "Root Cause Validated").length;
    const critical = list.filter((i) => i.severity === "Critical").length;
    const avgDays = total > 0 ? Math.round(list.reduce((acc, i) => acc + (i.daysActive || 0), 0) / total) : 0;

    return {
      total,
      active,
      closed,
      validated,
      critical,
      avgDays,
    };
  }

  // ============================================================================
  // 3. EVIDENCE LOCKER
  // ============================================================================
  private mapEvidence(r: any): RcaEvidenceEntity {
    return {
      id: r.id,
      rcaId: r.rca_id,
      type: r.type,
      title: r.title,
      details: r.details,
      fileUrl: r.file_url,
      uploadedBy: r.uploaded_by,
      date: r.date,
      createdAt: r.created_at,
    };
  }

  async listEvidence(rcaId?: string): Promise<RcaEvidenceEntity[]> {
    let query = "SELECT * FROM ci_rca_evidence";
    const params: any[] = [];
    if (rcaId && rcaId !== "ALL") {
      query += " WHERE rca_id = $1";
      params.push(rcaId);
    }
    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapEvidence);
  }

  async createEvidence(data: Partial<RcaEvidenceEntity>, userName?: string): Promise<RcaEvidenceEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_rca_evidence");
    const count = Number(seq.rows[0].count) + 1;
    const newId = data.id || `EVD-${String(count).padStart(2, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_rca_evidence (id, rca_id, type, title, details, file_url, uploaded_by, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        newId,
        data.rcaId || "RCA-2026-001",
        data.type || "SCADA Trend",
        data.title || "Evidence Attachment",
        data.details || "Technical inspection notes recorded.",
        data.fileUrl || null,
        data.uploadedBy || userName || "David Kim",
        data.date || new Date().toISOString().substring(0, 10),
      ]
    );
    return this.mapEvidence(res.rows[0]);
  }

  async deleteEvidence(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_rca_evidence WHERE id = $1", [id]);
    return { id, message: "Evidence record removed" };
  }

  // ============================================================================
  // 4. HYPOTHESES & CAUSE VALIDATION
  // ============================================================================
  private mapHypothesis(r: any): RcaHypothesisEntity {
    return {
      id: r.id,
      rcaId: r.rca_id,
      statement: r.statement,
      testMethod: r.test_method,
      evidenceResult: r.evidence_result,
      validationStatus: r.validation_status,
      validatedBy: r.validated_by,
      validatedAt: r.validated_at,
      createdAt: r.created_at,
    };
  }

  async listHypotheses(rcaId?: string): Promise<RcaHypothesisEntity[]> {
    let query = "SELECT * FROM ci_rca_hypotheses";
    const params: any[] = [];
    if (rcaId && rcaId !== "ALL") {
      query += " WHERE rca_id = $1";
      params.push(rcaId);
    }
    query += " ORDER BY created_at ASC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapHypothesis);
  }

  async createHypothesis(data: Partial<RcaHypothesisEntity>): Promise<RcaHypothesisEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_rca_hypotheses");
    const count = Number(seq.rows[0].count) + 1;
    const newId = data.id || `HYP-${String(count).padStart(2, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_rca_hypotheses (id, rca_id, statement, test_method, evidence_result, validation_status, validated_by, validated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        newId,
        data.rcaId || "RCA-2026-001",
        data.statement || "Hypothesis statement",
        data.testMethod || "Technical test procedure",
        data.evidenceResult || null,
        data.validationStatus || "In Progress",
        data.validatedBy || null,
        data.validatedAt || null,
      ]
    );
    return this.mapHypothesis(res.rows[0]);
  }

  async validateHypothesis(
    id: string,
    validationStatus: "Confirmed Root Cause" | "Refuted" | "In Progress",
    evidenceResult?: string,
    validatedBy?: string
  ): Promise<RcaHypothesisEntity> {
    const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
    const res = await pool.query(
      `UPDATE ci_rca_hypotheses SET
        validation_status = $1,
        evidence_result = COALESCE($2, evidence_result),
        validated_by = $3,
        validated_at = $4
       WHERE id = $5
       RETURNING *`,
      [validationStatus, evidenceResult || null, validatedBy || "Lead CI Engineer", timestamp, id]
    );
    if (res.rows.length === 0) throw new Error(`Hypothesis ${id} not found`);
    return this.mapHypothesis(res.rows[0]);
  }

  async deleteHypothesis(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_rca_hypotheses WHERE id = $1", [id]);
    return { id, message: "Hypothesis removed" };
  }

  // ============================================================================
  // 5. CAPA ACTIONS
  // ============================================================================
  private mapCapa(r: any): CapaActionEntity {
    return {
      id: r.id,
      rcaId: r.rca_id,
      projectId: r.project_id,
      description: r.description,
      actionType: r.action_type,
      owner: r.owner,
      dueDate: r.due_date,
      priority: r.priority,
      status: r.status,
      completionDate: r.completion_date,
      evidenceNotes: r.evidence_notes,
      effectivenessResult: r.effectiveness_result,
      verifiedBy: r.verified_by,
      verifiedAt: r.verified_at,
      createdAt: r.created_at,
    };
  }

  async listCapaActions(filters?: { rcaId?: string; projectId?: string; actionType?: string; status?: string }): Promise<CapaActionEntity[]> {
    let query = "SELECT * FROM ci_capa_actions WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (filters?.rcaId && filters.rcaId !== "ALL") {
      query += ` AND rca_id = $${idx++}`;
      params.push(filters.rcaId);
    }
    if (filters?.projectId && filters.projectId !== "ALL") {
      query += ` AND project_id = $${idx++}`;
      params.push(filters.projectId);
    }
    if (filters?.actionType && filters.actionType !== "ALL") {
      query += ` AND action_type = $${idx++}`;
      params.push(filters.actionType);
    }
    if (filters?.status && filters.status !== "ALL") {
      query += ` AND status = $${idx++}`;
      params.push(filters.status);
    }

    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapCapa);
  }

  async createCapaAction(data: Partial<CapaActionEntity>): Promise<CapaActionEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_capa_actions");
    const count = Number(seq.rows[0].count) + 1;
    const year = new Date().getFullYear();
    const newId = data.id || `CAPA-${year}-${String(count).padStart(3, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_capa_actions (
        id, rca_id, project_id, description, action_type, owner, due_date,
        priority, status, completion_date, evidence_notes, effectiveness_result,
        verified_by, verified_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        newId,
        data.rcaId || null,
        data.projectId || null,
        data.description || "CAPA Action Item description",
        data.actionType || "Corrective",
        data.owner || "Maintenance Lead",
        data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
        data.priority || "Medium",
        data.status || "Open",
        data.completionDate || null,
        data.evidenceNotes || null,
        data.effectivenessResult || null,
        data.verifiedBy || null,
        data.verifiedAt || null,
      ]
    );
    return this.mapCapa(res.rows[0]);
  }

  async updateCapaStatus(id: string, status: string, completionDate?: string, evidenceNotes?: string): Promise<CapaActionEntity> {
    const res = await pool.query(
      `UPDATE ci_capa_actions SET
        status = $1,
        completion_date = COALESCE($2, completion_date),
        evidence_notes = COALESCE($3, evidence_notes)
       WHERE id = $4
       RETURNING *`,
      [status, completionDate || null, evidenceNotes || null, id]
    );
    if (res.rows.length === 0) throw new Error(`CAPA ${id} not found`);
    return this.mapCapa(res.rows[0]);
  }

  async verifyCapaEffectiveness(id: string, effectivenessResult: string, verifiedBy?: string): Promise<CapaActionEntity> {
    const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
    const res = await pool.query(
      `UPDATE ci_capa_actions SET
        status = 'Verified',
        effectiveness_result = $1,
        verified_by = $2,
        verified_at = $3
       WHERE id = $4
       RETURNING *`,
      [effectivenessResult, verifiedBy || "Quality Manager", timestamp, id]
    );
    if (res.rows.length === 0) throw new Error(`CAPA ${id} not found`);
    return this.mapCapa(res.rows[0]);
  }

  async deleteCapaAction(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_capa_actions WHERE id = $1", [id]);
    return { id, message: "CAPA Action removed" };
  }

  // ============================================================================
  // 6. LOSS ANALYSIS
  // ============================================================================
  private mapLoss(r: any): CILossEntity {
    return {
      id: r.id,
      category: r.category,
      plantId: r.plant_id,
      lineId: r.line_id,
      assetId: r.asset_id,
      eventName: r.event_name,
      hoursLost: Number(r.hours_lost),
      unitsLost: Number(r.units_lost),
      financialImpactUSD: Number(r.financial_impact_usd),
      linkedRcaId: r.linked_rca_id,
      linkedProjectId: r.linked_project_id,
      trend: r.trend,
      date: r.date,
      createdAt: r.created_at,
    };
  }

  async listLosses(plantId?: string, category?: string): Promise<CILossEntity[]> {
    let query = "SELECT * FROM ci_losses WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (plantId && plantId !== "ALL") {
      query += ` AND plant_id = $${idx++}`;
      params.push(plantId);
    }
    if (category && category !== "ALL") {
      query += ` AND category = $${idx++}`;
      params.push(category);
    }

    query += " ORDER BY date DESC, created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapLoss);
  }

  async createLoss(data: Partial<CILossEntity>): Promise<CILossEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_losses");
    const count = Number(seq.rows[0].count) + 1;
    const newId = data.id || `LOSS-${String(count).padStart(2, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_losses (
        id, category, plant_id, line_id, asset_id, event_name,
        hours_lost, units_lost, financial_impact_usd, linked_rca_id,
        linked_project_id, trend, date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        newId,
        data.category || "Downtime Loss",
        data.plantId || "PLT-01",
        data.lineId || "LIN-01",
        data.assetId || "AST-001",
        data.eventName || "Loss Event",
        Number(data.hoursLost) || 0,
        Number(data.unitsLost) || 0,
        Number(data.financialImpactUSD) || 0,
        data.linkedRcaId || null,
        data.linkedProjectId || null,
        data.trend || "Tracked",
        data.date || new Date().toISOString().substring(0, 10),
      ]
    );
    return this.mapLoss(res.rows[0]);
  }

  async deleteLoss(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_losses WHERE id = $1", [id]);
    return { id, message: "Loss record deleted" };
  }

  async getLossSummary(plantId?: string) {
    const losses = await this.listLosses(plantId);
    const totalHours = losses.reduce((sum, l) => sum + l.hoursLost, 0);
    const totalUSD = losses.reduce((sum, l) => sum + l.financialImpactUSD, 0);

    const categories = ["Downtime Loss", "Quality / Defect Loss", "Scrap / Rework Loss", "Production Loss", "Yield Loss"];
    const breakdown = categories.map((cat) => {
      const items = losses.filter((l) => l.category === cat);
      return {
        category: cat,
        count: items.length,
        hoursLost: items.reduce((sum, l) => sum + l.hoursLost, 0),
        financialImpactUSD: items.reduce((sum, l) => sum + l.financialImpactUSD, 0),
      };
    });

    return {
      totalHoursLost: Number(totalHours.toFixed(2)),
      totalFinancialImpactUSD: Number(totalUSD.toFixed(2)),
      recordsCount: losses.length,
      breakdown,
    };
  }

  // ============================================================================
  // 7. CI PROJECTS & BENEFITS VERIFICATION (21 CFR PART 11)
  // ============================================================================
  private mapProject(r: any): CIProjectEntity {
    return {
      id: r.id,
      name: r.name,
      type: r.type,
      plantId: r.plant_id,
      lineId: r.line_id,
      assetId: r.asset_id,
      linkedRcaId: r.linked_rca_id,
      sponsor: r.sponsor,
      owner: r.owner,
      startDate: r.start_date,
      targetDate: r.target_date,
      status: r.status,
      progress: Number(r.progress),
      baselineMetric: r.baseline_metric,
      targetMetric: r.target_metric,
      currentMetric: r.current_metric,
      projectedSavingsAnnual: Number(r.projected_savings_annual),
      realizedSavingsYTD: Number(r.realized_savings_ytd),
      benefitStatus: r.benefit_status,
      lockedBy: r.locked_by,
      lockedAt: r.locked_at,
      unlockReason: r.unlock_reason,
      createdAt: r.created_at,
    };
  }

  async listProjects(plantId?: string): Promise<CIProjectEntity[]> {
    let query = "SELECT * FROM ci_projects";
    const params: any[] = [];
    if (plantId && plantId !== "ALL") {
      query += " WHERE plant_id = $1";
      params.push(plantId);
    }
    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapProject);
  }

  async getProject(id: string): Promise<CIProjectEntity | undefined> {
    const res = await pool.query("SELECT * FROM ci_projects WHERE id = $1", [id]);
    if (res.rows.length === 0) return undefined;
    return this.mapProject(res.rows[0]);
  }

  async createProject(input: Partial<CIProjectEntity>): Promise<CIProjectEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_projects");
    const count = Number(seq.rows[0].count) + 1;
    const newId = input.id || `PRJ-CI-${String(count).padStart(3, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_projects (
        id, name, type, plant_id, line_id, asset_id, linked_rca_id,
        sponsor, owner, start_date, target_date, status, progress,
        baseline_metric, target_metric, current_metric,
        projected_savings_annual, realized_savings_ytd, benefit_status,
        locked_by, locked_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        newId,
        input.name || "Continuous Improvement Project",
        input.type || "Kaizen Event",
        input.plantId || "PLT-01",
        input.lineId || "LIN-01",
        input.assetId || null,
        input.linkedRcaId || null,
        input.sponsor || "Operations Director",
        input.owner || "David Kim (Lead CI)",
        input.startDate || new Date().toISOString().substring(0, 10),
        input.targetDate || new Date(Date.now() + 60 * 86400000).toISOString().substring(0, 10),
        input.status || "In Progress",
        Number(input.progress) || 10,
        input.baselineMetric || "Baseline TBD",
        input.targetMetric || "Target TBD",
        input.currentMetric || input.baselineMetric || "Initial",
        Number(input.projectedSavingsAnnual) || 15000,
        Number(input.realizedSavingsYTD) || 0,
        input.benefitStatus || "Draft",
        input.lockedBy || null,
        input.lockedAt || null,
      ]
    );
    return this.mapProject(res.rows[0]);
  }

  async updateProject(id: string, input: Partial<CIProjectEntity>): Promise<CIProjectEntity> {
    const current = await this.getProject(id);
    if (!current) throw new Error(`Project ${id} not found`);

    const updated = { ...current, ...input };
    const res = await pool.query(
      `UPDATE ci_projects SET
        name = $1,
        type = $2,
        status = $3,
        progress = $4,
        baseline_metric = $5,
        target_metric = $6,
        current_metric = $7,
        projected_savings_annual = $8,
        realized_savings_ytd = $9,
        benefit_status = $10,
        owner = $11,
        target_date = $12
      WHERE id = $13
      RETURNING *`,
      [
        updated.name,
        updated.type,
        updated.status,
        Number(updated.progress),
        updated.baselineMetric,
        updated.targetMetric,
        updated.currentMetric,
        Number(updated.projectedSavingsAnnual),
        Number(updated.realizedSavingsYTD),
        updated.benefitStatus,
        updated.owner,
        updated.targetDate,
        id,
      ]
    );
    return this.mapProject(res.rows[0]);
  }

  async deleteProject(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_projects WHERE id = $1", [id]);
    return { id, message: "Project deleted successfully" };
  }

  async verifyAndLockBenefit(id: string, userName?: string): Promise<CIProjectEntity> {
    const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
    const res = await pool.query(
      `UPDATE ci_projects SET
        benefit_status = 'Verified & Locked',
        status = 'Completed',
        locked_by = $1,
        locked_at = $2
       WHERE id = $3
       RETURNING *`,
      [userName || "Plant Director", timestamp, id]
    );
    if (res.rows.length === 0) throw new Error(`Project ${id} not found`);
    return this.mapProject(res.rows[0]);
  }

  async unlockBenefit(id: string, justification: string, userName?: string): Promise<CIProjectEntity> {
    const res = await pool.query(
      `UPDATE ci_projects SET
        benefit_status = 'Pending Verification',
        locked_by = NULL,
        locked_at = NULL,
        unlock_reason = $1
       WHERE id = $2
       RETURNING *`,
      [justification || `Unlocked by ${userName || "Lead CI"} for metric recalculation`, id]
    );
    if (res.rows.length === 0) throw new Error(`Project ${id} not found`);
    return this.mapProject(res.rows[0]);
  }

  async getBenefitsSummary(plantId?: string) {
    const projects = await this.listProjects(plantId);
    const verified = projects.filter((p) => p.benefitStatus === "Verified & Locked");
    const pending = projects.filter((p) => p.benefitStatus === "Pending Verification");
    const realizedSavingsTotal = verified.reduce((sum, p) => sum + (p.realizedSavingsYTD || 0), 0);
    const projectedSavingsTotal = projects.reduce((sum, p) => sum + (p.projectedSavingsAnnual || 0), 0);

    return {
      verifiedCount: verified.length,
      pendingCount: pending.length,
      realizedSavingsTotal,
      projectedSavingsTotal,
      auditTrailStatus: "Certified Immutable",
      complianceStandard: "21 CFR Part 11",
      projectsCount: projects.length,
    };
  }

  // ============================================================================
  // 8. STANDARDS LIBRARY
  // ============================================================================
  private mapStandard(r: any): CIStandardEntity {
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      version: r.version,
      plantId: r.plant_id,
      lineId: r.line_id,
      assetId: r.asset_id,
      sourceProjectId: r.source_project_id,
      sourceRcaId: r.source_rca_id,
      owner: r.owner,
      status: r.status,
      effectiveDate: r.effective_date,
      reviewDate: r.review_date,
      approvedBy: r.approved_by,
      createdAt: r.created_at,
    };
  }

  async listStandards(plantId?: string, type?: string): Promise<CIStandardEntity[]> {
    let query = "SELECT * FROM ci_standards WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (plantId && plantId !== "ALL") {
      query += ` AND plant_id = $${idx++}`;
      params.push(plantId);
    }
    if (type && type !== "ALL") {
      query += ` AND type = $${idx++}`;
      params.push(type);
    }

    query += " ORDER BY effective_date DESC, created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapStandard);
  }

  async createStandard(data: Partial<CIStandardEntity>): Promise<CIStandardEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_standards");
    const count = Number(seq.rows[0].count) + 1;
    const newId = data.id || `STD-ENG-${String(count).padStart(3, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_standards (
        id, title, type, version, plant_id, line_id, asset_id,
        source_project_id, source_rca_id, owner, status,
        effective_date, review_date, approved_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        newId,
        data.title || "Controlled Operating Procedure",
        data.type || "Controlled SOP",
        data.version || "v1.0",
        data.plantId || "PLT-01",
        data.lineId || null,
        data.assetId || null,
        data.sourceProjectId || null,
        data.sourceRcaId || null,
        data.owner || "Engineering Committee",
        data.status || "Active",
        data.effectiveDate || new Date().toISOString().substring(0, 10),
        data.reviewDate || new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10),
        data.approvedBy || "Plant Director",
      ]
    );
    return this.mapStandard(res.rows[0]);
  }

  async updateStandard(id: string, data: Partial<CIStandardEntity>): Promise<CIStandardEntity> {
    const res = await pool.query(
      `UPDATE ci_standards SET
        title = COALESCE($1, title),
        version = COALESCE($2, version),
        status = COALESCE($3, status),
        review_date = COALESCE($4, review_date)
       WHERE id = $5
       RETURNING *`,
      [data.title || null, data.version || null, data.status || null, data.reviewDate || null, id]
    );
    if (res.rows.length === 0) throw new Error(`Standard ${id} not found`);
    return this.mapStandard(res.rows[0]);
  }

  async deleteStandard(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_standards WHERE id = $1", [id]);
    return { id, message: "Standard document deleted" };
  }

  // ============================================================================
  // 9. VERIFIED SOLUTIONS (KNOWLEDGE BASE)
  // ============================================================================
  private mapSolution(r: any): CIVerifiedSolutionEntity {
    return {
      id: r.id,
      assetId: r.asset_id,
      assetName: r.asset_name,
      failureMode: r.failure_mode,
      symptom: r.symptom,
      rootCause: r.root_cause,
      solutionSteps: r.solution_steps,
      partsUsed: r.parts_used,
      sourceRcaId: r.source_rca_id,
      verifiedBy: r.verified_by,
      verifiedDate: r.verified_date,
      status: r.status,
      createdAt: r.created_at,
    };
  }

  async listSolutions(assetId?: string, search?: string): Promise<CIVerifiedSolutionEntity[]> {
    let query = "SELECT * FROM ci_verified_solutions WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (assetId && assetId !== "ALL") {
      query += ` AND asset_id = $${idx++}`;
      params.push(assetId);
    }
    if (search) {
      query += ` AND (failure_mode ILIKE $${idx} OR symptom ILIKE $${idx} OR root_cause ILIKE $${idx} OR asset_name ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    query += " ORDER BY verified_date DESC, created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapSolution);
  }

  async createSolution(data: Partial<CIVerifiedSolutionEntity>): Promise<CIVerifiedSolutionEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_verified_solutions");
    const count = Number(seq.rows[0].count) + 1;
    const newId = data.id || `VSOL-${String(count).padStart(3, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_verified_solutions (
        id, asset_id, asset_name, failure_mode, symptom, root_cause,
        solution_steps, parts_used, source_rca_id, verified_by,
        verified_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        newId,
        data.assetId || "AST-001",
        data.assetName || "Primary Asset",
        data.failureMode || "General Failure Mode",
        data.symptom || "Observed physical symptom",
        data.rootCause || "Validated Root Cause",
        data.solutionSteps || "Standard technical resolution steps",
        data.partsUsed || null,
        data.sourceRcaId || null,
        data.verifiedBy || "Maintenance Lead",
        data.verifiedDate || new Date().toISOString().substring(0, 10),
        data.status || "Published",
      ]
    );
    return this.mapSolution(res.rows[0]);
  }

  async deleteSolution(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_verified_solutions WHERE id = $1", [id]);
    return { id, message: "Verified solution removed" };
  }

  // ============================================================================
  // 10. ENGINEERING CAPEX REDESIGN
  // ============================================================================
  private mapCapex(r: any): CICapexProjectEntity {
    return {
      id: r.id,
      name: r.name,
      plantId: r.plant_id,
      lineId: r.line_id,
      assetId: r.asset_id,
      linkedRcaId: r.linked_rca_id,
      linkedProjectId: r.linked_project_id,
      budget: Number(r.budget),
      estimatedCost: Number(r.estimated_cost),
      actualCost: Number(r.actual_cost),
      engineeringJustification: r.engineering_justification,
      status: r.status,
      owner: r.owner,
      targetCommissionDate: r.target_commission_date,
      dossierRef: r.dossier_ref,
      approvalStatus: r.approval_status,
      createdAt: r.created_at,
    };
  }

  async listCapex(plantId?: string): Promise<CICapexProjectEntity[]> {
    let query = "SELECT * FROM ci_capex_projects";
    const params: any[] = [];
    if (plantId && plantId !== "ALL") {
      query += " WHERE plant_id = $1";
      params.push(plantId);
    }
    query += " ORDER BY created_at DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapCapex);
  }

  async createCapex(data: Partial<CICapexProjectEntity>): Promise<CICapexProjectEntity> {
    const seq = await pool.query("SELECT COUNT(*) FROM ci_capex_projects");
    const count = Number(seq.rows[0].count) + 1;
    const year = new Date().getFullYear();
    const newId = data.id || `CPX-${year}-${String(count).padStart(3, "0")}`;

    const res = await pool.query(
      `INSERT INTO ci_capex_projects (
        id, name, plant_id, line_id, asset_id, linked_rca_id,
        linked_project_id, budget, estimated_cost, actual_cost,
        engineering_justification, status, owner,
        target_commission_date, dossier_ref, approval_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        newId,
        data.name || "Engineering Redesign Capex",
        data.plantId || "PLT-01",
        data.lineId || "LIN-01",
        data.assetId || "AST-001",
        data.linkedRcaId || null,
        data.linkedProjectId || null,
        Number(data.budget) || 25000,
        Number(data.estimatedCost) || 22000,
        Number(data.actualCost) || 0,
        data.engineeringJustification || "Machine modification to prevent recurrent failure mode.",
        data.status || "Budget Approved",
        data.owner || "David Kim (Lead CI)",
        data.targetCommissionDate || new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10),
        data.dossierRef || `DOS-ENG-${newId}`,
        data.approvalStatus || "Approved by Plant GM",
      ]
    );
    return this.mapCapex(res.rows[0]);
  }

  async deleteCapex(id: string): Promise<{ id: string; message: string }> {
    await pool.query("DELETE FROM ci_capex_projects WHERE id = $1", [id]);
    return { id, message: "Capex proposal removed" };
  }

  // ============================================================================
  // 11. RELIABILITY & BAD ACTORS
  // ============================================================================
  private mapReliability(r: any): CIReliabilityRecordEntity {
    return {
      id: r.id,
      assetId: r.asset_id,
      assetName: r.asset_name,
      lineId: r.line_id,
      lineName: r.line_name,
      plantId: r.plant_id,
      failuresCount: Number(r.failures_count),
      totalDowntimeMin: Number(r.total_downtime_min),
      mtbfHrs: Number(r.mtbf_hrs),
      mttrMin: Number(r.mttr_min),
      lastFailureDate: r.last_failure_date,
      failureCategory: r.failure_category,
      criticality: r.criticality,
      isBadActor: Boolean(r.is_bad_actor),
      badActorReason: r.bad_actor_reason,
      createdAt: r.created_at,
    };
  }

  async listReliabilityRecords(plantId?: string, onlyBadActors?: boolean): Promise<CIReliabilityRecordEntity[]> {
    let query = "SELECT * FROM ci_reliability_records WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (plantId && plantId !== "ALL") {
      query += ` AND plant_id = $${idx++}`;
      params.push(plantId);
    }
    if (onlyBadActors) {
      query += ` AND is_bad_actor = true`;
    }

    query += " ORDER BY failures_count DESC, total_downtime_min DESC";
    const res = await pool.query(query, params);
    return res.rows.map(this.mapReliability);
  }

  async launchRcaFromBadActor(assetId: string, userName?: string): Promise<RCAInvestigationEntity> {
    const relRes = await pool.query("SELECT * FROM ci_reliability_records WHERE asset_id = $1 LIMIT 1", [assetId]);
    const asset = relRes.rows[0] || {
      asset_id: assetId,
      asset_name: `Asset ${assetId}`,
      line_id: "LIN-01",
      line_name: "Line 1 — Bottling",
      plant_id: "PLT-01",
      bad_actor_reason: "Repeat breakdown trigger",
    };

    return this.createInvestigation(
      {
        title: `Bad Actor Systematic RCA: ${asset.asset_name} (${asset.asset_id})`,
        assetId: asset.asset_id,
        assetName: asset.asset_name,
        lineId: asset.line_id,
        lineName: asset.line_name,
        plantId: asset.plant_id,
        severity: "Critical",
        currentPhase: "Event",
        status: "Open",
        problemStatement: `Automated Bad Actor escalation triggered due to recurrent breakdowns: ${asset.bad_actor_reason || "3+ incidents in 30 days."}`,
        leadInvestigator: userName || "David Kim (Lead CI Engineer)",
      },
      userName
    );
  }
}

export const ciService = new CIService();
