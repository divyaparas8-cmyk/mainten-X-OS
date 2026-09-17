"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ciService = exports.CIService = void 0;
const database_js_1 = require("../../config/database.js");
class CIService {
    // ============================================================================
    // AUDIT LOG HELPER
    // ============================================================================
    async logAudit(params) {
        const isUuid = (str) => typeof str === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
        try {
            await database_js_1.pool.query(`INSERT INTO audit_logs (id, tenant_id, plant_id, user_id, action, entity_type, entity_id, old_values, new_values, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())`, [
                isUuid(params.tenantId) ? params.tenantId : null,
                isUuid(params.plantId) ? params.plantId : null,
                isUuid(params.userId) ? params.userId : null,
                params.action,
                params.entityType,
                params.entityId,
                params.oldValues ? JSON.stringify(params.oldValues) : null,
                params.newValues ? JSON.stringify(params.newValues) : null,
            ]);
        }
        catch (err) {
            console.warn("Audit log insert warning:", err.message);
        }
    }
    // ============================================================================
    // 1. DASHBOARD SUMMARY
    // ============================================================================
    async getDashboardSummary(plantId, stage) {
        const isPlantFilter = plantId && plantId !== "ALL" && plantId !== "PLT-01";
        const isStageFilter = stage && stage !== "ALL";
        let plantClause = isPlantFilter ? "WHERE plant_id = $1" : "";
        const params = isPlantFilter ? [plantId] : [];
        // Filter clauses for stage-aware tables
        let stageRcaClause = "";
        let stageRelClause = "";
        let stageLossClause = "";
        const stageParams = [...params];
        if (isStageFilter) {
            stageParams.push(stage);
            const stageParamIdx = stageParams.length;
            stageRcaClause = isPlantFilter ? `WHERE plant_id = $1 AND stage = $${stageParamIdx}` : `WHERE stage = $${stageParamIdx}`;
            stageRelClause = isPlantFilter ? `WHERE plant_id = $1 AND stage = $${stageParamIdx}` : `WHERE stage = $${stageParamIdx}`;
            stageLossClause = isPlantFilter ? `WHERE plant_id = $1 AND stage = $${stageParamIdx}` : `WHERE stage = $${stageParamIdx}`;
        }
        else {
            stageRcaClause = plantClause;
            stageRelClause = plantClause;
            stageLossClause = plantClause;
        }
        // Projects savings
        const projRes = await database_js_1.pool.query(`SELECT 
        COALESCE(SUM(projected_savings_annual), 0) AS projected_total,
        COALESCE(SUM(realized_savings_ytd), 0) AS realized_total,
        COUNT(*) AS total_projects,
        COUNT(CASE WHEN status = 'Completed' OR benefit_status = 'Verified & Locked' THEN 1 END) AS completed_projects,
        COUNT(CASE WHEN benefit_status = 'Pending Verification' THEN 1 END) AS pending_benefits
      FROM ci_projects ${plantClause}`, params);
        // RCA investigations
        const rcaRes = await database_js_1.pool.query(`SELECT 
        COUNT(*) AS total_rca,
        COUNT(CASE WHEN status = 'Open' OR status = 'In Progress' THEN 1 END) AS open_rca,
        COUNT(CASE WHEN status = 'Root Cause Validated' THEN 1 END) AS validated_rca,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) AS closed_rca
      FROM ci_rca_investigations ${stageRcaClause}`, stageParams);
        // Reliability & Bad Actors
        const relRes = await database_js_1.pool.query(`SELECT 
        COUNT(*) AS total_assets,
        COUNT(CASE WHEN is_bad_actor = true THEN 1 END) AS bad_actors_count,
        COALESCE(AVG(mtbf_hrs), 0) AS avg_mtbf,
        COALESCE(AVG(mttr_min), 0) AS avg_mttr
      FROM ci_reliability_records ${stageRelClause}`, stageParams);
        // Stage-specific breakdown for split Processing vs Packaging visibility
        const stageRelRes = await database_js_1.pool.query(`SELECT 
        stage,
        COUNT(*) AS total_assets,
        COUNT(CASE WHEN is_bad_actor = true THEN 1 END) AS bad_actors_count,
        COALESCE(AVG(mtbf_hrs), 0) AS avg_mtbf,
        COALESCE(AVG(mttr_min), 0) AS avg_mttr
      FROM ci_reliability_records ${plantClause}
      GROUP BY stage`, params);
        const procRel = stageRelRes.rows.find((r) => (r.stage || "").toUpperCase() === "PROCESSING") || {};
        const packRel = stageRelRes.rows.find((r) => (r.stage || "").toUpperCase() === "PACKAGING") || {};
        // Losses
        const lossRes = await database_js_1.pool.query(`SELECT 
        COALESCE(SUM(hours_lost), 0) AS total_hours_lost,
        COALESCE(SUM(financial_impact_usd), 0) AS total_loss_usd
      FROM ci_losses ${stageLossClause}`, stageParams);
        const stageLossRes = await database_js_1.pool.query(`SELECT 
        stage,
        COALESCE(SUM(hours_lost), 0) AS hours_lost,
        COALESCE(SUM(financial_impact_usd), 0) AS loss_usd,
        COALESCE(SUM(units_lost), 0) AS units_lost
      FROM ci_losses ${plantClause}
      GROUP BY stage`, params);
        const procLoss = stageLossRes.rows.find((r) => (r.stage || "").toUpperCase() === "PROCESSING") || {};
        const packLoss = stageLossRes.rows.find((r) => (r.stage || "").toUpperCase() === "PACKAGING") || {};
        // CAPA actions
        const capaRes = await database_js_1.pool.query(`SELECT 
        COUNT(*) AS total_capa,
        COUNT(CASE WHEN status = 'Open' OR status = 'In Progress' THEN 1 END) AS pending_capa,
        COUNT(CASE WHEN status = 'Verified' THEN 1 END) AS verified_capa,
        COUNT(CASE WHEN status NOT IN ('Completed', 'Verified', 'Closed') AND due_date < CURRENT_DATE::text THEN 1 END) AS overdue_capa
      FROM ci_capa_actions`);
        // Capex projects
        const capexRes = await database_js_1.pool.query(`SELECT 
        COUNT(*) AS total_capex,
        COUNT(CASE WHEN status NOT IN ('Closed', 'Commissioned') THEN 1 END) AS open_capex
      FROM ci_capex_projects ${plantClause}`, params);
        // Standards
        const stdRes = await database_js_1.pool.query(`SELECT 
        COUNT(*) AS total_standards,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) AS active_standards
      FROM ci_standards ${plantClause}`, params);
        // Verified Solutions
        const solRes = await database_js_1.pool.query(`SELECT COUNT(*) AS total_solutions FROM ci_verified_solutions`);
        const proj = projRes.rows[0] || {};
        const rca = rcaRes.rows[0] || {};
        const rel = relRes.rows[0] || {};
        const loss = lossRes.rows[0] || {};
        const capa = capaRes.rows[0] || {};
        const capex = capexRes.rows[0] || {};
        const std = stdRes.rows[0] || {};
        const sol = solRes.rows[0] || {};
        return {
            financials: {
                projectedSavings: Number(proj.projected_total || 0),
                realizedSavings: Number(proj.realized_total || 0),
                totalLossUSD: Number(loss.total_loss_usd || 0),
                totalHoursLost: Number(loss.total_hours_lost || 0),
            },
            reliability: {
                badActorsCount: Number(rel.bad_actors_count || 0),
                avgMtbfHrs: Math.round(Number(rel.avg_mtbf || 0)),
                avgMttrMin: Math.round(Number(rel.avg_mttr || 0)),
            },
            stageBreakdown: {
                processing: {
                    avgMtbfHrs: Math.round(Number(procRel.avg_mtbf || 0)),
                    avgMttrMin: Math.round(Number(procRel.avg_mttr || 0)),
                    badActorsCount: Number(procRel.bad_actors_count || 0),
                    totalLossUSD: Number(procLoss.loss_usd || 0),
                    hoursLost: Number(procLoss.hours_lost || 0),
                    unitsLost: Number(procLoss.units_lost || 0),
                },
                packaging: {
                    avgMtbfHrs: Math.round(Number(packRel.avg_mtbf || 0)),
                    avgMttrMin: Math.round(Number(packRel.avg_mttr || 0)),
                    badActorsCount: Number(packRel.bad_actors_count || 0),
                    totalLossUSD: Number(packLoss.loss_usd || 0),
                    hoursLost: Number(packLoss.hours_lost || 0),
                    unitsLost: Number(packLoss.units_lost || 0),
                },
            },
            rca: {
                totalRCA: Number(rca.total_rca || 0),
                openRCA: Number(rca.open_rca || 0),
                validatedRCA: Number(rca.validated_rca || 0),
                closedRCA: Number(rca.closed_rca || 0),
            },
            projects: {
                total: Number(proj.total_projects || 0),
                completed: Number(proj.completed_projects || 0),
                pendingBenefits: Number(proj.pending_benefits || 0),
            },
            capa: {
                total: Number(capa.total_capa || 0),
                pending: Number(capa.pending_capa || 0),
                verified: Number(capa.verified_capa || 0),
                overdue: Number(capa.overdue_capa || 0),
            },
            capex: {
                total: Number(capex.total_capex || 0),
                open: Number(capex.open_capex || 0),
            },
            standards: {
                total: Number(std.total_standards || 0),
                active: Number(std.active_standards || 0),
            },
            solutions: {
                total: Number(sol.total_solutions || 0),
            },
        };
    }
    // ============================================================================
    // 2. RCA INVESTIGATIONS
    // ============================================================================
    mapInvestigation(r) {
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
            stage: r.stage || "PACKAGING",
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
    async listInvestigations(plantId, stage) {
        let query = "SELECT * FROM ci_rca_investigations WHERE 1=1";
        const params = [];
        let idx = 1;
        if (plantId && plantId !== "ALL" && plantId !== "PLT-01") {
            query += ` AND plant_id = $${idx++}`;
            params.push(plantId);
        }
        if (stage && stage !== "ALL") {
            query += ` AND stage = $${idx++}`;
            params.push(stage);
        }
        query += " ORDER BY created_at DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapInvestigation);
    }
    async getInvestigation(id) {
        const res = await database_js_1.pool.query("SELECT * FROM ci_rca_investigations WHERE id = $1", [id]);
        if (res.rows.length === 0)
            return undefined;
        return this.mapInvestigation(res.rows[0]);
    }
    async createInvestigation(data, userContext) {
        const nextSeqRes = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_rca_investigations");
        const count = Number(nextSeqRes.rows[0].count) + 1;
        const year = new Date().getFullYear();
        const newId = data.id || `RCA-${year}-${String(count).padStart(3, "0")}`;
        const userName = userContext?.userName || "Lead CI Engineer";
        const res = await database_js_1.pool.query(`INSERT INTO ci_rca_investigations (
        id, plant_id, title, stage, asset_id, asset_name, line_id, line_name,
        source_breakdown_id, source_work_order_id, severity, status,
        current_phase, problem_statement, lead_investigator, team_members,
        event_date, days_active, why_tree, eight_d
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`, [
            newId,
            data.plantId || userContext?.plantId || "PLT-01",
            data.title || "Critical Component Failure Investigation",
            data.stage || "PACKAGING",
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
            data.leadInvestigator || userName,
            JSON.stringify(data.teamMembers || [userName]),
            data.eventDate || new Date().toISOString().substring(0, 10),
            data.daysActive || 0,
            JSON.stringify(data.whyTree || []),
            JSON.stringify(data.eightD || {}),
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: data.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_RCA_INITIATED",
            entityType: "RCA Investigation",
            entityId: newId,
            newValues: { id: newId, title: data.title, assetId: data.assetId },
        });
        return this.mapInvestigation(res.rows[0]);
    }
    async updateInvestigation(id, data, userContext) {
        const current = await this.getInvestigation(id);
        if (!current)
            throw new Error(`RCA Investigation ${id} not found`);
        const updated = {
            ...current,
            ...data,
            updatedAt: new Date().toISOString(),
        };
        const res = await database_js_1.pool.query(`UPDATE ci_rca_investigations SET
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
      RETURNING *`, [
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
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: current.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_RCA_UPDATED",
            entityType: "RCA Investigation",
            entityId: id,
            oldValues: current,
            newValues: data,
        });
        return this.mapInvestigation(res.rows[0]);
    }
    async advanceInvestigationPhase(id, nextPhase, userContext) {
        let newStatus;
        if (nextPhase === "Occurrence Cause" || nextPhase === "Escape Cause") {
            newStatus = "Root Cause Validated";
        }
        else if (nextPhase === "Closed") {
            newStatus = "Closed";
        }
        let query = "UPDATE ci_rca_investigations SET current_phase = $1, updated_at = NOW()";
        const params = [nextPhase];
        if (newStatus) {
            query += ", status = $2 WHERE id = $3 RETURNING *";
            params.push(newStatus, id);
        }
        else {
            query += " WHERE id = $2 RETURNING *";
            params.push(id);
        }
        const res = await database_js_1.pool.query(query, params);
        if (res.rows.length === 0)
            throw new Error(`RCA Investigation ${id} not found`);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: res.rows[0]?.plant_id || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_RCA_PHASE_ADVANCED",
            entityType: "RCA Investigation",
            entityId: id,
            newValues: { currentPhase: nextPhase, status: newStatus },
        });
        return this.mapInvestigation(res.rows[0]);
    }
    async deleteInvestigation(id, userContext) {
        const client = await database_js_1.pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM ci_rca_evidence WHERE rca_id = $1", [id]);
            await client.query("DELETE FROM ci_rca_hypotheses WHERE rca_id = $1", [id]);
            await client.query("UPDATE ci_capa_actions SET rca_id = NULL WHERE rca_id = $1", [id]);
            await client.query("DELETE FROM ci_rca_investigations WHERE id = $1", [id]);
            await client.query("COMMIT");
        }
        catch (e) {
            await client.query("ROLLBACK");
            throw e;
        }
        finally {
            client.release();
        }
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_RCA_DELETED",
            entityType: "RCA Investigation",
            entityId: id,
        });
        return { id, message: "Investigation and linked items deleted successfully" };
    }
    async getRCASummary(plantId) {
        const list = await this.listInvestigations(plantId);
        const total = list.length;
        const closed = list.filter((i) => i.status === "Closed" || i.currentPhase === "Closed").length;
        const active = total - closed;
        const validated = list.filter((i) => i.status === "Root Cause Validated").length;
        const critical = list.filter((i) => i.severity === "Critical").length;
        const avgDays = total > 0 ? Math.round(list.reduce((acc, i) => acc + (i.daysActive || 0), 0) / total) : 0;
        return {
            totalInvestigations: total,
            activeInvestigations: active,
            validatedRootCauses: validated,
            criticalIncidents: critical,
            avgDaysToRootCause: avgDays,
            phaseDistribution: {
                event: list.filter((i) => i.currentPhase === "Event").length,
                evidence: list.filter((i) => i.currentPhase === "Evidence").length,
                hypothesis: list.filter((i) => i.currentPhase === "Hypothesis & Tests").length,
                occurrence: list.filter((i) => i.currentPhase === "Occurrence Cause").length,
                escape: list.filter((i) => i.currentPhase === "Escape Cause").length,
                capa: list.filter((i) => i.currentPhase === "CAPA").length,
                verification: list.filter((i) => i.currentPhase === "Verification").length,
                closed: closed,
            },
        };
    }
    // ============================================================================
    // 3. EVIDENCE LOCKER
    // ============================================================================
    mapEvidence(r) {
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
    async listEvidence(rcaId) {
        let query = "SELECT * FROM ci_rca_evidence";
        const params = [];
        if (rcaId && rcaId !== "ALL") {
            query += " WHERE rca_id = $1";
            params.push(rcaId);
        }
        query += " ORDER BY created_at DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapEvidence);
    }
    async createEvidence(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_rca_evidence");
        const count = Number(seq.rows[0].count) + 1;
        const newId = data.id || `EVD-${String(count).padStart(2, "0")}`;
        const userName = userContext?.userName || "Lead CI Engineer";
        const res = await database_js_1.pool.query(`INSERT INTO ci_rca_evidence (id, rca_id, type, title, details, file_url, uploaded_by, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [
            newId,
            data.rcaId || "RCA-2026-001",
            data.type || "Physical Photo",
            data.title || "Observation Evidence",
            data.details || "Details pending input.",
            data.fileUrl || null,
            data.uploadedBy || userName,
            data.date || new Date().toISOString().substring(0, 10),
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_EVIDENCE_ATTACHED",
            entityType: "RCA Evidence",
            entityId: newId,
            newValues: { rcaId: data.rcaId, title: data.title, type: data.type },
        });
        return this.mapEvidence(res.rows[0]);
    }
    async updateEvidence(id, data, userContext) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (data.rcaId !== undefined) {
            fields.push(`rca_id = $${idx++}`);
            values.push(data.rcaId);
        }
        if (data.type !== undefined) {
            fields.push(`type = $${idx++}`);
            values.push(data.type);
        }
        if (data.title !== undefined) {
            fields.push(`title = $${idx++}`);
            values.push(data.title);
        }
        if (data.details !== undefined) {
            fields.push(`details = $${idx++}`);
            values.push(data.details);
        }
        if (data.fileUrl !== undefined) {
            fields.push(`file_url = $${idx++}`);
            values.push(data.fileUrl);
        }
        if (fields.length === 0) {
            const existing = await database_js_1.pool.query("SELECT * FROM ci_rca_evidence WHERE id = $1", [id]);
            return this.mapEvidence(existing.rows[0]);
        }
        values.push(id);
        const res = await database_js_1.pool.query(`UPDATE ci_rca_evidence SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`, values);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_EVIDENCE_UPDATED",
            entityType: "RCA Evidence",
            entityId: id,
            newValues: data,
        });
        return this.mapEvidence(res.rows[0]);
    }
    async deleteEvidence(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_rca_evidence WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_EVIDENCE_DELETED",
            entityType: "RCA Evidence",
            entityId: id,
        });
        return { id, message: "Evidence item removed" };
    }
    // ============================================================================
    // 4. HYPOTHESES & VALIDATION
    // ============================================================================
    mapHypothesis(r) {
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
    async listHypotheses(rcaId) {
        let query = "SELECT * FROM ci_rca_hypotheses";
        const params = [];
        if (rcaId && rcaId !== "ALL") {
            query += " WHERE rca_id = $1";
            params.push(rcaId);
        }
        query += " ORDER BY created_at ASC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapHypothesis);
    }
    async createHypothesis(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_rca_hypotheses");
        const count = Number(seq.rows[0].count) + 1;
        const newId = data.id || `HYP-${String(count).padStart(2, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_rca_hypotheses (id, rca_id, statement, test_method, evidence_result, validation_status, validated_by, validated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [
            newId,
            data.rcaId || "RCA-2026-001",
            data.statement || "Hypothesis statement",
            data.testMethod || "Technical test procedure",
            data.evidenceResult || null,
            data.validationStatus || "In Progress",
            data.validatedBy || null,
            data.validatedAt || null,
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_HYPOTHESIS_FORMULATED",
            entityType: "RCA Hypothesis",
            entityId: newId,
            newValues: { rcaId: data.rcaId, statement: data.statement },
        });
        return this.mapHypothesis(res.rows[0]);
    }
    async validateHypothesis(id, validationStatus, evidenceResult, userContext) {
        const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
        const userName = userContext?.userName || "Lead CI Engineer";
        const res = await database_js_1.pool.query(`UPDATE ci_rca_hypotheses SET
        validation_status = $1,
        evidence_result = COALESCE($2, evidence_result),
        validated_by = $3,
        validated_at = $4
       WHERE id = $5
       RETURNING *`, [validationStatus, evidenceResult || null, userName, timestamp, id]);
        if (res.rows.length === 0)
            throw new Error(`Hypothesis ${id} not found`);
        const hyp = res.rows[0];
        if (validationStatus === "Confirmed Root Cause" && hyp.rca_id) {
            await this.advanceInvestigationPhase(hyp.rca_id, "CAPA", userContext);
            await database_js_1.pool.query(`UPDATE ci_rca_investigations SET status = 'Root Cause Validated' WHERE id = $1`, [hyp.rca_id]);
        }
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_HYPOTHESIS_VALIDATED",
            entityType: "RCA Hypothesis",
            entityId: id,
            newValues: { validationStatus, evidenceResult, validatedBy: userName },
        });
        return this.mapHypothesis(hyp);
    }
    async deleteHypothesis(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_rca_hypotheses WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_HYPOTHESIS_DELETED",
            entityType: "RCA Hypothesis",
            entityId: id,
        });
        return { id, message: "Hypothesis removed" };
    }
    // ============================================================================
    // 5. CAPA ACTIONS
    // ============================================================================
    mapCapa(r) {
        return {
            id: r.id,
            rcaId: r.rca_id,
            projectId: r.project_id,
            description: r.description,
            actionType: r.action_type,
            owner: r.owner,
            dueDate: r.due_date,
            priority: r.priority,
            stage: r.stage || "PACKAGING",
            status: r.status,
            completionDate: r.completion_date,
            evidenceNotes: r.evidence_notes,
            effectivenessResult: r.effectiveness_result,
            verifiedBy: r.verified_by,
            verifiedAt: r.verified_at,
            createdAt: r.created_at,
        };
    }
    async listCapaActions(filters) {
        let query = "SELECT * FROM ci_capa_actions WHERE 1=1";
        const params = [];
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
        if (filters?.stage && filters.stage !== "ALL") {
            query += ` AND stage = $${idx++}`;
            params.push(filters.stage);
        }
        query += " ORDER BY due_date ASC, created_at DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapCapa);
    }
    async createCapaAction(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_capa_actions");
        const count = Number(seq.rows[0].count) + 1;
        const year = new Date().getFullYear();
        const newId = data.id || `CAPA-${year}-${String(count).padStart(3, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_capa_actions (
        id, rca_id, project_id, description, action_type, owner,
        due_date, priority, stage, status, completion_date, evidence_notes,
        effectiveness_result, verified_by, verified_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`, [
            newId,
            data.rcaId || null,
            data.projectId || null,
            data.description || "Action item description",
            data.actionType || "Corrective",
            data.owner || userContext?.userName || "Lead CI Engineer",
            data.dueDate || new Date().toISOString().substring(0, 10),
            data.priority || "Medium",
            data.stage || "PACKAGING",
            data.status || "Open",
            data.completionDate || null,
            data.evidenceNotes || null,
            data.effectivenessResult || null,
            data.verifiedBy || null,
            data.verifiedAt || null,
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPA_CREATED",
            entityType: "CAPA Action",
            entityId: newId,
            newValues: { id: newId, description: data.description, owner: data.owner, dueDate: data.dueDate },
        });
        return this.mapCapa(res.rows[0]);
    }
    async updateCapaAction(id, data, userContext) {
        const fields = [];
        const params = [];
        let idx = 1;
        if (data.description !== undefined) {
            fields.push(`description = $${idx++}`);
            params.push(data.description);
        }
        if (data.owner !== undefined) {
            fields.push(`owner = $${idx++}`);
            params.push(data.owner);
        }
        if (data.dueDate !== undefined) {
            fields.push(`due_date = $${idx++}`);
            params.push(data.dueDate);
        }
        if (data.priority !== undefined) {
            fields.push(`priority = $${idx++}`);
            params.push(data.priority);
        }
        if (data.status !== undefined) {
            fields.push(`status = $${idx++}`);
            params.push(data.status);
        }
        if (data.rcaId !== undefined) {
            fields.push(`rca_id = $${idx++}`);
            params.push(data.rcaId);
        }
        if (data.completionDate !== undefined) {
            fields.push(`completion_date = $${idx++}`);
            params.push(data.completionDate);
        }
        if (data.evidenceNotes !== undefined) {
            fields.push(`evidence_notes = $${idx++}`);
            params.push(data.evidenceNotes);
        }
        if (data.effectivenessResult !== undefined) {
            fields.push(`effectiveness_result = $${idx++}`);
            params.push(data.effectivenessResult);
        }
        if (fields.length === 0)
            throw new Error("No fields provided to update");
        const query = `UPDATE ci_capa_actions SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
        params.push(id);
        const res = await database_js_1.pool.query(query, params);
        if (res.rows.length === 0)
            throw new Error(`CAPA Action ${id} not found`);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPA_UPDATED",
            entityType: "CAPA Action",
            entityId: id,
            newValues: data,
        });
        return this.mapCapa(res.rows[0]);
    }
    async updateCapaStatus(id, status, completionDate, evidenceNotes, userContext) {
        let query = "UPDATE ci_capa_actions SET status = $1";
        const params = [status];
        let idx = 2;
        if (completionDate) {
            query += `, completion_date = $${idx++}`;
            params.push(completionDate);
        }
        if (evidenceNotes) {
            query += `, evidence_notes = $${idx++}`;
            params.push(evidenceNotes);
        }
        query += ` WHERE id = $${idx} RETURNING *`;
        params.push(id);
        const res = await database_js_1.pool.query(query, params);
        if (res.rows.length === 0)
            throw new Error(`CAPA Action ${id} not found`);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPA_STATUS_UPDATED",
            entityType: "CAPA Action",
            entityId: id,
            newValues: { status, completionDate, evidenceNotes },
        });
        return this.mapCapa(res.rows[0]);
    }
    async verifyCapaEffectiveness(id, effectivenessResult, userContext) {
        const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
        const userName = userContext?.userName || "Quality Manager";
        const res = await database_js_1.pool.query(`UPDATE ci_capa_actions SET
        status = 'Verified',
        effectiveness_result = $1,
        verified_by = $2,
        verified_at = $3
       WHERE id = $4
       RETURNING *`, [effectivenessResult, userName, timestamp, id]);
        if (res.rows.length === 0)
            throw new Error(`CAPA Action ${id} not found`);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPA_EFFECTIVENESS_VERIFIED",
            entityType: "CAPA Action",
            entityId: id,
            newValues: { effectivenessResult, verifiedBy: userName },
        });
        return this.mapCapa(res.rows[0]);
    }
    async deleteCapaAction(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_capa_actions WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPA_DELETED",
            entityType: "CAPA Action",
            entityId: id,
        });
        return { id, message: "CAPA Action deleted" };
    }
    // ============================================================================
    // 6. LOSS ANALYSIS
    // ============================================================================
    mapLoss(r) {
        return {
            id: r.id,
            category: r.category,
            plantId: r.plant_id,
            lineId: r.line_id,
            assetId: r.asset_id,
            eventName: r.event_name,
            stage: r.stage || "PACKAGING",
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
    async listLosses(plantId, category, stage) {
        let query = "SELECT * FROM ci_losses WHERE 1=1";
        const params = [];
        let idx = 1;
        if (plantId && plantId !== "ALL" && plantId !== "PLT-01") {
            query += ` AND plant_id = $${idx++}`;
            params.push(plantId);
        }
        if (category && category !== "ALL") {
            query += ` AND category ILIKE $${idx++}`;
            params.push(`%${category}%`);
        }
        if (stage && stage !== "ALL") {
            query += ` AND stage = $${idx++}`;
            params.push(stage);
        }
        query += " ORDER BY date DESC, created_at DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapLoss);
    }
    async createLoss(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_losses");
        const count = Number(seq.rows[0].count) + 1;
        const newId = data.id || `LOSS-${String(count).padStart(2, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_losses (
        id, category, plant_id, line_id, asset_id, stage, event_name,
        hours_lost, units_lost, financial_impact_usd, linked_rca_id,
        linked_project_id, trend, date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`, [
            newId,
            data.category || "Downtime Loss",
            data.plantId || userContext?.plantId || "PLT-01",
            data.lineId || "LIN-01",
            data.assetId || "AST-001",
            data.stage || "PACKAGING",
            data.eventName || "Loss Event",
            Number(data.hoursLost) || 0,
            Number(data.unitsLost) || 0,
            Number(data.financialImpactUSD) || 0,
            data.linkedRcaId || null,
            data.linkedProjectId || null,
            data.trend || "Tracked",
            data.date || new Date().toISOString().substring(0, 10),
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: data.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_LOSS_RECORDED",
            entityType: "Loss Record",
            entityId: newId,
            newValues: { id: newId, category: data.category, financialImpactUSD: data.financialImpactUSD },
        });
        return this.mapLoss(res.rows[0]);
    }
    async deleteLoss(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_losses WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_LOSS_DELETED",
            entityType: "Loss Record",
            entityId: id,
        });
        return { id, message: "Loss incident deleted" };
    }
    async getLossSummary(plantId) {
        const list = await this.listLosses(plantId);
        const totalUSD = list.reduce((acc, l) => acc + l.financialImpactUSD, 0);
        const totalHours = list.reduce((acc, l) => acc + l.hoursLost, 0);
        const totalUnits = list.reduce((acc, l) => acc + l.unitsLost, 0);
        const categories = ["Downtime", "Quality", "Production", "Yield", "Scrap"];
        const breakdown = {};
        categories.forEach((cat) => {
            const filtered = list.filter((l) => l.category.toLowerCase().includes(cat.toLowerCase()));
            breakdown[cat] = {
                totalUSD: filtered.reduce((acc, l) => acc + l.financialImpactUSD, 0),
                hours: filtered.reduce((acc, l) => acc + l.hoursLost, 0),
                count: filtered.length,
            };
        });
        return {
            totalUSD,
            totalHours,
            totalUnits,
            incidentsCount: list.length,
            breakdown,
        };
    }
    // ============================================================================
    // 7. CI PROJECTS & 21 CFR PART 11 BENEFITS
    // ============================================================================
    mapProject(r) {
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
            progress: Number(r.progress || 0),
            baselineMetric: r.baseline_metric,
            targetMetric: r.target_metric,
            currentMetric: r.current_metric,
            projectedSavingsAnnual: Number(r.projected_savings_annual || 0),
            realizedSavingsYTD: Number(r.realized_savings_ytd || 0),
            benefitStatus: r.benefit_status,
            lockedBy: r.locked_by,
            lockedAt: r.locked_at,
            unlockReason: r.unlock_reason,
            createdAt: r.created_at,
        };
    }
    async listProjects(plantId) {
        let query = "SELECT * FROM ci_projects";
        const params = [];
        if (plantId && plantId !== "ALL") {
            query += " WHERE plant_id = $1";
            params.push(plantId);
        }
        query += " ORDER BY created_at DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapProject);
    }
    async getProject(id) {
        const res = await database_js_1.pool.query("SELECT * FROM ci_projects WHERE id = $1", [id]);
        if (res.rows.length === 0)
            return undefined;
        return this.mapProject(res.rows[0]);
    }
    async createProject(input, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_projects");
        const count = Number(seq.rows[0].count) + 1;
        const newId = input.id || `PRJ-CI-${String(count).padStart(3, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_projects (
        id, name, type, plant_id, line_id, asset_id, linked_rca_id,
        sponsor, owner, start_date, target_date, status, progress,
        baseline_metric, target_metric, current_metric,
        projected_savings_annual, realized_savings_ytd, benefit_status,
        locked_by, locked_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`, [
            newId,
            input.name || "Continuous Improvement Kaizen Event",
            input.type || "Kaizen Event",
            input.plantId || userContext?.plantId || "PLT-01",
            input.lineId || "LIN-01",
            input.assetId || null,
            input.linkedRcaId || null,
            input.sponsor || "Operations Director",
            input.owner || userContext?.userName || "Lead CI Engineer",
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
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: input.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_PROJECT_CREATED",
            entityType: "CI Project",
            entityId: newId,
            newValues: { id: newId, name: input.name, projectedSavings: input.projectedSavingsAnnual },
        });
        return this.mapProject(res.rows[0]);
    }
    async updateProject(id, input, userContext) {
        const current = await this.getProject(id);
        if (!current)
            throw new Error(`Project ${id} not found`);
        const updated = { ...current, ...input };
        const res = await database_js_1.pool.query(`UPDATE ci_projects SET
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
      RETURNING *`, [
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
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: current.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_PROJECT_UPDATED",
            entityType: "CI Project",
            entityId: id,
            newValues: input,
        });
        return this.mapProject(res.rows[0]);
    }
    async deleteProject(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_projects WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_PROJECT_DELETED",
            entityType: "CI Project",
            entityId: id,
        });
        return { id, message: "Project deleted successfully" };
    }
    async verifyAndLockBenefit(id, userContext) {
        const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
        const userName = userContext?.userName || "Plant Director";
        const res = await database_js_1.pool.query(`UPDATE ci_projects SET
        benefit_status = 'Verified & Locked',
        status = 'Completed',
        locked_by = $1,
        locked_at = $2
       WHERE id = $3
       RETURNING *`, [userName, timestamp, id]);
        if (res.rows.length === 0)
            throw new Error(`Project ${id} not found`);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_BENEFIT_LOCKED",
            entityType: "CI Project Benefit",
            entityId: id,
            newValues: { lockedBy: userName, lockedAt: timestamp },
        });
        return this.mapProject(res.rows[0]);
    }
    async unlockBenefit(id, justification, userContext) {
        const userName = userContext?.userName || "Lead CI";
        const res = await database_js_1.pool.query(`UPDATE ci_projects SET
        benefit_status = 'Pending Verification',
        locked_by = NULL,
        locked_at = NULL,
        unlock_reason = $1
       WHERE id = $2
       RETURNING *`, [justification || `Unlocked by ${userName} for metric recalculation`, id]);
        if (res.rows.length === 0)
            throw new Error(`Project ${id} not found`);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_BENEFIT_UNLOCKED",
            entityType: "CI Project Benefit",
            entityId: id,
            newValues: { justification },
        });
        return this.mapProject(res.rows[0]);
    }
    async getBenefitsSummary(plantId) {
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
    mapStandard(r) {
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
    async listStandards(plantId, type) {
        let query = "SELECT * FROM ci_standards WHERE 1=1";
        const params = [];
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
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapStandard);
    }
    async createStandard(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_standards");
        const count = Number(seq.rows[0].count) + 1;
        const newId = data.id || `STD-SOP-${String(count).padStart(3, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_standards (
        id, title, type, version, plant_id, line_id, asset_id,
        source_project_id, source_rca_id, owner, status,
        effective_date, review_date, approved_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`, [
            newId,
            data.title || "Controlled Operating Procedure",
            data.type || "Controlled SOP",
            data.version || "v1.0",
            data.plantId || userContext?.plantId || "PLT-01",
            data.lineId || "LIN-01",
            data.assetId || null,
            data.sourceProjectId || null,
            data.sourceRcaId || null,
            data.owner || userContext?.userName || "Engineering Quality Committee",
            data.status || "Active",
            data.effectiveDate || new Date().toISOString().substring(0, 10),
            data.reviewDate || new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10),
            data.approvedBy || userContext?.userName || "Lead CI Engineer",
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: data.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_STANDARD_CREATED",
            entityType: "Controlled Standard",
            entityId: newId,
            newValues: { id: newId, title: data.title, type: data.type },
        });
        return this.mapStandard(res.rows[0]);
    }
    async updateStandard(id, data, userContext) {
        const currentRes = await database_js_1.pool.query("SELECT * FROM ci_standards WHERE id = $1", [id]);
        if (currentRes.rows.length === 0)
            throw new Error(`Standard ${id} not found`);
        const current = this.mapStandard(currentRes.rows[0]);
        const updated = { ...current, ...data };
        const res = await database_js_1.pool.query(`UPDATE ci_standards SET
        title = $1,
        type = $2,
        version = $3,
        owner = $4,
        status = $5,
        review_date = $6
       WHERE id = $7
       RETURNING *`, [updated.title, updated.type, updated.version, updated.owner, updated.status, updated.reviewDate, id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: current.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_STANDARD_REVISED",
            entityType: "Controlled Standard",
            entityId: id,
            newValues: data,
        });
        return this.mapStandard(res.rows[0]);
    }
    async deleteStandard(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_standards WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_STANDARD_DELETED",
            entityType: "Controlled Standard",
            entityId: id,
        });
        return { id, message: "Standard removed" };
    }
    // ============================================================================
    // 9. VERIFIED SOLUTIONS KNOWLEDGE BASE
    // ============================================================================
    mapSolution(r) {
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
    async listSolutions(assetId, search) {
        let query = "SELECT * FROM ci_verified_solutions WHERE 1=1";
        const params = [];
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
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapSolution);
    }
    async createSolution(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_verified_solutions");
        const count = Number(seq.rows[0].count) + 1;
        const newId = data.id || `VS-${String(count).padStart(3, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_verified_solutions (
        id, asset_id, asset_name, failure_mode, symptom, root_cause,
        solution_steps, parts_used, source_rca_id, verified_by,
        verified_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`, [
            newId,
            data.assetId || "AST-001",
            data.assetName || "Primary Production Asset",
            data.failureMode || "Recurrent Failure Mode",
            data.symptom || "Equipment malfunction observed",
            data.rootCause || "Underlying root cause determined through systematic RCA",
            data.solutionSteps || "Perform standard troubleshooting and maintenance repair.",
            data.partsUsed || null,
            data.sourceRcaId || null,
            data.verifiedBy || userContext?.userName || "Lead CI Specialist",
            data.verifiedDate || new Date().toISOString().substring(0, 10),
            data.status || "Published",
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_SOLUTION_CREATED",
            entityType: "Verified Solution",
            entityId: newId,
            newValues: { id: newId, failureMode: data.failureMode, assetId: data.assetId },
        });
        return this.mapSolution(res.rows[0]);
    }
    async deleteSolution(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_verified_solutions WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_SOLUTION_DELETED",
            entityType: "Verified Solution",
            entityId: id,
        });
        return { id, message: "Verified solution removed" };
    }
    // ============================================================================
    // 10. ENGINEERING CAPEX
    // ============================================================================
    mapCapex(r) {
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
    async listCapex(plantId) {
        let query = "SELECT * FROM ci_capex_projects";
        const params = [];
        if (plantId && plantId !== "ALL") {
            query += " WHERE plant_id = $1";
            params.push(plantId);
        }
        query += " ORDER BY created_at DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapCapex);
    }
    async createCapex(data, userContext) {
        const seq = await database_js_1.pool.query("SELECT COUNT(*) FROM ci_capex_projects");
        const count = Number(seq.rows[0].count) + 1;
        const year = new Date().getFullYear();
        const newId = data.id || `CPX-${year}-${String(count).padStart(3, "0")}`;
        const res = await database_js_1.pool.query(`INSERT INTO ci_capex_projects (
        id, name, plant_id, line_id, asset_id, linked_rca_id,
        linked_project_id, budget, estimated_cost, actual_cost,
        engineering_justification, status, owner,
        target_commission_date, dossier_ref, approval_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`, [
            newId,
            data.name || "Engineering Redesign Capex",
            data.plantId || userContext?.plantId || "PLT-01",
            data.lineId || "LIN-01",
            data.assetId || "AST-001",
            data.linkedRcaId || null,
            data.linkedProjectId || null,
            Number(data.budget) || 25000,
            Number(data.estimatedCost) || 22000,
            Number(data.actualCost) || 0,
            data.engineeringJustification || "Machine modification to prevent recurrent failure mode.",
            data.status || "Budget Approved",
            data.owner || userContext?.userName || "Lead CI Engineer",
            data.targetCommissionDate || new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10),
            data.dossierRef || `DOS-ENG-${newId}`,
            data.approvalStatus || "Approved by Plant GM",
        ]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: data.plantId || userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPEX_CREATED",
            entityType: "Capex Project",
            entityId: newId,
            newValues: { id: newId, name: data.name, budget: data.budget },
        });
        return this.mapCapex(res.rows[0]);
    }
    async deleteCapex(id, userContext) {
        await database_js_1.pool.query("DELETE FROM ci_capex_projects WHERE id = $1", [id]);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: userContext?.plantId,
            userId: userContext?.userId,
            action: "CI_CAPEX_DELETED",
            entityType: "Capex Project",
            entityId: id,
        });
        return { id, message: "Capex proposal removed" };
    }
    // ============================================================================
    // 11. RELIABILITY & BAD ACTORS
    // ============================================================================
    mapReliability(r) {
        return {
            id: r.id,
            assetId: r.asset_id,
            assetName: r.asset_name,
            lineId: r.line_id,
            lineName: r.line_name,
            plantId: r.plant_id,
            stage: r.stage || "PACKAGING",
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
    async listReliabilityRecords(plantId, onlyBadActors, stage) {
        let query = "SELECT * FROM ci_reliability_records WHERE 1=1";
        const params = [];
        let idx = 1;
        if (plantId && plantId !== "ALL" && plantId !== "PLT-01") {
            query += ` AND plant_id = $${idx++}`;
            params.push(plantId);
        }
        if (stage && stage !== "ALL") {
            query += ` AND stage = $${idx++}`;
            params.push(stage);
        }
        if (onlyBadActors) {
            query += ` AND is_bad_actor = true`;
        }
        query += " ORDER BY failures_count DESC, total_downtime_min DESC";
        const res = await database_js_1.pool.query(query, params);
        return res.rows.map(this.mapReliability);
    }
    async launchRcaFromBadActor(assetId, userContext) {
        const relRes = await database_js_1.pool.query("SELECT * FROM ci_reliability_records WHERE asset_id = $1 LIMIT 1", [assetId]);
        let asset = relRes.rows[0];
        if (!asset) {
            const assetDb = await database_js_1.pool.query("SELECT * FROM assets WHERE id::text = $1 OR asset_code = $1 LIMIT 1", [assetId]);
            if (assetDb.rows[0]) {
                const a = assetDb.rows[0];
                asset = {
                    asset_id: a.asset_code || a.id,
                    asset_name: a.name,
                    line_id: a.line_id || "LIN-01",
                    line_name: "Line 1 — Production",
                    plant_id: a.plant_id || "PLT-01",
                    bad_actor_reason: "High failure rate trigger",
                };
            }
            else {
                asset = {
                    asset_id: assetId,
                    asset_name: `Asset ${assetId}`,
                    line_id: "LIN-01",
                    line_name: "Line 1 — Bottling",
                    plant_id: userContext?.plantId || "PLT-01",
                    bad_actor_reason: "Repeat breakdown trigger",
                };
            }
        }
        const created = await this.createInvestigation({
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
            leadInvestigator: userContext?.userName || "Lead CI Engineer",
        }, userContext);
        await this.logAudit({
            tenantId: userContext?.tenantId,
            plantId: asset.plant_id,
            userId: userContext?.userId,
            action: "CI_BAD_ACTOR_RCA_LAUNCHED",
            entityType: "RCA Investigation",
            entityId: created.id,
            newValues: { assetId: asset.asset_id, rcaId: created.id },
        });
        return created;
    }
}
exports.CIService = CIService;
exports.ciService = new CIService();
