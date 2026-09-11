"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionsService = exports.ExceptionsService = void 0;
const database_js_1 = require("../../config/database.js");
class ExceptionsService {
    async listExceptions(plantId, severity, category) {
        const client = await database_js_1.pool.connect();
        try {
            let query = `
        SELECT id, title, severity, category, 
               asset_or_order as "assetOrOrder", 
               impact_description as "impactDescription",
               owner, escalation_level as "escalationLevel",
               status, resolution_notes as "resolutionNotes",
               resolved_at as "resolvedAt", created_at as "createdAt"
        FROM pm_exceptions
        WHERE (plant_id = $1 OR $1 IS NULL)
      `;
            const params = [plantId || 'PLT-01'];
            if (severity && severity !== 'ALL') {
                params.push(severity);
                query += ` AND severity = $${params.length}`;
            }
            if (category && category !== 'ALL') {
                params.push(category);
                query += ` AND category = $${params.length}`;
            }
            query += ` ORDER BY CASE WHEN status != 'Resolved' THEN 0 ELSE 1 END, created_at DESC;`;
            const res = await client.query(query, params);
            return res.rows;
        }
        finally {
            client.release();
        }
    }
    async getException(id) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`
        SELECT id, title, severity, category, 
               asset_or_order as "assetOrOrder", 
               impact_description as "impactDescription",
               owner, escalation_level as "escalationLevel",
               status, resolution_notes as "resolutionNotes",
               resolved_at as "resolvedAt", created_at as "createdAt"
        FROM pm_exceptions
        WHERE id = $1;
      `, [id]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async createException(input) {
        const client = await database_js_1.pool.connect();
        try {
            const countRes = await client.query(`SELECT count(*) FROM pm_exceptions;`);
            const newId = `EX-2026-${100 + Number(countRes.rows[0].count) + 1}`;
            const res = await client.query(`
        INSERT INTO pm_exceptions (id, plant_id, title, severity, category, asset_or_order, impact_description, owner, escalation_level, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Active')
        RETURNING id, title, severity, category, asset_or_order as "assetOrOrder", impact_description as "impactDescription", owner, escalation_level as "escalationLevel", status;
      `, [
                newId,
                input.plantId || 'PLT-01',
                input.title,
                input.severity || 'P2',
                input.category || 'Equipment Stoppage',
                input.assetOrOrder || '',
                input.impactDescription || input.title,
                input.owner || 'Unassigned',
                input.escalationLevel || 'L1 - Shift Supervisor'
            ]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async assignException(id, input) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`
        UPDATE pm_exceptions
        SET owner = COALESCE($2, owner),
            escalation_level = COALESCE($3, escalation_level),
            status = CASE WHEN status = 'Active' THEN 'In Review' ELSE status END,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, owner, escalation_level as "escalationLevel", status;
      `, [id, input.owner, input.escalationLevel]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async resolveException(id, input) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`
        UPDATE pm_exceptions
        SET status = 'Resolved',
            resolution_notes = $2,
            resolved_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, status, resolution_notes as "resolutionNotes", resolved_at as "resolvedAt";
      `, [id, input.resolutionNotes]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
}
exports.ExceptionsService = ExceptionsService;
exports.exceptionsService = new ExceptionsService();
//# sourceMappingURL=exceptions.service.js.map