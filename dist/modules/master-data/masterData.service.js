"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataService = exports.MasterDataService = void 0;
const database_js_1 = require("../../config/database.js");
const masterData_js_1 = require("../../db/schema/masterData.js");
const tenants_js_1 = require("../../db/schema/tenants.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
let inMemoryCompanies = [];
let inMemoryPlants = [];
let inMemoryDepartments = [];
let inMemoryLines = [];
let inMemoryWorkCenters = [];
let inMemoryOperations = [];
let inMemoryRoutings = [];
let inMemoryProductFamilies = [];
let inMemoryUoms = [];
let inMemoryPackConfigs = [];
let inMemoryLineTargets = [];
let inMemoryChangeoverRules = [];
let inMemorySanitationClasses = [];
let inMemoryAllergenRules = [];
let inMemoryLabourStandards = [];
let inMemorySkus = [];
function matchKey(entity, keyVal, candidateProps = ["id", "code", "companyId", "plantId", "departmentId", "lineId", "workCenterId", "operationId", "routingId", "familyId", "uomId", "configId", "targetId", "ruleId", "classId", "name"]) {
    if (!keyVal || !entity)
        return false;
    try {
        const search = decodeURIComponent(String(keyVal)).trim().toLowerCase();
        for (const prop of candidateProps) {
            if (entity[prop] !== undefined && entity[prop] !== null) {
                const val = String(entity[prop]).trim().toLowerCase();
                if (val === search)
                    return true;
            }
        }
    }
    catch (_) { }
    return false;
}
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function resolvePlantId(tenantId, plantIdOrCode) {
    if (!plantIdOrCode)
        return undefined;
    if (UUID_REGEX.test(plantIdOrCode))
        return plantIdOrCode;
    // Try to find plant by code (e.g. "INDORE-01", "PUNE-02", "PLT-01")
    const [plant] = await database_js_1.db
        .select({ id: tenants_js_1.plants.id })
        .from(tenants_js_1.plants)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(tenants_js_1.plants.tenantId, tenantId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(tenants_js_1.plants.code, plantIdOrCode), (0, drizzle_orm_1.sql) `lower(${tenants_js_1.plants.code}) = lower(${plantIdOrCode})`)))
        .limit(1);
    if (plant)
        return plant.id;
    // Fallback to first plant for tenant so it never throws invalid UUID error
    const [firstPlant] = await database_js_1.db
        .select({ id: tenants_js_1.plants.id })
        .from(tenants_js_1.plants)
        .where((0, drizzle_orm_1.eq)(tenants_js_1.plants.tenantId, tenantId))
        .limit(1);
    return firstPlant?.id;
}
class MasterDataService {
    // ==========================================
    // 1. COMPANIES / LEGAL ENTITIES (STRICTLY public.companies)
    // ==========================================
    async listCompanies(tenantId) {
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT id, code, name, tax_id, currency, hq_location, fiscal_year_start, status
        FROM public.companies
        ORDER BY created_at DESC
      `);
            const rows = res?.rows || (Array.isArray(res) ? res : []);
            if (rows && rows.length > 0) {
                return rows.map((r) => ({
                    id: String(r.id),
                    companyId: String(r.id),
                    code: r.code,
                    name: r.name,
                    taxId: r.tax_id || "TAX-001",
                    currency: r.currency || "USD ($)",
                    hqLocation: r.hq_location || "Headquarters",
                    fiscalYearStart: r.fiscal_year_start || "January",
                    status: r.status || "Active",
                }));
            }
        }
        catch (err) {
            console.warn("DB listCompanies from companies table fallback:", err.message);
        }
        if (tenantId) {
            try {
                const [tenantRecord] = await database_js_1.db
                    .select()
                    .from(tenants_js_1.tenants)
                    .where((0, drizzle_orm_1.eq)(tenants_js_1.tenants.id, tenantId))
                    .limit(1);
                if (tenantRecord) {
                    return [{
                            id: tenantRecord.id,
                            companyId: tenantRecord.id,
                            code: tenantRecord.slug ? tenantRecord.slug.substring(0, 8).toUpperCase() : "CMP",
                            name: tenantRecord.name,
                            taxId: "TAX-" + (tenantRecord.slug ? tenantRecord.slug.substring(0, 6).toUpperCase() : "001"),
                            currency: tenantRecord.settings?.currency || "USD ($)",
                            hqLocation: "Corporate Headquarters",
                            fiscalYearStart: "January",
                            status: tenantRecord.status === "ACTIVE" ? "Active" : "Suspended",
                        }];
                }
            }
            catch (_) { }
        }
        return [];
    }
    async createCompany(tenantId, input) {
        const code = (input.code || `CMP-${Date.now().toString().slice(-4)}`).toUpperCase();
        const name = String(input.name || "Company").trim();
        const taxId = input.taxId || "TAX-001";
        const currency = input.currency || "USD ($)";
        const hqLocation = input.hqLocation || input.headquarters || "Corporate Headquarters";
        const fiscalYearStart = input.fiscalYearStart || "January";
        const status = input.status || "Active";
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.companies (code, name, tax_id, currency, hq_location, fiscal_year_start, status, created_at, updated_at)
        VALUES (${code}, ${name}, ${taxId}, ${currency}, ${hqLocation}, ${fiscalYearStart}, ${status}, NOW(), NOW())
        RETURNING *
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            const newId = row?.id ? String(row.id) : `CMP-${Date.now().toString().slice(-4)}`;
            return {
                id: newId,
                companyId: newId,
                code,
                name,
                taxId,
                currency,
                hqLocation,
                fiscalYearStart,
                status,
            };
        }
        catch (err) {
            console.warn("DB createCompany into companies table error:", err.message);
            throw err;
        }
    }
    async updateCompany(tenantId, id, input) {
        try {
            if (input.name) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET name = ${input.name}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            if (input.code) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET code = ${input.code.toUpperCase()}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            if (input.taxId) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET tax_id = ${input.taxId}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            if (input.currency) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET currency = ${input.currency}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            if (input.hqLocation || input.headquarters) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET hq_location = ${input.hqLocation || input.headquarters}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            if (input.fiscalYearStart) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET fiscal_year_start = ${input.fiscalYearStart}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            if (input.status) {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `UPDATE public.companies SET status = ${input.status}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            }
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `SELECT id, code, name, tax_id, currency, hq_location, fiscal_year_start, status FROM public.companies WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id}) LIMIT 1`);
            if (res.rows && res.rows[0]) {
                const u = res.rows[0];
                return {
                    id: String(u.id),
                    companyId: String(u.id),
                    code: u.code,
                    name: u.name,
                    taxId: u.tax_id || "TAX-001",
                    currency: u.currency || "USD ($)",
                    hqLocation: u.hq_location || "Corporate Headquarters",
                    fiscalYearStart: u.fiscal_year_start || "January",
                    status: u.status || "Active",
                };
            }
        }
        catch (err) {
            console.warn("DB updateCompany error:", err.message);
        }
        return { id, ...input };
    }
    async deleteCompany(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.companies
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);
            return { id, message: "Company removed" };
        }
        catch (err) {
            console.warn("DB deleteCompany error:", err.message);
            return { id, message: "Company removed" };
        }
    }
    // ==========================================
    // 2. PLANTS / FACILITIES (STRICTLY public.plants)
    // ==========================================
    async listPlants(tenantId) {
        try {
            const dbPlants = tenantId
                ? await database_js_1.db.select().from(tenants_js_1.plants).where((0, drizzle_orm_1.eq)(tenants_js_1.plants.tenantId, tenantId)).orderBy((0, drizzle_orm_1.desc)(tenants_js_1.plants.createdAt))
                : await database_js_1.db.select().from(tenants_js_1.plants).orderBy((0, drizzle_orm_1.desc)(tenants_js_1.plants.createdAt));
            if (dbPlants && dbPlants.length > 0) {
                return dbPlants.map((p) => ({
                    id: p.id,
                    plantId: p.id,
                    code: p.code,
                    name: p.name,
                    city: p.city,
                    state: p.state || "",
                    country: p.country || "India",
                    timezone: p.timezone ? `${p.timezone} (IST)` : "Asia/Kolkata (IST)",
                    location: `${p.city}, ${p.state || ""}, ${p.country || ""}`.replace(/,\s*,/g, ",").replace(/,\s*$/, ""),
                    status: p.isActive ? "Active" : "Inactive",
                    isActive: p.isActive,
                    capacity: "350,000 Units/Day",
                    dailyCapacity: "350,000 Units/Day",
                    linesCount: 3,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                }));
            }
            if (tenantId) {
                return [];
            }
        }
        catch (err) {
            console.warn("DB listPlants fallback:", err.message);
        }
        return tenantId ? [] : inMemoryPlants;
    }
    async createPlant(tenantId, input) {
        const newId = `PLT-0${inMemoryPlants.length + 1}`;
        const newPlant = {
            id: newId,
            plantId: newId,
            companyId: input.companyId || "CMP-01",
            code: input.code ? input.code.toUpperCase() : `PLT-0${inMemoryPlants.length + 1}`,
            name: input.name,
            location: input.location || `${input.city || "Indore"}, ${input.country || "India"}`,
            city: input.city || "Indore",
            state: input.state || "MP",
            country: input.country || "India",
            timezone: input.timezone || "Asia/Kolkata (IST)",
            capacity: input.dailyCapacity || input.capacity || "300,000 Units/Day",
            dailyCapacity: input.dailyCapacity || input.capacity || "300,000 Units/Day",
            operatingShifts: Number(input.operatingShifts) || 3,
            linesCount: Number(input.linesCount) || 3,
            status: input.status || "Active",
        };
        try {
            let dbTenantId = tenantId;
            if (!dbTenantId) {
                const [t] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
                dbTenantId = t?.id;
            }
            const city = input.city || (input.location ? input.location.split(',')[0]?.trim() : "Indore") || "Indore";
            const state = input.state || (input.location ? input.location.split(',')[1]?.trim() : "Madhya Pradesh") || "Madhya Pradesh";
            const country = input.country || (input.location ? input.location.split(',')[2]?.trim() : "India") || "India";
            const timezone = (input.timezone || "Asia/Kolkata").replace(/\s*\(.*\)/, "").trim();
            const [created] = await database_js_1.db.insert(tenants_js_1.plants).values({
                tenantId: dbTenantId,
                code: newPlant.code,
                name: newPlant.name,
                city,
                state,
                country,
                timezone,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();
            if (created) {
                newPlant.id = created.id;
                newPlant.plantId = created.id;
            }
        }
        catch (err) {
            console.warn("DB createPlant error:", err.message);
        }
        inMemoryPlants.unshift(newPlant);
        return newPlant;
    }
    async updatePlant(tenantId, id, input) {
        const idx = inMemoryPlants.findIndex((p) => matchKey(p, id, ["id", "plantId", "code", "name"]));
        if (idx !== -1) {
            inMemoryPlants[idx] = { ...inMemoryPlants[idx], ...input };
        }
        try {
            const updateData = { updatedAt: new Date() };
            if (input.name)
                updateData.name = input.name;
            if (input.code)
                updateData.code = input.code.toUpperCase();
            if (input.city)
                updateData.city = input.city;
            if (input.state)
                updateData.state = input.state;
            if (input.country)
                updateData.country = input.country;
            if (input.location) {
                const parts = input.location.split(',').map((s) => s.trim());
                if (parts[0])
                    updateData.city = parts[0];
                if (parts[1])
                    updateData.state = parts[1];
                if (parts[2])
                    updateData.country = parts[2];
            }
            if (input.timezone)
                updateData.timezone = input.timezone.replace(/\s*\(.*\)/, "").trim();
            if (input.status !== undefined)
                updateData.isActive = input.status === "Active" || input.status === true;
            await database_js_1.db
                .update(tenants_js_1.plants)
                .set(updateData)
                .where((0, drizzle_orm_1.sql) `${tenants_js_1.plants.id}::text = ${id} OR ${tenants_js_1.plants.code} = ${id} OR lower(${tenants_js_1.plants.code}) = lower(${id})`);
        }
        catch (err) {
            console.warn("DB updatePlant error:", err.message);
        }
        return idx !== -1 ? inMemoryPlants[idx] : { id, ...input };
    }
    async deletePlant(tenantId, id) {
        try {
            await database_js_1.db
                .delete(tenants_js_1.plants)
                .where((0, drizzle_orm_1.sql) `${tenants_js_1.plants.id}::text = ${id} OR ${tenants_js_1.plants.code} = ${id} OR lower(${tenants_js_1.plants.code}) = lower(${id})`);
        }
        catch (err) {
            console.warn("DB deletePlant error:", err.message);
        }
        const idx = inMemoryPlants.findIndex((p) => matchKey(p, id, ["id", "plantId", "code", "name"]));
        if (idx !== -1) {
            const deleted = inMemoryPlants.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Plant facility deleted" };
    }
    // ==========================================
    // 3. DEPARTMENTS (STRICTLY public.departments)
    // ==========================================
    async listDepartments(tenantId, plantId) {
        try {
            let query = (0, drizzle_orm_1.sql) `SELECT id, plant_id, code, name, manager_name, dept_head, cost_center, operating_shifts, status FROM public.departments`;
            if (plantId && plantId !== "ALL") {
                query = (0, drizzle_orm_1.sql) `SELECT id, plant_id, code, name, manager_name, dept_head, cost_center, operating_shifts, status FROM public.departments WHERE plant_id::text = ${plantId}`;
            }
            query = (0, drizzle_orm_1.sql) `${query} ORDER BY created_at ASC`;
            const res = await database_js_1.db.execute(query);
            const rows = res?.rows || (Array.isArray(res) ? res : []);
            return rows.map((d) => ({
                id: String(d.id),
                departmentId: String(d.id),
                plantId: d.plant_id || "",
                code: d.code,
                name: d.name,
                deptHead: d.dept_head || d.manager_name || "Department Lead",
                managerName: d.dept_head || d.manager_name || "Department Lead",
                costCenter: d.cost_center || "CC-101",
                operatingShifts: d.operating_shifts || "3 Shifts (24/7 Continuous)",
                status: d.status || "Active",
            }));
        }
        catch (err) {
            console.warn("DB listDepartments error:", err.message);
            return [];
        }
    }
    async createDepartment(tenantId, input) {
        let resolvedTenantId = tenantId;
        if (!resolvedTenantId) {
            const [t] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
            resolvedTenantId = t?.id;
        }
        const code = input.code ? String(input.code).trim().toUpperCase() : `DEP-${Date.now().toString().slice(-4)}`;
        const name = String(input.name || "Department").trim();
        const deptHead = input.deptHead || input.managerName || "Department Lead";
        const costCenter = input.costCenter || "CC-101";
        const operatingShifts = input.operatingShifts || "3 Shifts (24/7 Continuous)";
        const status = input.status || "Active";
        const plantId = input.plantId || null;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.departments (tenant_id, plant_id, code, name, manager_name, dept_head, cost_center, operating_shifts, status, is_active, created_at)
        VALUES (${resolvedTenantId || null}, ${plantId}, ${code}, ${name}, ${deptHead}, ${deptHead}, ${costCenter}, ${operatingShifts}, ${status}, ${status === "Active"}, NOW())
        RETURNING *
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            const newId = row?.id ? String(row.id) : `DEP-${Date.now().toString().slice(-4)}`;
            return {
                id: newId,
                departmentId: newId,
                plantId: plantId || "PLT-01",
                code,
                name,
                deptHead,
                managerName: deptHead,
                costCenter,
                operatingShifts,
                status,
            };
        }
        catch (err) {
            console.warn("DB createDepartment error:", err.message);
            throw err;
        }
    }
    async updateDepartment(tenantId, id, input) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.departments
        SET 
          name = COALESCE(${input.name || null}, name),
          code = COALESCE(${input.code ? String(input.code).trim().toUpperCase() : null}, code),
          dept_head = COALESCE(${input.deptHead || input.managerName || null}, dept_head),
          manager_name = COALESCE(${input.deptHead || input.managerName || null}, manager_name),
          cost_center = COALESCE(${input.costCenter || null}, cost_center),
          operating_shifts = COALESCE(${input.operatingShifts || null}, operating_shifts),
          status = COALESCE(${input.status || null}, status),
          is_active = COALESCE(${input.status ? input.status === "Active" : null}, is_active),
          plant_id = COALESCE(${input.plantId || null}, plant_id)
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);
            return { id, ...input };
        }
        catch (err) {
            console.warn("DB updateDepartment error:", err.message);
            return { id, ...input };
        }
    }
    async deleteDepartment(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.departments WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
            return { id, message: "Department deleted" };
        }
        catch (err) {
            console.warn("DB deleteDepartment error:", err.message);
            return { id, message: "Department deleted" };
        }
    }
    // ==========================================
    // 4. PRODUCTION LINES
    // ==========================================
    async listLines(tenantId, plantId) {
        try {
            let query = (0, drizzle_orm_1.sql) `SELECT * FROM public.production_lines`;
            if (plantId && plantId !== "ALL") {
                query = (0, drizzle_orm_1.sql) `SELECT * FROM public.production_lines WHERE plant_id::text = ${plantId} OR plant_name = ${plantId}`;
            }
            query = (0, drizzle_orm_1.sql) `${query} ORDER BY created_at DESC`;
            const res = await database_js_1.db.execute(query);
            const rows = res?.rows || (Array.isArray(res) ? res : []);
            return rows.map((l) => ({
                id: String(l.id),
                lineId: String(l.id),
                lineCode: l.line_code || l.code || `LINE-${String(l.id).substring(0, 4)}`,
                code: l.code || l.line_code || `LINE-${String(l.id).substring(0, 4)}`,
                name: l.name || "Production Line",
                plantId: l.plant_id ? String(l.plant_id) : "PLT-01",
                plantName: l.plant_name || "Main Facility",
                type: l.type || l.line_type || "Continuous Flow",
                lineType: l.line_type || "BOTTLING",
                ratedSpeed: l.rated_speed || (l.nominal_speed_bpm ? `${l.nominal_speed_bpm * 60} BPH` : "38,000 BPH"),
                ratedSpeedBPH: l.rated_speed_bph || (l.nominal_speed_bpm ? l.nominal_speed_bpm * 60 : 38000),
                status: l.status || "Active",
                healthScore: l.health_score || 95,
                supervisorId: l.supervisor_id || "EMP-005",
                supervisorName: l.supervisor_name || "David Kim",
                ratedOEE: l.rated_oee || "88.0%",
                currentRunningSku: l.current_running_sku || "SKU-5001"
            }));
        }
        catch (e) {
            console.warn("DB listLines error:", e.message);
            return [];
        }
    }
    async createLine(tenantId, input) {
        try {
            let resolvedTenantId = tenantId;
            if (!resolvedTenantId) {
                const [t] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
                resolvedTenantId = t?.id;
            }
            const code = (input.lineCode || input.code || `LINE-${Date.now().toString().slice(-4)}`).toUpperCase();
            const name = String(input.name || "Production Line").trim();
            const lineType = input.lineType || "BOTTLING";
            const ratedSpeed = input.ratedSpeed || "38,000 BPH";
            const ratedSpeedBPH = Number(input.ratedSpeedBPH) || 38000;
            const nominalSpeedBpm = ratedSpeedBPH ? Math.round(ratedSpeedBPH / 60) : 250;
            const status = input.status || "Active";
            const plantId = (input.plantId && input.plantId.length === 36 && input.plantId.includes("-")) ? input.plantId : null;
            const plantName = input.plantName || "Main Facility";
            const supervisorName = input.supervisorName || "David Kim";
            const supervisorId = input.supervisorId || "EMP-005";
            const ratedOee = input.ratedOEE || "88.0%";
            const currentRunningSku = input.currentRunningSku || "SKU-5001";
            const type = input.type || "Continuous Flow";
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.production_lines (
          tenant_id, plant_id, code, line_code, name, line_type, nominal_speed_bpm,
          rated_speed, rated_speed_bph, type, plant_name, supervisor_name, supervisor_id,
          rated_oee, current_running_sku, status, health_score, created_at
        ) VALUES (
          ${resolvedTenantId || null}, ${plantId}, ${code}, ${code}, ${name}, ${lineType}, ${nominalSpeedBpm},
          ${ratedSpeed}, ${ratedSpeedBPH}, ${type}, ${plantName}, ${supervisorName}, ${supervisorId},
          ${ratedOee}, ${currentRunningSku}, ${status}, 95, NOW()
        ) RETURNING *
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            const newId = row?.id ? String(row.id) : `LIN-${Date.now().toString().slice(-4)}`;
            return {
                id: newId,
                lineId: newId,
                code,
                lineCode: code,
                name,
                lineType,
                type,
                ratedSpeed,
                ratedSpeedBPH,
                status,
                plantId: input.plantId || "PLT-01",
                plantName,
                supervisorName,
                supervisorId,
                ratedOEE: ratedOee,
                currentRunningSku,
                healthScore: 95
            };
        }
        catch (err) {
            console.warn("DB createLine error:", err.message);
            throw err;
        }
    }
    async updateLine(tenantId, id, input) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.production_lines
        SET 
          name = COALESCE(${input.name || null}, name),
          code = COALESCE(${input.code || input.lineCode || null}, code),
          line_code = COALESCE(${input.lineCode || input.code || null}, line_code),
          line_type = COALESCE(${input.lineType || null}, line_type),
          type = COALESCE(${input.type || null}, type),
          rated_speed = COALESCE(${input.ratedSpeed || null}, rated_speed),
          rated_speed_bph = COALESCE(${input.ratedSpeedBPH != null ? Number(input.ratedSpeedBPH) : null}, rated_speed_bph),
          status = COALESCE(${input.status || null}, status),
          plant_name = COALESCE(${input.plantName || null}, plant_name),
          supervisor_name = COALESCE(${input.supervisorName || null}, supervisor_name),
          updated_at = NOW()
        WHERE id::text = ${id} OR code = ${id} OR line_code = ${id}
      `);
            return { id, ...input };
        }
        catch (err) {
            console.warn("DB updateLine error:", err.message);
            return { id, ...input };
        }
    }
    async deleteLine(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.production_lines
        WHERE id::text = ${id} OR code = ${id} OR line_code = ${id}
      `);
            return { id, message: "Line deleted successfully" };
        }
        catch (err) {
            console.warn("DB deleteLine error:", err.message);
            return { id, message: "Line deleted" };
        }
    }
    // ==========================================
    // 5. WORK CENTERS
    // ==========================================
    async listWorkCenters(tenantId, plantId) {
        try {
            let query = (0, drizzle_orm_1.sql) `SELECT * FROM public.work_centers`;
            if (plantId && plantId !== "ALL") {
                query = (0, drizzle_orm_1.sql) `SELECT * FROM public.work_centers WHERE plant_id::text = ${plantId}`;
            }
            query = (0, drizzle_orm_1.sql) `${query} ORDER BY created_at DESC`;
            const res = await database_js_1.db.execute(query);
            const rows = res?.rows || (Array.isArray(res) ? res : []);
            return rows.map((w) => ({
                id: String(w.id),
                workCenterId: String(w.id),
                code: w.code,
                name: w.name,
                category: w.category || "PACKAGING",
                capacity: w.capacity || (w.capacity_per_hour ? `${w.capacity_per_hour} Units/Hr` : "38,000 BPH"),
                lineId: w.line_id || "LIN-01",
                lineName: w.line_name || "Line 1",
                plantId: w.plant_id ? String(w.plant_id) : "PLT-01",
                status: w.status || (w.is_active ? "Active" : "Inactive"),
            }));
        }
        catch (err) {
            console.warn("DB listWorkCenters error:", err.message);
            return [];
        }
    }
    async createWorkCenter(tenantId, input) {
        try {
            let resolvedTenantId = tenantId;
            if (!resolvedTenantId) {
                const [t] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
                resolvedTenantId = t?.id;
            }
            const code = input.code ? String(input.code).trim().toUpperCase() : `WC-${Date.now().toString().slice(-4)}`;
            const name = String(input.name || "Work Center").trim();
            const category = input.category || "PACKAGING";
            const capacity = input.capacity || "38,000 BPH";
            const lineId = input.lineId || "LIN-01";
            const lineName = input.lineName || "Line 1";
            const status = input.status || "Active";
            const plantId = (input.plantId && input.plantId.length === 36 && input.plantId.includes("-")) ? input.plantId : null;
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.work_centers (
          tenant_id, plant_id, code, name, category, capacity, line_id, line_name, status, is_active, created_at
        ) VALUES (
          ${resolvedTenantId || null}, ${plantId}, ${code}, ${name}, ${category}, ${capacity}, ${lineId}, ${lineName}, ${status}, ${status === "Active"}, NOW()
        ) RETURNING *
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            const newId = row?.id ? String(row.id) : `WC-${Date.now().toString().slice(-4)}`;
            return {
                id: newId,
                workCenterId: newId,
                code,
                name,
                category,
                capacity,
                lineId,
                lineName,
                plantId: input.plantId || "PLT-01",
                status
            };
        }
        catch (err) {
            console.warn("DB createWorkCenter error:", err.message);
            throw err;
        }
    }
    async updateWorkCenter(tenantId, id, input) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.work_centers
        SET 
          name = COALESCE(${input.name || null}, name),
          code = COALESCE(${input.code || null}, code),
          category = COALESCE(${input.category || null}, category),
          capacity = COALESCE(${input.capacity || null}, capacity),
          line_id = COALESCE(${input.lineId || null}, line_id),
          line_name = COALESCE(${input.lineName || null}, line_name),
          status = COALESCE(${input.status || null}, status),
          is_active = COALESCE(${input.status ? input.status === "Active" : null}, is_active),
          updated_at = NOW()
        WHERE id::text = ${id} OR code = ${id}
      `);
            return { id, ...input };
        }
        catch (err) {
            console.warn("DB updateWorkCenter error:", err.message);
            return { id, ...input };
        }
    }
    async deleteWorkCenter(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.work_centers
        WHERE id::text = ${id} OR code = ${id} OR name = ${id}
      `);
            return { id, message: "Work Center deleted successfully" };
        }
        catch (err) {
            console.warn("DB deleteWorkCenter error:", err.message);
            return { id, message: "Work Center deleted" };
        }
    }
    // ==========================================
    // 6. STANDARD OPERATIONS
    // ==========================================
    async listOperations(tenantId, department) {
        try {
            const query = (department && department !== "ALL")
                ? (0, drizzle_orm_1.sql) `SELECT id, operation_code AS "operationCode", operation_code AS code, name, sequence, department, std_duration_min AS "stdDurationMin", setup_duration_min AS "setupDurationMin", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM public.operations WHERE department = ${department} ORDER BY sequence ASC`
                : (0, drizzle_orm_1.sql) `SELECT id, operation_code AS "operationCode", operation_code AS code, name, sequence, department, std_duration_min AS "stdDurationMin", setup_duration_min AS "setupDurationMin", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM public.operations ORDER BY sequence ASC`;
            const result = await database_js_1.db.execute(query);
            if (result.rows && result.rows.length > 0) {
                return result.rows.map((r) => ({
                    id: r.id,
                    operationId: r.id,
                    operationCode: r.operationCode || r.code,
                    code: r.operationCode || r.code,
                    name: r.name,
                    sequence: Number(r.sequence) || 10,
                    department: r.department || "Packaging",
                    stdDurationMin: Number(r.stdDurationMin) || 45,
                    setupDurationMin: Number(r.setupDurationMin) || 15,
                    status: r.status || "Active",
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }));
            }
        }
        catch (err) {
            console.warn("DB listOperations error:", err.message);
        }
        if (department && department !== "ALL") {
            return tenantId ? [] : inMemoryOperations.filter((o) => o.department === department);
        }
        return tenantId ? [] : inMemoryOperations;
    }
    async createOperation(tenantId, input) {
        const codeVal = (input.operationCode || input.code || `OP-${Date.now().toString().slice(-4)}`).toUpperCase();
        const seq = Number(input.sequence) || (inMemoryOperations.length + 1) * 10;
        const dept = input.department || "Packaging";
        const stdDur = Number(input.stdDurationMin || input.stdTimeMins) || 45;
        const setupDur = Number(input.setupDurationMin) || 15;
        const stat = input.status || "Active";
        const nameVal = input.name || "New Operation";
        let dbId;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.operations (operation_code, name, sequence, department, std_duration_min, setup_duration_min, status, created_at, updated_at)
        VALUES (${codeVal}, ${nameVal}, ${seq}, ${dept}, ${stdDur}, ${setupDur}, ${stat}, NOW(), NOW())
        ON CONFLICT (operation_code) DO UPDATE 
        SET name = EXCLUDED.name, sequence = EXCLUDED.sequence, department = EXCLUDED.department, std_duration_min = EXCLUDED.std_duration_min, setup_duration_min = EXCLUDED.setup_duration_min, status = EXCLUDED.status, updated_at = NOW()
        RETURNING id, operation_code, name, sequence, department, std_duration_min, setup_duration_min, status
      `);
            if (res.rows && res.rows.length > 0) {
                dbId = res.rows[0].id;
            }
        }
        catch (err) {
            console.warn("DB createOperation error:", err.message);
        }
        const newOp = {
            id: dbId || `OP-0${inMemoryOperations.length + 1}`,
            operationId: dbId || `OP-0${inMemoryOperations.length + 1}`,
            operationCode: codeVal,
            code: codeVal,
            name: nameVal,
            sequence: seq,
            department: dept,
            stdDurationMin: stdDur,
            setupDurationMin: setupDur,
            status: stat,
        };
        inMemoryOperations.unshift(newOp);
        return newOp;
    }
    async updateOperation(tenantId, id, input) {
        try {
            const codeVal = input.operationCode || input.code;
            const nameVal = input.name;
            const seq = input.sequence !== undefined ? Number(input.sequence) : null;
            const dept = input.department;
            const stdDur = input.stdDurationMin !== undefined ? Number(input.stdDurationMin) : null;
            const setupDur = input.setupDurationMin !== undefined ? Number(input.setupDurationMin) : null;
            const stat = input.status;
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.operations
        SET 
          name = COALESCE(${nameVal}, name),
          sequence = COALESCE(${seq}, sequence),
          department = COALESCE(${dept}, department),
          std_duration_min = COALESCE(${stdDur}, std_duration_min),
          setup_duration_min = COALESCE(${setupDur}, setup_duration_min),
          status = COALESCE(${stat}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR operation_code = ${id} OR lower(operation_code) = lower(${id})
      `);
        }
        catch (err) {
            console.warn("DB updateOperation error:", err.message);
        }
        const idx = inMemoryOperations.findIndex((o) => matchKey(o, id, ["id", "operationId", "operationCode", "code", "name"]));
        if (idx === -1) {
            const fallback = {
                id,
                operationId: id,
                operationCode: input.operationCode || input.code || id,
                name: input.name || "Standard Operation",
                sequence: Number(input.sequence) || 10,
                department: input.department || "Packaging",
                stdDurationMin: Number(input.stdDurationMin) || 45,
                setupDurationMin: Number(input.setupDurationMin) || 15,
                status: input.status || "Active",
            };
            inMemoryOperations.push(fallback);
            return fallback;
        }
        inMemoryOperations[idx] = {
            ...inMemoryOperations[idx],
            ...input,
            id: inMemoryOperations[idx].id,
            operationId: inMemoryOperations[idx].operationId || inMemoryOperations[idx].id,
        };
        return inMemoryOperations[idx];
    }
    async deleteOperation(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.operations WHERE id::text = ${id} OR operation_code = ${id} OR lower(operation_code) = lower(${id})`);
        }
        catch (err) {
            console.warn("DB deleteOperation error:", err.message);
        }
        const idx = inMemoryOperations.findIndex((o) => matchKey(o, id, ["id", "operationId", "operationCode", "code", "name"]));
        if (idx !== -1) {
            const deleted = inMemoryOperations.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Operation deleted" };
    }
    // ==========================================
    // ==========================================
    // 7. ROUTINGS MASTER
    // ==========================================
    async listRoutings(tenantId) {
        try {
            const dbRoutings = await database_js_1.db
                .select({
                id: masterData_js_1.routings.id,
                routingCode: masterData_js_1.routings.routingCode,
                skuId: masterData_js_1.routings.skuId,
                skuCode: masterData_js_1.skus.skuCode,
                skuName: masterData_js_1.skus.name,
                lineId: masterData_js_1.routings.lineId,
                lineCode: masterData_js_1.productionLines.code,
                lineName: masterData_js_1.productionLines.name,
                revision: masterData_js_1.routings.revision,
                approvalStatus: masterData_js_1.routings.approvalStatus,
                status: masterData_js_1.routings.status,
                stdRunRateBPH: masterData_js_1.routings.stdRunRateBph,
                setupDurationMin: masterData_js_1.routings.setupDurationMin,
                expectedYieldPct: masterData_js_1.routings.expectedYieldPct,
                effectiveFrom: masterData_js_1.routings.effectiveFrom,
                effectiveTo: masterData_js_1.routings.effectiveTo,
                notes: masterData_js_1.routings.notes,
                createdAt: masterData_js_1.routings.createdAt,
                updatedAt: masterData_js_1.routings.updatedAt,
            })
                .from(masterData_js_1.routings)
                .leftJoin(masterData_js_1.skus, (0, drizzle_orm_1.eq)(masterData_js_1.routings.skuId, masterData_js_1.skus.id))
                .leftJoin(masterData_js_1.productionLines, (0, drizzle_orm_1.eq)(masterData_js_1.routings.lineId, masterData_js_1.productionLines.id))
                .where(tenantId ? (0, drizzle_orm_1.eq)(masterData_js_1.routings.tenantId, tenantId) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(masterData_js_1.routings.createdAt));
            if (dbRoutings && dbRoutings.length > 0) {
                const allSteps = await database_js_1.db.select().from(masterData_js_1.routingSteps).orderBy((0, drizzle_orm_1.asc)(masterData_js_1.routingSteps.sequence));
                const stepsByRoutingId = new Map();
                for (const step of allSteps) {
                    const list = stepsByRoutingId.get(step.routingId) || [];
                    list.push({
                        id: step.id,
                        sequence: step.sequence,
                        operationCode: step.operationCode,
                        operationName: step.operationName,
                        workCenterId: step.workCenterId,
                        stdDurationMin: Number(step.stdDurationMin),
                        setupDurationMin: Number(step.setupDurationMin),
                        crewSize: step.crewSize,
                        isQualityGate: step.isQualityGate,
                        instructions: step.instructions,
                    });
                    stepsByRoutingId.set(step.routingId, list);
                }
                const mapped = dbRoutings.map((r) => ({
                    id: r.id,
                    routingId: r.id,
                    routingCode: r.routingCode,
                    skuId: r.skuId,
                    skuCode: r.skuCode || "SKU-5001",
                    skuName: r.skuName || "Product",
                    lineId: r.lineId || "LIN-01",
                    lineCode: r.lineCode || "LINE-1",
                    lineName: r.lineName || "Line 1",
                    revision: r.revision,
                    approvalStatus: r.approvalStatus,
                    status: r.status,
                    stdRunRateBPH: r.stdRunRateBPH,
                    setupDurationMin: r.setupDurationMin,
                    expectedYieldPct: Number(r.expectedYieldPct),
                    effectiveFrom: r.effectiveFrom ? r.effectiveFrom.toISOString().substring(0, 10) : "2024-01-01",
                    effectiveTo: r.effectiveTo ? r.effectiveTo.toISOString().substring(0, 10) : "2030-12-31",
                    notes: r.notes || "",
                    steps: stepsByRoutingId.get(r.id) || [],
                }));
                return mapped;
            }
        }
        catch (err) {
            console.warn("Could not query DB routings, falling back to memory:", err.message);
        }
        return tenantId ? [] : inMemoryRoutings;
    }
    async getRoutingById(tenantId, id) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            const condition = isUUID ? (0, drizzle_orm_1.eq)(masterData_js_1.routings.id, id) : (0, drizzle_orm_1.eq)(masterData_js_1.routings.routingCode, id);
            const [r] = await database_js_1.db
                .select({
                id: masterData_js_1.routings.id,
                routingCode: masterData_js_1.routings.routingCode,
                skuId: masterData_js_1.routings.skuId,
                skuCode: masterData_js_1.skus.skuCode,
                skuName: masterData_js_1.skus.name,
                lineId: masterData_js_1.routings.lineId,
                lineCode: masterData_js_1.productionLines.code,
                lineName: masterData_js_1.productionLines.name,
                revision: masterData_js_1.routings.revision,
                approvalStatus: masterData_js_1.routings.approvalStatus,
                status: masterData_js_1.routings.status,
                stdRunRateBPH: masterData_js_1.routings.stdRunRateBph,
                setupDurationMin: masterData_js_1.routings.setupDurationMin,
                expectedYieldPct: masterData_js_1.routings.expectedYieldPct,
                effectiveFrom: masterData_js_1.routings.effectiveFrom,
                effectiveTo: masterData_js_1.routings.effectiveTo,
                notes: masterData_js_1.routings.notes,
                createdAt: masterData_js_1.routings.createdAt,
                updatedAt: masterData_js_1.routings.updatedAt,
            })
                .from(masterData_js_1.routings)
                .leftJoin(masterData_js_1.skus, (0, drizzle_orm_1.eq)(masterData_js_1.routings.skuId, masterData_js_1.skus.id))
                .leftJoin(masterData_js_1.productionLines, (0, drizzle_orm_1.eq)(masterData_js_1.routings.lineId, masterData_js_1.productionLines.id))
                .where(condition)
                .limit(1);
            if (r) {
                const steps = await database_js_1.db
                    .select()
                    .from(masterData_js_1.routingSteps)
                    .where((0, drizzle_orm_1.eq)(masterData_js_1.routingSteps.routingId, r.id))
                    .orderBy((0, drizzle_orm_1.asc)(masterData_js_1.routingSteps.sequence));
                return {
                    id: r.id,
                    routingId: r.id,
                    routingCode: r.routingCode,
                    skuId: r.skuId,
                    skuCode: r.skuCode || "SKU-5001",
                    skuName: r.skuName || "Product",
                    lineId: r.lineId || "LIN-01",
                    lineCode: r.lineCode || "LINE-1",
                    lineName: r.lineName || "Line 1",
                    revision: r.revision,
                    approvalStatus: r.approvalStatus,
                    status: r.status,
                    stdRunRateBPH: r.stdRunRateBPH,
                    setupDurationMin: r.setupDurationMin,
                    expectedYieldPct: Number(r.expectedYieldPct),
                    effectiveFrom: r.effectiveFrom ? r.effectiveFrom.toISOString().substring(0, 10) : "2024-01-01",
                    effectiveTo: r.effectiveTo ? r.effectiveTo.toISOString().substring(0, 10) : "2030-12-31",
                    notes: r.notes || "",
                    steps: steps.map((s) => ({
                        id: s.id,
                        sequence: s.sequence,
                        operationCode: s.operationCode,
                        operationName: s.operationName,
                        workCenterId: s.workCenterId,
                        stdDurationMin: Number(s.stdDurationMin),
                        setupDurationMin: Number(s.setupDurationMin),
                        crewSize: s.crewSize,
                        isQualityGate: s.isQualityGate,
                        instructions: s.instructions,
                    })),
                };
            }
        }
        catch (err) {
            console.warn("DB getRoutingById fallback:", err.message);
        }
        const found = inMemoryRoutings.find((r) => matchKey(r, id, ["id", "routingId", "routingCode"]));
        return found || null;
    }
    async createRouting(tenantId, input) {
        try {
            let resolvedTenantId = tenantId;
            if (!resolvedTenantId) {
                const [defaultTenant] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
                resolvedTenantId = defaultTenant?.id;
            }
            const isUuid = (val) => typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
            let resolvedSkuId = input.skuId;
            let skuCode = input.skuCode;
            let skuName = input.skuName;
            if (!isUuid(resolvedSkuId)) {
                const rawSku = input.skuCode || input.skuId || "";
                const [sku] = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, rawSku), (0, drizzle_orm_1.eq)(masterData_js_1.skus.name, rawSku), (0, drizzle_orm_1.ilike)(masterData_js_1.skus.skuCode, `%${rawSku}%`))).limit(1);
                if (sku) {
                    resolvedSkuId = sku.id;
                    skuCode = sku.skuCode;
                    skuName = sku.name;
                }
                else {
                    const [firstSku] = await database_js_1.db.select().from(masterData_js_1.skus).limit(1);
                    if (firstSku) {
                        resolvedSkuId = firstSku.id;
                        skuCode = firstSku.skuCode;
                        skuName = firstSku.name;
                    }
                }
            }
            else {
                const [sku] = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.id, resolvedSkuId)).limit(1);
                if (sku) {
                    skuCode = sku.skuCode;
                    skuName = sku.name;
                }
            }
            let resolvedLineId = input.lineId;
            let lineCode = input.lineCode;
            let lineName = input.lineName;
            if (!isUuid(resolvedLineId)) {
                const rawLine = input.lineCode || input.lineId || "LINE-1";
                const [line] = await database_js_1.db.select().from(masterData_js_1.productionLines).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.code, rawLine), (0, drizzle_orm_1.ilike)(masterData_js_1.productionLines.code, `%${rawLine}%`), (0, drizzle_orm_1.eq)(masterData_js_1.productionLines.name, rawLine))).limit(1);
                if (line) {
                    resolvedLineId = line.id;
                    lineCode = line.code;
                    lineName = line.name;
                }
                else {
                    const [firstLine] = await database_js_1.db.select().from(masterData_js_1.productionLines).limit(1);
                    if (firstLine) {
                        resolvedLineId = firstLine.id;
                        lineCode = firstLine.code;
                        lineName = firstLine.name;
                    }
                }
            }
            else {
                const [line] = await database_js_1.db.select().from(masterData_js_1.productionLines).where((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.id, resolvedLineId)).limit(1);
                if (line) {
                    lineCode = line.code;
                    lineName = line.name;
                }
            }
            const routingCode = (input.routingCode || `RTG-${skuCode || "5000"}-L1`).toUpperCase();
            const resolvedPlantId = isUuid(input.plantId) ? input.plantId : null;
            if (resolvedTenantId && resolvedSkuId) {
                const [inserted] = await database_js_1.db
                    .insert(masterData_js_1.routings)
                    .values({
                    tenantId: resolvedTenantId,
                    plantId: resolvedPlantId,
                    routingCode,
                    skuId: resolvedSkuId,
                    lineId: resolvedLineId || null,
                    revision: input.revision || "R1",
                    approvalStatus: input.approvalStatus || "Approved",
                    status: input.status || "Active",
                    stdRunRateBph: Number(input.stdRunRateBPH || input.stdRunRateBph) || 12000,
                    setupDurationMin: Number(input.setupDurationMin) || 45,
                    expectedYieldPct: String(input.expectedYieldPct || "98.50"),
                    effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom) : null,
                    effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
                    notes: input.notes || null,
                })
                    .returning();
                const createdSteps = [];
                if (Array.isArray(input.steps) && input.steps.length > 0) {
                    for (const s of input.steps) {
                        const [st] = await database_js_1.db
                            .insert(masterData_js_1.routingSteps)
                            .values({
                            routingId: inserted.id,
                            sequence: Number(s.sequence) || 10,
                            operationCode: s.operationCode || "OP-10",
                            operationName: s.operationName || "Operation",
                            workCenterId: s.workCenterId || null,
                            stdDurationMin: String(s.stdDurationMin || "15.00"),
                            setupDurationMin: String(s.setupDurationMin || "10.00"),
                            crewSize: Number(s.crewSize) || 2,
                            isQualityGate: Boolean(s.isQualityGate),
                            instructions: s.instructions || null,
                        })
                            .returning();
                        createdSteps.push({
                            id: st.id,
                            sequence: st.sequence,
                            operationCode: st.operationCode,
                            operationName: st.operationName,
                            workCenterId: st.workCenterId,
                            stdDurationMin: Number(st.stdDurationMin),
                            setupDurationMin: Number(st.setupDurationMin),
                            crewSize: st.crewSize,
                            isQualityGate: st.isQualityGate,
                            instructions: st.instructions,
                        });
                    }
                }
                const newRtg = {
                    id: inserted.id,
                    routingId: inserted.id,
                    routingCode: inserted.routingCode,
                    skuId: inserted.skuId,
                    skuCode: skuCode || "SKU-5001",
                    skuName: skuName || "Product",
                    lineId: inserted.lineId || "LIN-01",
                    lineCode: lineCode || "LINE-1",
                    lineName: lineName || "Line 1",
                    revision: inserted.revision,
                    approvalStatus: inserted.approvalStatus,
                    status: inserted.status,
                    stdRunRateBPH: inserted.stdRunRateBph,
                    setupDurationMin: inserted.setupDurationMin,
                    expectedYieldPct: Number(inserted.expectedYieldPct),
                    effectiveFrom: input.effectiveFrom || new Date().toISOString().substring(0, 10),
                    effectiveTo: input.effectiveTo || "2030-12-31",
                    notes: inserted.notes || "",
                    steps: createdSteps,
                };
                inMemoryRoutings.unshift(newRtg);
                return newRtg;
            }
        }
        catch (err) {
            console.warn("DB createRouting error, falling back to memory:", err.message);
        }
        const newId = `RTG-00${inMemoryRoutings.length + 1}`;
        const newRtg = {
            id: newId,
            routingId: newId,
            routingCode: (input.routingCode || `RTG-${input.skuCode || "5000"}-L1`).toUpperCase(),
            skuId: input.skuId,
            skuCode: input.skuCode || "SKU-5001",
            skuName: input.skuName || "Product",
            lineId: input.lineId || "LIN-01",
            lineCode: input.lineCode || "LINE-1",
            lineName: input.lineName || "High-Speed Bottling Line 1",
            revision: input.revision || "R1",
            approvalStatus: input.approvalStatus || "Approved",
            status: input.status || "Active",
            stdRunRateBPH: Number(input.stdRunRateBPH || input.stdRunRateBph) || 38000,
            setupDurationMin: Number(input.setupDurationMin) || 30,
            expectedYieldPct: Number(input.expectedYieldPct) || 99.0,
            effectiveFrom: input.effectiveFrom || new Date().toISOString().substring(0, 10),
            effectiveTo: input.effectiveTo || "2030-12-31",
            steps: input.steps || [],
        };
        inMemoryRoutings.unshift(newRtg);
        return newRtg;
    }
    async updateRouting(tenantId, id, input) {
        try {
            const updateData = { updatedAt: new Date() };
            if (input.routingCode)
                updateData.routingCode = input.routingCode.toUpperCase();
            if (input.revision)
                updateData.revision = input.revision;
            if (input.approvalStatus)
                updateData.approvalStatus = input.approvalStatus;
            if (input.status)
                updateData.status = input.status;
            if (input.stdRunRateBPH || input.stdRunRateBph)
                updateData.stdRunRateBph = Number(input.stdRunRateBPH || input.stdRunRateBph);
            if (input.setupDurationMin)
                updateData.setupDurationMin = Number(input.setupDurationMin);
            if (input.expectedYieldPct)
                updateData.expectedYieldPct = String(input.expectedYieldPct);
            if (input.effectiveFrom)
                updateData.effectiveFrom = new Date(input.effectiveFrom);
            if (input.effectiveTo)
                updateData.effectiveTo = new Date(input.effectiveTo);
            if (input.notes !== undefined)
                updateData.notes = input.notes;
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            const condition = isUUID ? (0, drizzle_orm_1.eq)(masterData_js_1.routings.id, id) : (0, drizzle_orm_1.eq)(masterData_js_1.routings.routingCode, id);
            const [updated] = await database_js_1.db
                .update(masterData_js_1.routings)
                .set(updateData)
                .where(condition)
                .returning();
            if (updated) {
                if (Array.isArray(input.steps)) {
                    await database_js_1.db.delete(masterData_js_1.routingSteps).where((0, drizzle_orm_1.eq)(masterData_js_1.routingSteps.routingId, updated.id));
                    for (const s of input.steps) {
                        await database_js_1.db.insert(masterData_js_1.routingSteps).values({
                            routingId: updated.id,
                            sequence: Number(s.sequence) || 10,
                            operationCode: s.operationCode || "OP-10",
                            operationName: s.operationName || "Operation",
                            workCenterId: s.workCenterId || null,
                            stdDurationMin: String(s.stdDurationMin || "15.00"),
                            setupDurationMin: String(s.setupDurationMin || "10.00"),
                            crewSize: Number(s.crewSize) || 2,
                            isQualityGate: Boolean(s.isQualityGate),
                            instructions: s.instructions || null,
                        });
                    }
                }
                return await this.getRoutingById(tenantId, updated.id);
            }
        }
        catch (err) {
            console.warn("DB updateRouting error, falling back to memory:", err.message);
        }
        const idx = inMemoryRoutings.findIndex((r) => matchKey(r, id, ["id", "routingId", "routingCode", "skuCode", "name"]));
        if (idx === -1) {
            const fallback = {
                id,
                routingId: id,
                routingCode: input.routingCode || id,
                skuCode: input.skuCode || "SKU-5001",
                skuName: input.skuName || "Product",
                lineId: input.lineId || "LIN-01",
                lineName: input.lineName || "Line 1",
                revision: input.revision || "R1",
                approvalStatus: input.approvalStatus || "Approved",
                effectiveFrom: input.effectiveFrom || "2024-01-01",
                effectiveTo: input.effectiveTo || "2030-12-31",
                stdRunRateBPH: 38000,
                setupDurationMin: 30,
                expectedYieldPct: 99.0,
                status: "Active",
            };
            inMemoryRoutings.push(fallback);
            return fallback;
        }
        inMemoryRoutings[idx] = {
            ...inMemoryRoutings[idx],
            ...input,
            id: inMemoryRoutings[idx].id,
            routingId: inMemoryRoutings[idx].routingId || inMemoryRoutings[idx].id,
        };
        return inMemoryRoutings[idx];
    }
    async updateRoutingStatus(tenantId, id, input) {
        return this.updateRouting(tenantId, id, input);
    }
    async deleteRouting(tenantId, id) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            const condition = isUUID ? (0, drizzle_orm_1.eq)(masterData_js_1.routings.id, id) : (0, drizzle_orm_1.eq)(masterData_js_1.routings.routingCode, id);
            await database_js_1.db.delete(masterData_js_1.routings).where(condition);
        }
        catch (err) {
            console.warn("DB deleteRouting error:", err.message);
        }
        const idx = inMemoryRoutings.findIndex((r) => matchKey(r, id, ["id", "routingId", "routingCode", "skuCode", "name"]));
        if (idx !== -1) {
            const deleted = inMemoryRoutings.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Routing deleted" };
    }
    // ==========================================
    // 8. PRODUCT FAMILIES
    // ==========================================
    async listProductFamilies(tenantId) {
        try {
            const query = tenantId
                ? (0, drizzle_orm_1.sql) `
            SELECT id, code, name, category, description, plant_id, allergen_risk, standard_margin, status, created_at
            FROM public.product_families
            WHERE tenant_id = ${tenantId}
            ORDER BY created_at ASC
          `
                : (0, drizzle_orm_1.sql) `
            SELECT id, code, name, category, description, plant_id, allergen_risk, standard_margin, status, created_at
            FROM public.product_families
            ORDER BY created_at ASC
          `;
            const dbFamilies = await database_js_1.db.execute(query);
            const rows = dbFamilies?.rows || (Array.isArray(dbFamilies) ? dbFamilies : []);
            if (rows.length > 0) {
                return rows.map((r) => ({
                    id: String(r.id),
                    familyId: String(r.id),
                    code: r.code,
                    name: r.name,
                    category: r.category || "BEVERAGE",
                    description: r.description || "",
                    plantId: r.plant_id || "PLT-01",
                    allergenRisk: r.allergen_risk || "None",
                    standardMargin: r.standard_margin || "55.0%",
                    status: r.status || "Active",
                    skusCount: 0,
                }));
            }
        }
        catch (err) {
            console.warn("DB listProductFamilies error:", err.message);
        }
        return tenantId ? [] : inMemoryProductFamilies;
    }
    async createProductFamily(tenantId, input) {
        const code = (input.code ? String(input.code).trim().toUpperCase() : `PF-${Date.now()}`);
        const name = String(input.name || "Product Family").trim();
        const category = input.category || "BEVERAGE";
        const description = input.description || "";
        const plantId = input.plantId || "PLT-01";
        const allergenRisk = input.allergenRisk || "None";
        const standardMargin = input.standardMargin || "55.0%";
        const status = input.status || "Active";
        let dbId = null;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.product_families (code, name, category, description, plant_id, allergen_risk, standard_margin, status)
        VALUES (${code}, ${name}, ${category}, ${description}, ${plantId}, ${allergenRisk}, ${standardMargin}, ${status})
        RETURNING id, code, name, category, description, plant_id, allergen_risk, standard_margin, status
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            if (row?.id) {
                dbId = String(row.id);
            }
        }
        catch (err) {
            console.warn("DB insert public.product_families error:", err.message);
        }
        const newId = dbId || `PF-0${inMemoryProductFamilies.length + 1}`;
        const newFamily = {
            id: newId,
            familyId: newId,
            code,
            name,
            category,
            description,
            status,
            skusCount: Number(input.skusCount) || 0,
        };
        inMemoryProductFamilies.unshift(newFamily);
        return newFamily;
    }
    async updateProductFamily(tenantId, id, input) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.product_families
        SET 
          name = COALESCE(${input.name || null}, name),
          code = COALESCE(${input.code || null}, code),
          category = COALESCE(${input.category || null}, category),
          description = COALESCE(${input.description || null}, description),
          plant_id = COALESCE(${input.plantId || null}, plant_id),
          allergen_risk = COALESCE(${input.allergenRisk || null}, allergen_risk),
          standard_margin = COALESCE(${input.standardMargin || null}, standard_margin),
          status = COALESCE(${input.status || null}, status),
          updated_at = now()
        WHERE id::text = ${id} OR code = ${id}
      `);
        }
        catch (err) {
            console.warn("DB update public.product_families error:", err.message);
        }
        const idx = inMemoryProductFamilies.findIndex((f) => matchKey(f, id, ["id", "familyId", "code", "name"]));
        if (idx === -1) {
            const fallback = {
                id,
                familyId: id,
                code: input.code || id,
                name: input.name || "Product Family",
                category: input.category || "BEVERAGE",
                status: input.status || "Active",
            };
            inMemoryProductFamilies.push(fallback);
            return fallback;
        }
        inMemoryProductFamilies[idx] = { ...inMemoryProductFamilies[idx], ...input };
        return inMemoryProductFamilies[idx];
    }
    async deleteProductFamily(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.product_families
        WHERE id::text = ${id} OR code = ${id} OR name = ${id}
      `);
        }
        catch (err) {
            console.warn("DB delete public.product_families error:", err.message);
        }
        const idx = inMemoryProductFamilies.findIndex((f) => matchKey(f, id, ["id", "familyId", "code", "name"]));
        if (idx !== -1) {
            const deleted = inMemoryProductFamilies.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Product Family deleted" };
    }
    // ==========================================
    // 9. UOMS
    // ==========================================
    async listUoms(tenantId) {
        try {
            const dbUoms = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT id, code, name, category, type, base_unit, conversion_factor, status, created_at
        FROM public.uoms
        ORDER BY created_at ASC
      `);
            const rows = dbUoms?.rows || (Array.isArray(dbUoms) ? dbUoms : []);
            if (rows.length > 0) {
                return rows.map((r) => ({
                    id: String(r.id),
                    uomId: String(r.id),
                    code: r.code,
                    uomCode: r.code,
                    name: r.name,
                    category: r.category || "Count",
                    type: r.type || r.category || "Packaging",
                    baseUnit: r.base_unit || "EA",
                    baseUom: r.base_unit || "EA",
                    conversionFactor: Number(r.conversion_factor) || 1.0,
                    factor: Number(r.conversion_factor) || 1.0,
                    status: r.status || "Active",
                }));
            }
        }
        catch (err) {
            console.warn("DB listUoms error:", err.message);
        }
        return tenantId ? [] : inMemoryUoms;
    }
    async createUom(tenantId, input) {
        const code = (input.uomCode || input.code || `UOM-${Date.now()}`).toUpperCase().trim();
        const name = String(input.name || "UOM").trim();
        const category = input.category || input.type || "Count";
        const type = input.type || input.category || "Packaging";
        const baseUnit = input.baseUom || input.baseUnit || "EA";
        const factor = Number(input.conversionFactor || input.factor) || 1.0;
        const status = input.status || "Active";
        let dbId = null;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.uoms (code, name, category, type, base_unit, conversion_factor, status)
        VALUES (${code}, ${name}, ${category}, ${type}, ${baseUnit}, ${factor}, ${status})
        RETURNING id, code, name, category, type, base_unit, conversion_factor, status
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            if (row?.id) {
                dbId = String(row.id);
            }
        }
        catch (err) {
            console.warn("DB insert public.uoms error:", err.message);
        }
        const newId = dbId || `UOM-0${inMemoryUoms.length + 1}`;
        const newUom = {
            id: newId,
            uomId: newId,
            code,
            name,
            category,
            baseUnit,
            conversionFactor: factor,
            status,
        };
        inMemoryUoms.unshift(newUom);
        return { ...newUom, uomCode: code, baseUom: baseUnit, type, factor };
    }
    async updateUom(tenantId, id, input) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.uoms
        SET 
          name = COALESCE(${input.name || null}, name),
          code = COALESCE(${input.uomCode || input.code || null}, code),
          category = COALESCE(${input.category || input.type || null}, category),
          type = COALESCE(${input.type || input.category || null}, type),
          base_unit = COALESCE(${input.baseUom || input.baseUnit || null}, base_unit),
          conversion_factor = COALESCE(${input.conversionFactor || input.factor || null}, conversion_factor),
          status = COALESCE(${input.status || null}, status),
          updated_at = now()
        WHERE id::text = ${id} OR code = ${id}
      `);
        }
        catch (err) {
            console.warn("DB update public.uoms error:", err.message);
        }
        const idx = inMemoryUoms.findIndex((u) => matchKey(u, id, ["id", "uomId", "code", "name"]));
        if (idx !== -1) {
            inMemoryUoms[idx] = { ...inMemoryUoms[idx], ...input };
            return inMemoryUoms[idx];
        }
        return { id, ...input };
    }
    async deleteUom(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.uoms
        WHERE id::text = ${id} OR code = ${id} OR name = ${id}
      `);
        }
        catch (err) {
            console.warn("DB delete public.uoms error:", err.message);
        }
        const idx = inMemoryUoms.findIndex((u) => matchKey(u, id, ["id", "uomId", "code", "name"]));
        if (idx !== -1) {
            const deleted = inMemoryUoms.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "UOM deleted" };
    }
    // ==========================================
    // 10. PACK CONFIGS (PACKAGING)
    // ==========================================
    async listPackConfigs(tenantId) {
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          id, pack_code, name, sku_id, sku_code, sku_name,
          units_per_pack, pack_type, case_configuration,
          pallet_configuration, pallet_count, packaging_uom,
          tare_weight_kg, gross_weight_kg, status, created_at
        FROM public.packaging
        ORDER BY created_at ASC
      `);
            const rows = res?.rows || (Array.isArray(res) ? res : []);
            if (rows && rows.length > 0) {
                return rows.map((r) => ({
                    id: String(r.id),
                    configId: String(r.id),
                    packConfigId: String(r.id),
                    packCode: r.pack_code,
                    code: r.pack_code,
                    name: r.name || r.sku_name || "",
                    skuName: r.sku_name || "",
                    skuCode: r.sku_code || "",
                    skuId: r.sku_id || "",
                    unitsPerPack: Number(r.units_per_pack) || 24,
                    primaryUnitCount: Number(r.units_per_pack) || 24,
                    packType: r.pack_type || "Corrugated Tray & Shrink Wrap",
                    packagingType: r.pack_type || "Corrugated Tray & Shrink Wrap",
                    caseConfiguration: r.case_configuration || "",
                    palletConfiguration: r.pallet_configuration || "",
                    palletCount: Number(r.pallet_count) || 60,
                    packagingUom: r.packaging_uom || "CASE-24",
                    tareWeightKg: Number(r.tare_weight_kg) || 12.5,
                    grossWeightKg: Number(r.gross_weight_kg) || 12.5,
                    status: r.status || "Active",
                    created_at: r.created_at
                }));
            }
        }
        catch (err) {
            console.warn("DB listPackConfigs error:", err.message);
        }
        return tenantId ? [] : inMemoryPackConfigs;
    }
    async createPackConfig(tenantId, input) {
        const packCode = (input.packCode || input.code || `PC-${Date.now()}`).toUpperCase().trim();
        const name = String(input.name || input.skuName || "").trim();
        const skuId = input.skuId || "";
        const skuCode = input.skuCode || "";
        const skuName = input.skuName || "";
        const unitsPerPack = Number(input.unitsPerPack || input.primaryUnitCount) || 24;
        const packType = input.packType || input.packagingType || "Corrugated Tray & Shrink Wrap";
        const caseConfiguration = input.caseConfiguration || "";
        const palletConfiguration = input.palletConfiguration || "";
        const palletCount = Number(input.palletCount) || 60;
        const packagingUom = input.packagingUom || "CASE-24";
        const tareWeightKg = Number(input.tareWeightKg) || 12.5;
        const grossWeightKg = Number(input.grossWeightKg || input.tareWeightKg) || 12.5;
        const status = input.status || "Active";
        let dbId = null;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.packaging (
          pack_code, name, sku_id, sku_code, sku_name,
          units_per_pack, pack_type, case_configuration,
          pallet_configuration, pallet_count, packaging_uom,
          tare_weight_kg, gross_weight_kg, status
        )
        VALUES (
          ${packCode}, ${name}, ${skuId}, ${skuCode}, ${skuName},
          ${unitsPerPack}, ${packType}, ${caseConfiguration},
          ${palletConfiguration}, ${palletCount}, ${packagingUom},
          ${tareWeightKg}, ${grossWeightKg}, ${status}
        )
        RETURNING id, pack_code, name, sku_id, sku_code, sku_name, units_per_pack, pack_type, case_configuration, pallet_configuration, pallet_count, packaging_uom, tare_weight_kg, gross_weight_kg, status
      `);
            const row = res?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
            if (row?.id) {
                dbId = String(row.id);
            }
        }
        catch (err) {
            console.warn("DB insert public.packaging error:", err.message);
        }
        const newId = dbId || `PC-0${inMemoryPackConfigs.length + 1}`;
        const newConfig = {
            id: newId,
            configId: newId,
            packConfigId: newId,
            packCode,
            code: packCode,
            skuName,
            name: name || skuName,
            skuCode,
            skuId,
            unitsPerPack,
            primaryUnitCount: unitsPerPack,
            packType,
            packagingType: packType,
            caseConfiguration,
            palletConfiguration,
            palletCount,
            packagingUom,
            tareWeightKg,
            grossWeightKg,
            status,
        };
        inMemoryPackConfigs.unshift(newConfig);
        return newConfig;
    }
    async updatePackConfig(tenantId, id, input) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.packaging
        SET 
          pack_code = COALESCE(${input.packCode || input.code || null}, pack_code),
          name = COALESCE(${input.name || null}, name),
          sku_id = COALESCE(${input.skuId || null}, sku_id),
          sku_code = COALESCE(${input.skuCode || null}, sku_code),
          sku_name = COALESCE(${input.skuName || null}, sku_name),
          units_per_pack = COALESCE(${input.unitsPerPack != null ? Number(input.unitsPerPack) : null}, units_per_pack),
          pack_type = COALESCE(${input.packType || input.packagingType || null}, pack_type),
          case_configuration = COALESCE(${input.caseConfiguration || null}, case_configuration),
          pallet_configuration = COALESCE(${input.palletConfiguration || null}, pallet_configuration),
          pallet_count = COALESCE(${input.palletCount != null ? Number(input.palletCount) : null}, pallet_count),
          packaging_uom = COALESCE(${input.packagingUom || null}, packaging_uom),
          tare_weight_kg = COALESCE(${input.tareWeightKg != null ? Number(input.tareWeightKg) : null}, tare_weight_kg),
          gross_weight_kg = COALESCE(${input.grossWeightKg != null ? Number(input.grossWeightKg) : null}, gross_weight_kg),
          status = COALESCE(${input.status || null}, status),
          updated_at = now()
        WHERE id::text = ${id} OR pack_code = ${id}
      `);
        }
        catch (err) {
            console.warn("DB update public.packaging error:", err.message);
        }
        const idx = inMemoryPackConfigs.findIndex((p) => matchKey(p, id, ["id", "configId", "packConfigId", "code", "packCode", "name"]));
        if (idx !== -1) {
            inMemoryPackConfigs[idx] = { ...inMemoryPackConfigs[idx], ...input };
            return inMemoryPackConfigs[idx];
        }
        return { id, ...input };
    }
    async deletePackConfig(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.packaging
        WHERE id::text = ${id} OR pack_code = ${id}
      `);
        }
        catch (err) {
            console.warn("DB delete public.packaging error:", err.message);
        }
        const idx = inMemoryPackConfigs.findIndex((p) => matchKey(p, id, ["id", "configId", "packConfigId", "code", "packCode", "name"]));
        if (idx !== -1) {
            const deleted = inMemoryPackConfigs.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Packaging configuration deleted" };
    }
    // ==========================================
    // 11. LINE TARGETS
    // ==========================================
    async listLineTargets(tenantId) {
        if (tenantId) {
            return [];
        }
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          id,
          target_id AS "targetId",
          plant_id AS "plantId",
          line_id AS "lineId",
          line_name AS "lineName",
          sku_id AS "skuId",
          sku_code AS "skuCode",
          sku_name AS "skuName",
          shift,
          target_quantity AS "targetQuantity",
          target_hb AS "targetHB",
          std_run_rate AS "stdRunRate",
          planned_oee AS "plannedOEE",
          planned_oee AS "oeeTargetPct",
          planned_units_per_hour AS "plannedUnitsPerHour",
          planned_yield_pct AS "plannedYieldPct",
          changeover_time_min AS "changeoverTimeMin",
          status,
          effective_date AS "effectiveDate",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.line_targets
        ORDER BY created_at ASC
      `);
            if (res.rows && res.rows.length > 0) {
                return res.rows.map((r) => ({
                    id: r.id,
                    targetId: r.targetId || r.id,
                    plantId: r.plantId || "PLT-01",
                    lineId: r.lineId || "LIN-01",
                    lineName: r.lineName || "Production Line",
                    skuId: r.skuId || "SKU-001",
                    skuCode: r.skuCode || "SKU-5001",
                    skuName: r.skuName || "Product",
                    shift: r.shift || "Morning Shift (A)",
                    targetQuantity: Number(r.targetQuantity) || 0,
                    targetHB: r.targetHB || `${Number(r.plannedUnitsPerHour || 36000).toLocaleString()} Units/Hour`,
                    stdRunRate: Number(r.stdRunRate) || 38000,
                    plannedOEE: Number(r.plannedOEE || r.oeeTargetPct) || 88.5,
                    oeeTargetPct: Number(r.oeeTargetPct || r.plannedOEE) || 88.5,
                    plannedUnitsPerHour: Number(r.plannedUnitsPerHour) || 36000,
                    plannedYieldPct: Number(r.plannedYieldPct) || 99.0,
                    changeoverTimeMin: Number(r.changeoverTimeMin) || 20,
                    status: r.status || "Active",
                    effectiveDate: r.effectiveDate || "2024-01-01",
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }));
            }
        }
        catch (err) {
            console.warn("DB listLineTargets error:", err.message);
        }
        return inMemoryLineTargets;
    }
    async createLineTarget(tenantId, input) {
        const targetIdVal = input.targetId || `TGT-0${inMemoryLineTargets.length + 1}`;
        const plantIdVal = input.plantId || "PLT-01";
        const lineIdVal = input.lineId || "LIN-01";
        const lineNameVal = input.lineName || "High-Speed Bottling Line 1";
        const skuIdVal = input.skuId || "SKU-001";
        const skuCodeVal = input.skuCode || "SKU-5001";
        const skuNameVal = input.skuName || "Citrus Burst Soda";
        const shiftVal = input.shift || "Morning Shift (A)";
        const targetQty = Number(input.targetQuantity) || 0;
        const targetHBVal = input.targetHB || "37,500 Bottles/Hour";
        const runRate = Number(input.stdRunRate) || 38000;
        const oee = Number(input.oeeTargetPct || input.plannedOEE) || 88.5;
        const unitsPerHour = Number(input.plannedUnitsPerHour) || (targetQty > 0 ? Math.round(targetQty / 8) : 36000);
        const yieldPct = Number(input.plannedYieldPct) || 99.0;
        const coTime = Number(input.changeoverTimeMin) || 20;
        const stat = input.status || "Active";
        const effDate = input.effectiveDate || new Date().toISOString().substring(0, 10);
        let dbId;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.line_targets (
          target_id, plant_id, line_id, line_name, sku_id, sku_code, sku_name, shift,
          target_quantity, target_hb, std_run_rate, planned_oee, planned_units_per_hour,
          planned_yield_pct, changeover_time_min, status, effective_date, created_at, updated_at
        ) VALUES (
          ${targetIdVal}, ${plantIdVal}, ${lineIdVal}, ${lineNameVal}, ${skuIdVal}, ${skuCodeVal}, ${skuNameVal}, ${shiftVal},
          ${targetQty}, ${targetHBVal}, ${runRate}, ${oee}, ${unitsPerHour},
          ${yieldPct}, ${coTime}, ${stat}, ${effDate}, NOW(), NOW()
        )
        ON CONFLICT (target_id) DO UPDATE SET
          plant_id = EXCLUDED.plant_id,
          line_id = EXCLUDED.line_id,
          line_name = EXCLUDED.line_name,
          sku_id = EXCLUDED.sku_id,
          sku_code = EXCLUDED.sku_code,
          sku_name = EXCLUDED.sku_name,
          shift = EXCLUDED.shift,
          target_quantity = EXCLUDED.target_quantity,
          target_hb = EXCLUDED.target_hb,
          std_run_rate = EXCLUDED.std_run_rate,
          planned_oee = EXCLUDED.planned_oee,
          planned_units_per_hour = EXCLUDED.planned_units_per_hour,
          planned_yield_pct = EXCLUDED.planned_yield_pct,
          changeover_time_min = EXCLUDED.changeover_time_min,
          status = EXCLUDED.status,
          effective_date = EXCLUDED.effective_date,
          updated_at = NOW()
        RETURNING id, target_id
      `);
            if (res.rows && res.rows.length > 0) {
                dbId = res.rows[0].id;
            }
        }
        catch (err) {
            console.warn("DB createLineTarget error:", err.message);
        }
        const newTarget = {
            id: dbId || targetIdVal,
            targetId: targetIdVal,
            plantId: plantIdVal,
            lineId: lineIdVal,
            lineName: lineNameVal,
            skuId: skuIdVal,
            skuCode: skuCodeVal,
            skuName: skuNameVal,
            shift: shiftVal,
            targetQuantity: targetQty,
            targetHB: targetHBVal,
            stdRunRate: runRate,
            plannedOEE: oee,
            oeeTargetPct: oee,
            plannedUnitsPerHour: unitsPerHour,
            plannedYieldPct: yieldPct,
            changeoverTimeMin: coTime,
            status: stat,
            effectiveDate: effDate,
        };
        inMemoryLineTargets.unshift(newTarget);
        return newTarget;
    }
    async updateLineTarget(tenantId, id, input) {
        try {
            const plantIdVal = input.plantId;
            const lineIdVal = input.lineId;
            const lineNameVal = input.lineName;
            const skuIdVal = input.skuId;
            const skuCodeVal = input.skuCode;
            const skuNameVal = input.skuName;
            const shiftVal = input.shift;
            const targetQty = input.targetQuantity !== undefined ? Number(input.targetQuantity) : null;
            const targetHBVal = input.targetHB;
            const runRate = input.stdRunRate !== undefined ? Number(input.stdRunRate) : null;
            const oee = input.oeeTargetPct !== undefined ? Number(input.oeeTargetPct) : (input.plannedOEE !== undefined ? Number(input.plannedOEE) : null);
            const unitsPerHour = input.plannedUnitsPerHour !== undefined ? Number(input.plannedUnitsPerHour) : null;
            const yieldPct = input.plannedYieldPct !== undefined ? Number(input.plannedYieldPct) : null;
            const coTime = input.changeoverTimeMin !== undefined ? Number(input.changeoverTimeMin) : null;
            const stat = input.status;
            const effDate = input.effectiveDate;
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.line_targets
        SET
          plant_id = COALESCE(${plantIdVal}, plant_id),
          line_id = COALESCE(${lineIdVal}, line_id),
          line_name = COALESCE(${lineNameVal}, line_name),
          sku_id = COALESCE(${skuIdVal}, sku_id),
          sku_code = COALESCE(${skuCodeVal}, sku_code),
          sku_name = COALESCE(${skuNameVal}, sku_name),
          shift = COALESCE(${shiftVal}, shift),
          target_quantity = COALESCE(${targetQty}, target_quantity),
          target_hb = COALESCE(${targetHBVal}, target_hb),
          std_run_rate = COALESCE(${runRate}, std_run_rate),
          planned_oee = COALESCE(${oee}, planned_oee),
          planned_units_per_hour = COALESCE(${unitsPerHour}, planned_units_per_hour),
          planned_yield_pct = COALESCE(${yieldPct}, planned_yield_pct),
          changeover_time_min = COALESCE(${coTime}, changeover_time_min),
          status = COALESCE(${stat}, status),
          effective_date = COALESCE(${effDate}, effective_date),
          updated_at = NOW()
        WHERE id::text = ${id} OR target_id = ${id} OR lower(target_id) = lower(${id})
      `);
        }
        catch (err) {
            console.warn("DB updateLineTarget error:", err.message);
        }
        const idx = inMemoryLineTargets.findIndex((t) => t.id === id || t.targetId === id);
        if (idx !== -1) {
            inMemoryLineTargets[idx] = { ...inMemoryLineTargets[idx], ...input };
            return inMemoryLineTargets[idx];
        }
        return { id, ...input };
    }
    async deleteLineTarget(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.line_targets WHERE id::text = ${id} OR target_id = ${id} OR lower(target_id) = lower(${id})`);
        }
        catch (err) {
            console.warn("DB deleteLineTarget error:", err.message);
        }
        const idx = inMemoryLineTargets.findIndex((t) => t.id === id || t.targetId === id);
        if (idx !== -1) {
            const deleted = inMemoryLineTargets.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Line Target deleted" };
    }
    // ==========================================
    // 12. CHANGEOVER MATRIX
    // ==========================================
    async listChangeoverRules(tenantId) {
        if (tenantId) {
            return [];
        }
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          id,
          matrix_id AS "matrixId",
          from_sku_id AS "fromSkuId",
          from_sku_code AS "fromSkuCode",
          from_family AS "fromFamily",
          to_sku_id AS "toSkuId",
          to_sku_code AS "toSkuCode",
          to_family AS "toFamily",
          changeover_duration_min AS "changeoverDurationMin",
          sanitation_class AS "sanitationClass",
          allergen_cleaning_required AS "allergenCleaningRequired",
          notes,
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.changeover_rules
        ORDER BY created_at ASC
      `);
            if (res.rows) {
                return res.rows.map((r) => ({
                    id: r.id,
                    matrixId: r.matrixId || r.id,
                    fromSkuId: r.fromSkuId || "SKU-001",
                    fromSkuCode: r.fromSkuCode || "SKU-5001",
                    fromFamily: r.fromFamily || "All Families",
                    toSkuId: r.toSkuId || "SKU-002",
                    toSkuCode: r.toSkuCode || "SKU-5002",
                    toFamily: r.toFamily || "All Families",
                    changeoverDurationMin: Number(r.changeoverDurationMin) || 0,
                    sanitationClass: r.sanitationClass || "Standard Rinse",
                    allergenCleaningRequired: Boolean(r.allergenCleaningRequired),
                    notes: r.notes || "",
                    status: r.status || "Active",
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }));
            }
        }
        catch (err) {
            console.warn("DB listChangeoverRules error:", err.message);
        }
        return inMemoryChangeoverRules;
    }
    async createChangeoverRule(tenantId, input) {
        const newId = input.id || input.matrixId || `CO-0${inMemoryChangeoverRules.length + 1}`;
        const matrixId = input.matrixId || newId;
        const fromSkuId = input.fromSkuId || "SKU-001";
        const fromSkuCode = input.fromSkuCode || "SKU-5001";
        const fromFamily = input.fromFamily || "All Families";
        const toSkuId = input.toSkuId || "SKU-002";
        const toSkuCode = input.toSkuCode || "SKU-5002";
        const toFamily = input.toFamily || "All Families";
        const duration = Number(input.changeoverDurationMin) || 0;
        const sanitation = input.sanitationClass || "Class B - Standard Rinse";
        const allergen = Boolean(input.allergenCleaningRequired);
        const notes = input.notes || "";
        const status = input.status || "Active";
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.changeover_rules (
          id, matrix_id, from_sku_id, from_sku_code, from_family,
          to_sku_id, to_sku_code, to_family, changeover_duration_min,
          sanitation_class, allergen_cleaning_required, notes, status,
          created_at, updated_at
        ) VALUES (
          ${newId}, ${matrixId}, ${fromSkuId}, ${fromSkuCode}, ${fromFamily},
          ${toSkuId}, ${toSkuCode}, ${toFamily}, ${duration},
          ${sanitation}, ${allergen}, ${notes}, ${status},
          NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          matrix_id = EXCLUDED.matrix_id,
          from_sku_id = EXCLUDED.from_sku_id,
          from_sku_code = EXCLUDED.from_sku_code,
          from_family = EXCLUDED.from_family,
          to_sku_id = EXCLUDED.to_sku_id,
          to_sku_code = EXCLUDED.to_sku_code,
          to_family = EXCLUDED.to_family,
          changeover_duration_min = EXCLUDED.changeover_duration_min,
          sanitation_class = EXCLUDED.sanitation_class,
          allergen_cleaning_required = EXCLUDED.allergen_cleaning_required,
          notes = EXCLUDED.notes,
          status = EXCLUDED.status,
          updated_at = NOW()
      `);
        }
        catch (err) {
            console.warn("DB createChangeoverRule error:", err.message);
        }
        const newRule = {
            id: newId,
            matrixId,
            fromSkuId,
            fromSkuCode,
            fromFamily,
            toSkuId,
            toSkuCode,
            toFamily,
            changeoverDurationMin: duration,
            sanitationClass: sanitation,
            allergenCleaningRequired: allergen,
            notes,
            status,
        };
        inMemoryChangeoverRules = [newRule, ...inMemoryChangeoverRules.filter((r) => r.id !== newId && r.matrixId !== matrixId)];
        return newRule;
    }
    async updateChangeoverRule(tenantId, id, input) {
        const fromSkuId = input.fromSkuId;
        const fromSkuCode = input.fromSkuCode;
        const fromFamily = input.fromFamily;
        const toSkuId = input.toSkuId;
        const toSkuCode = input.toSkuCode;
        const toFamily = input.toFamily;
        const duration = input.changeoverDurationMin !== undefined ? Number(input.changeoverDurationMin) : null;
        const sanitation = input.sanitationClass;
        const allergen = input.allergenCleaningRequired !== undefined ? Boolean(input.allergenCleaningRequired) : null;
        const notes = input.notes;
        const status = input.status;
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.changeover_rules SET
          from_sku_id = COALESCE(${fromSkuId}, from_sku_id),
          from_sku_code = COALESCE(${fromSkuCode}, from_sku_code),
          from_family = COALESCE(${fromFamily}, from_family),
          to_sku_id = COALESCE(${toSkuId}, to_sku_id),
          to_sku_code = COALESCE(${toSkuCode}, to_sku_code),
          to_family = COALESCE(${toFamily}, to_family),
          changeover_duration_min = COALESCE(${duration}, changeover_duration_min),
          sanitation_class = COALESCE(${sanitation}, sanitation_class),
          allergen_cleaning_required = COALESCE(${allergen}, allergen_cleaning_required),
          notes = COALESCE(${notes}, notes),
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR matrix_id = ${id} OR lower(matrix_id) = lower(${id})
      `);
        }
        catch (err) {
            console.warn("DB updateChangeoverRule error:", err.message);
        }
        const idx = inMemoryChangeoverRules.findIndex((r) => r.id === id || r.matrixId === id);
        if (idx !== -1) {
            inMemoryChangeoverRules[idx] = { ...inMemoryChangeoverRules[idx], ...input };
            return inMemoryChangeoverRules[idx];
        }
        return { id, ...input };
    }
    async deleteChangeoverRule(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        DELETE FROM public.changeover_rules 
        WHERE id::text = ${id} OR matrix_id = ${id} OR lower(matrix_id) = lower(${id})
      `);
        }
        catch (err) {
            console.warn("DB deleteChangeoverRule error:", err.message);
        }
        const idx = inMemoryChangeoverRules.findIndex((r) => r.id === id || r.matrixId === id);
        if (idx !== -1) {
            const deleted = inMemoryChangeoverRules.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Changeover rule deleted" };
    }
    // ==========================================
    // 13. SANITATION & ALLERGENS
    // ==========================================
    async listSanitationClasses(tenantId) {
        if (tenantId) {
            return [];
        }
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          id,
          class_id AS "classId",
          sanitation_id AS "sanitationId",
          code,
          name,
          sanitation_class AS "sanitationClass",
          description,
          duration_min AS "durationMin",
          wash_duration_min AS "washDurationMin",
          cleaning_method AS "cleaningMethod",
          cleaning_level AS "cleaningLevel",
          risk_level AS "riskLevel",
          applicable_products AS "applicableProducts",
          chemical_agent AS "chemicalAgent",
          validation_method AS "validationMethod",
          frequency,
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.sanitation_classes
        ORDER BY created_at ASC
      `);
            if (res.rows && res.rows.length > 0) {
                return res.rows.map((r) => ({
                    id: r.id,
                    classId: r.classId || r.id,
                    sanitationId: r.sanitationId || r.classId || r.id,
                    code: r.code,
                    name: r.name || r.sanitationClass,
                    sanitationClass: r.sanitationClass || r.name,
                    description: r.description || "",
                    durationMin: Number(r.durationMin) || Number(r.washDurationMin) || 45,
                    washDurationMin: Number(r.washDurationMin) || Number(r.durationMin) || 45,
                    cleaningMethod: r.cleaningMethod || "Automated 5-Step Central CIP Skid",
                    cleaningLevel: r.cleaningLevel || "Intermediate",
                    riskLevel: r.riskLevel || "Standard",
                    applicableProducts: r.applicableProducts || "All Formulations",
                    chemicalAgent: r.chemicalAgent || "Caustic Solution",
                    validationMethod: r.validationMethod || "Visual & Swab",
                    frequency: r.frequency || "Daily",
                    status: r.status || "Active",
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }));
            }
        }
        catch (err) {
            console.warn("DB listSanitationClasses error:", err.message);
        }
        return inMemorySanitationClasses;
    }
    async createSanitationClass(tenantId, input) {
        const classIdVal = input.classId || input.sanitationId || `SAN-0${inMemorySanitationClasses.length + 1}`;
        const codeVal = (input.code || `SAN-${inMemorySanitationClasses.length + 1}`).toUpperCase();
        const nameVal = input.sanitationClass || input.name || `Sanitation Class ${inMemorySanitationClasses.length + 1}`;
        const descVal = input.description || "";
        const durVal = Number(input.durationMin) || Number(input.washDurationMin) || 45;
        const methodVal = input.cleaningMethod || "Automated 5-Step Central CIP Skid";
        const levelVal = input.cleaningLevel || "Intermediate";
        const riskVal = input.riskLevel || "Standard";
        const prodsVal = input.applicableProducts || "All Formulations";
        const chemVal = input.chemicalAgent || "Caustic Solution";
        const valMethod = input.validationMethod || "Visual & Swab";
        const freqVal = input.frequency || "Daily";
        const statVal = input.status || "Active";
        let dbId;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.sanitation_classes (
          class_id, sanitation_id, code, name, sanitation_class, description,
          duration_min, wash_duration_min, cleaning_method, cleaning_level,
          risk_level, applicable_products, chemical_agent, validation_method,
          frequency, status, created_at, updated_at
        ) VALUES (
          ${classIdVal}, ${classIdVal}, ${codeVal}, ${nameVal}, ${nameVal}, ${descVal},
          ${durVal}, ${durVal}, ${methodVal}, ${levelVal},
          ${riskVal}, ${prodsVal}, ${chemVal}, ${valMethod},
          ${freqVal}, ${statVal}, NOW(), NOW()
        )
        ON CONFLICT (class_id) DO UPDATE SET
          name = EXCLUDED.name,
          sanitation_class = EXCLUDED.sanitation_class,
          description = EXCLUDED.description,
          duration_min = EXCLUDED.duration_min,
          wash_duration_min = EXCLUDED.wash_duration_min,
          cleaning_method = EXCLUDED.cleaning_method,
          cleaning_level = EXCLUDED.cleaning_level,
          risk_level = EXCLUDED.risk_level,
          applicable_products = EXCLUDED.applicable_products,
          chemical_agent = EXCLUDED.chemical_agent,
          validation_method = EXCLUDED.validation_method,
          frequency = EXCLUDED.frequency,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id, class_id
      `);
            if (res.rows && res.rows.length > 0) {
                dbId = res.rows[0].id;
            }
        }
        catch (err) {
            console.warn("DB createSanitationClass error:", err.message);
        }
        const newSan = {
            id: dbId || classIdVal,
            classId: classIdVal,
            sanitationId: classIdVal,
            code: codeVal,
            name: nameVal,
            sanitationClass: nameVal,
            description: descVal,
            durationMin: durVal,
            washDurationMin: durVal,
            cleaningMethod: methodVal,
            cleaningLevel: levelVal,
            riskLevel: riskVal,
            applicableProducts: prodsVal,
            chemicalAgent: chemVal,
            validationMethod: valMethod,
            frequency: freqVal,
            status: statVal,
        };
        inMemorySanitationClasses.unshift(newSan);
        return newSan;
    }
    async updateSanitationClass(tenantId, id, input) {
        try {
            const nameVal = input.sanitationClass || input.name;
            const descVal = input.description;
            const durVal = input.durationMin !== undefined ? Number(input.durationMin) : (input.washDurationMin !== undefined ? Number(input.washDurationMin) : null);
            const methodVal = input.cleaningMethod;
            const levelVal = input.cleaningLevel;
            const riskVal = input.riskLevel;
            const prodsVal = input.applicableProducts;
            const chemVal = input.chemicalAgent;
            const valMethod = input.validationMethod;
            const freqVal = input.frequency;
            const statVal = input.status;
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.sanitation_classes
        SET
          name = COALESCE(${nameVal}, name),
          sanitation_class = COALESCE(${nameVal}, sanitation_class),
          description = COALESCE(${descVal}, description),
          duration_min = COALESCE(${durVal}, duration_min),
          wash_duration_min = COALESCE(${durVal}, wash_duration_min),
          cleaning_method = COALESCE(${methodVal}, cleaning_method),
          cleaning_level = COALESCE(${levelVal}, cleaning_level),
          risk_level = COALESCE(${riskVal}, risk_level),
          applicable_products = COALESCE(${prodsVal}, applicable_products),
          chemical_agent = COALESCE(${chemVal}, chemical_agent),
          validation_method = COALESCE(${valMethod}, validation_method),
          frequency = COALESCE(${freqVal}, frequency),
          status = COALESCE(${statVal}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR class_id = ${id} OR sanitation_id = ${id} OR lower(code) = lower(${id})
      `);
        }
        catch (err) {
            console.warn("DB updateSanitationClass error:", err.message);
        }
        const idx = inMemorySanitationClasses.findIndex((s) => s.id === id || s.sanitationId === id || s.classId === id);
        if (idx !== -1) {
            inMemorySanitationClasses[idx] = {
                ...inMemorySanitationClasses[idx],
                ...input,
                sanitationClass: input.sanitationClass || input.name || inMemorySanitationClasses[idx].sanitationClass,
                name: input.sanitationClass || input.name || inMemorySanitationClasses[idx].name,
            };
            return inMemorySanitationClasses[idx];
        }
        return { id, ...input };
    }
    async deleteSanitationClass(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.sanitation_classes WHERE id::text = ${id} OR class_id = ${id} OR sanitation_id = ${id} OR lower(code) = lower(${id})`);
        }
        catch (err) {
            console.warn("DB deleteSanitationClass error:", err.message);
        }
        const idx = inMemorySanitationClasses.findIndex((s) => s.id === id || s.sanitationId === id || s.classId === id);
        if (idx !== -1) {
            const deleted = inMemorySanitationClasses.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Sanitation class deleted" };
    }
    async listAllergenRules(tenantId) {
        if (tenantId) {
            return [];
        }
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT
          id,
          rule_id AS "ruleId",
          allergen_id AS "allergenId",
          allergen_type AS "allergenType",
          allergen_name AS "allergenName",
          sku_id AS "skuId",
          sku_code AS "skuCode",
          risk_level AS "riskLevel",
          cleaning_protocol AS "cleaningProtocol",
          protocol,
          changeover_restriction AS "changeoverRestriction",
          verification_test AS "verificationTest",
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.allergen_rules
        ORDER BY created_at ASC
      `);
            if (res.rows && res.rows.length > 0) {
                return res.rows.map((r) => ({
                    id: r.id,
                    ruleId: r.ruleId || r.id,
                    allergenId: r.allergenId || r.ruleId || r.id,
                    allergenType: r.allergenType || "Botanical / Additive",
                    allergenName: r.allergenName,
                    skuId: r.skuId,
                    skuCode: r.skuCode,
                    riskLevel: r.riskLevel || "High",
                    cleaningProtocol: r.cleaningProtocol || r.protocol || "Full CIP Rinse",
                    protocol: r.cleaningProtocol || r.protocol || "Full CIP Rinse",
                    changeoverRestriction: r.changeoverRestriction || "Mandatory QA clearance sign-off",
                    verificationTest: r.verificationTest || "ATP Swab Validation",
                    status: r.status || "Active",
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                }));
            }
        }
        catch (err) {
            console.warn("DB listAllergenRules error:", err.message);
        }
        return inMemoryAllergenRules;
    }
    async createAllergenRule(tenantId, input) {
        const ruleIdVal = input.ruleId || input.allergenId || `ALG-0${inMemoryAllergenRules.length + 1}`;
        const typeVal = input.allergenType || "Botanical Extracts";
        const nameVal = input.allergenName || "New Allergen Control Rule";
        const skuIdVal = input.skuId || "";
        const skuCodeVal = input.skuCode || "SKU-5001";
        const riskVal = input.riskLevel || "High Regulatory CCP";
        const protocolVal = input.cleaningProtocol || input.protocol || "Class A Full CIP + ATP Swab Validation";
        const restrictionVal = input.changeoverRestriction || "Mandatory QA sign-off";
        const testVal = input.verificationTest || "ATP Swab < 10 RLU";
        const statVal = input.status || "Active";
        let dbId;
        try {
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        INSERT INTO public.allergen_rules (
          rule_id, allergen_id, allergen_type, allergen_name, sku_id, sku_code,
          risk_level, cleaning_protocol, protocol, changeover_restriction,
          verification_test, status, created_at, updated_at
        ) VALUES (
          ${ruleIdVal}, ${ruleIdVal}, ${typeVal}, ${nameVal}, ${skuIdVal}, ${skuCodeVal},
          ${riskVal}, ${protocolVal}, ${protocolVal}, ${restrictionVal},
          ${testVal}, ${statVal}, NOW(), NOW()
        )
        ON CONFLICT (rule_id) DO UPDATE SET
          allergen_name = EXCLUDED.allergen_name,
          sku_code = EXCLUDED.sku_code,
          risk_level = EXCLUDED.risk_level,
          cleaning_protocol = EXCLUDED.cleaning_protocol,
          protocol = EXCLUDED.protocol,
          changeover_restriction = EXCLUDED.changeover_restriction,
          verification_test = EXCLUDED.verification_test,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id, rule_id
      `);
            if (res.rows && res.rows.length > 0) {
                dbId = res.rows[0].id;
            }
        }
        catch (err) {
            console.warn("DB createAllergenRule error:", err.message);
        }
        const newAlg = {
            id: dbId || ruleIdVal,
            ruleId: ruleIdVal,
            allergenId: ruleIdVal,
            allergenType: typeVal,
            allergenName: nameVal,
            skuId: skuIdVal,
            skuCode: skuCodeVal,
            riskLevel: riskVal,
            cleaningProtocol: protocolVal,
            protocol: protocolVal,
            changeoverRestriction: restrictionVal,
            verificationTest: testVal,
            status: statVal,
        };
        inMemoryAllergenRules.unshift(newAlg);
        return newAlg;
    }
    async updateAllergenRule(tenantId, id, input) {
        try {
            const nameVal = input.allergenName;
            const skuCodeVal = input.skuCode;
            const skuIdVal = input.skuId;
            const riskVal = input.riskLevel;
            const protocolVal = input.cleaningProtocol || input.protocol;
            const restrictionVal = input.changeoverRestriction;
            const testVal = input.verificationTest;
            const statVal = input.status;
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        UPDATE public.allergen_rules
        SET
          allergen_name = COALESCE(${nameVal}, allergen_name),
          sku_code = COALESCE(${skuCodeVal}, sku_code),
          sku_id = COALESCE(${skuIdVal}, sku_id),
          risk_level = COALESCE(${riskVal}, risk_level),
          cleaning_protocol = COALESCE(${protocolVal}, cleaning_protocol),
          protocol = COALESCE(${protocolVal}, protocol),
          changeover_restriction = COALESCE(${restrictionVal}, changeover_restriction),
          verification_test = COALESCE(${testVal}, verification_test),
          status = COALESCE(${statVal}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR rule_id = ${id} OR allergen_id = ${id}
      `);
        }
        catch (err) {
            console.warn("DB updateAllergenRule error:", err.message);
        }
        const idx = inMemoryAllergenRules.findIndex((a) => a.id === id || a.allergenId === id || a.ruleId === id);
        if (idx !== -1) {
            inMemoryAllergenRules[idx] = {
                ...inMemoryAllergenRules[idx],
                ...input,
                allergenName: input.allergenName || inMemoryAllergenRules[idx].allergenName,
            };
            return inMemoryAllergenRules[idx];
        }
        return { id, ...input };
    }
    async deleteAllergenRule(tenantId, id) {
        try {
            await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.allergen_rules WHERE id::text = ${id} OR rule_id = ${id} OR allergen_id = ${id}`);
        }
        catch (err) {
            console.warn("DB deleteAllergenRule error:", err.message);
        }
        const idx = inMemoryAllergenRules.findIndex((a) => a.id === id || a.allergenId === id || a.ruleId === id);
        if (idx !== -1) {
            const deleted = inMemoryAllergenRules.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Allergen rule deleted" };
    }
    // ==========================================
    // 14. SKUs, BOMs, ASSETS, STAFF, SPECS
    // ==========================================
    async listSkus(tenantId) {
        try {
            // Fetch ALL SKUs from DB (no tenant filter) so data is always visible.
            // In a strict multi-tenant setup, filter by tenantId here.
            const dbSkus = await database_js_1.db.select().from(masterData_js_1.skus);
            return dbSkus.map((s) => ({
                ...s,
                id: s.id,
                skuId: s.id,
                skuCode: s.skuCode,
                code: s.skuCode,
                name: s.name,
                category: s.category === "FINISHED_GOODS" ? "Finished Goods" : s.category === "RAW_MATERIAL" ? "Raw Ingredients" : s.category === "PACKAGING" ? "Packaging" : (s.category || "Finished Goods"),
                itemType: s.category === "FINISHED_GOODS" ? "Finished Good" : s.category === "RAW_MATERIAL" ? "Raw Material" : "Finished Good",
                uom: s.uom || "Units",
                plantId: s.plantId,
                standardCost: s.standardCost,
                stdCost: s.standardCost,
                shelfLifeDays: s.shelfLifeDays,
                status: s.isActive ? "Active" : "Inactive",
                isActive: s.isActive,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            }));
        }
        catch (err) {
            console.warn("DB listSkus error:", err.message);
        }
        return inMemorySkus;
    }
    async createSku(tenantId, input) {
        const newId = `SKU-00${inMemorySkus.length + 1}`;
        const newSku = {
            id: newId,
            skuId: newId,
            skuCode: input.skuCode || input.code || `SKU-500${inMemorySkus.length + 1}`,
            code: input.skuCode || input.code || `SKU-500${inMemorySkus.length + 1}`,
            name: input.name,
            category: input.category || "Finished Goods",
            itemType: input.itemType || "Finished Good",
            familyId: input.familyId || "PF-01",
            family: input.family || "Carbonated Soft Drinks",
            uom: input.uom || "Bottles",
            plantId: input.plantId || "PLT-01",
            stdCost: Number(input.stdCost || input.standardCost) || 0.50,
            revision: input.revision || "R1",
            status: input.status || "Active",
            approvalStatus: input.approvalStatus || "Approved",
            shelfLifeDays: Number(input.shelfLifeDays) || 365,
            packConfigCode: input.packConfigCode || "PCK-5001-24",
            packSize: input.packSize || "24 x 500ml",
            eligibleLineIds: input.eligibleLineIds || ["LIN-01", "LIN-02"],
            stdRunRateBPH: Number(input.stdRunRateBPH) || 38000,
            expectedYieldPct: Number(input.expectedYieldPct) || 99.0,
        };
        inMemorySkus.unshift(newSku);
        try {
            // Use tenantId from request; if missing, fallback to first tenant in DB
            let tId = tenantId;
            if (!tId) {
                const [firstTenant] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
                tId = firstTenant?.id;
            }
            if (!tId)
                throw new Error("No tenantId available to persist SKU");
            const cat = (newSku.category.toUpperCase().includes("RAW")) ? "RAW_MATERIAL" : (newSku.category.toUpperCase().includes("PACK") ? "PACKAGING" : "FINISHED_GOODS");
            const costRaw = String(newSku.stdCost || "0").replace(/[^\d.]/g, "");
            const [insertedSku] = await database_js_1.db.insert(masterData_js_1.skus).values({
                tenantId: tId,
                plantId: (newSku.plantId && newSku.plantId.includes("-") && newSku.plantId.length > 20) ? newSku.plantId : null,
                skuCode: newSku.skuCode,
                name: newSku.name,
                category: cat,
                uom: newSku.uom,
                standardCost: isNaN(Number(costRaw)) ? "0" : costRaw,
                shelfLifeDays: newSku.shelfLifeDays,
                isActive: newSku.status !== "Inactive",
            }).returning();
            if (insertedSku) {
                newSku.id = insertedSku.id;
                newSku.skuId = insertedSku.id;
            }
        }
        catch (err) {
            console.warn("DB insert sku error:", err.message);
        }
        return newSku;
    }
    async updateSku(tenantId, id, input) {
        const idx = inMemorySkus.findIndex((s) => matchKey(s, id, ["id", "skuId", "skuCode", "code", "name"]));
        if (idx !== -1) {
            inMemorySkus[idx] = { ...inMemorySkus[idx], ...input, lastUpdated: new Date().toISOString().substring(0, 10) };
        }
        // Persist to PostgreSQL by matching on skuCode or id
        try {
            const cat = input.category
                ? input.category.toUpperCase().includes("RAW") ? "RAW_MATERIAL"
                    : input.category.toUpperCase().includes("PACK") ? "PACKAGING"
                        : "FINISHED_GOODS"
                : undefined;
            const updates = {};
            if (input.name)
                updates.name = input.name;
            if (input.skuCode || input.code)
                updates.skuCode = input.skuCode || input.code;
            if (cat)
                updates.category = cat;
            if (input.uom)
                updates.uom = input.uom;
            if (input.plantId && input.plantId.includes("-") && input.plantId.length > 20)
                updates.plantId = input.plantId;
            if (input.description !== undefined)
                updates.description = input.description;
            if (input.stdCost !== undefined || input.standardCost !== undefined) {
                const raw = String(input.stdCost || input.standardCost || "0").replace(/[^\d.]/g, "");
                updates.standardCost = isNaN(Number(raw)) ? "0" : raw;
            }
            // DB skus table has no 'status' column — map to is_active boolean
            if (input.status !== undefined)
                updates.isActive = (input.status === "Active" || input.status === "ACTIVE" || input.status === true);
            if (input.isActive !== undefined)
                updates.isActive = Boolean(input.isActive);
            if (Object.keys(updates).length > 0) {
                // Try matching by UUID first, then by skuCode
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                if (isUuid) {
                    await database_js_1.db.update(masterData_js_1.skus).set(updates).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.id, id));
                }
                else {
                    await database_js_1.db.update(masterData_js_1.skus).set(updates).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, id));
                }
            }
        }
        catch (err) {
            console.warn("DB update sku error:", err.message);
        }
        return idx !== -1 ? inMemorySkus[idx] : { id, ...input };
    }
    async deleteSku(tenantId, id) {
        const idx = inMemorySkus.findIndex((s) => matchKey(s, id, ["id", "skuId", "skuCode", "code", "name"]));
        let deleted = { id, message: "SKU deleted" };
        if (idx !== -1) {
            deleted = inMemorySkus.splice(idx, 1)[0];
        }
        // Persist delete to PostgreSQL
        try {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            if (isUuid) {
                await database_js_1.db.delete(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.id, id));
            }
            else {
                await database_js_1.db.delete(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, id));
            }
        }
        catch (err) {
            console.warn("DB delete sku error:", err.message);
        }
        return deleted;
    }
    async listBoms(tenantId) {
        try {
            // Fetch ALL BOMs from DB (no strict tenant filter) so data is always visible.
            const res = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
        SELECT 
          b.id,
          COALESCE(b.bom_number, b.name, b.id::text) AS bom_number,
          b.name,
          b.version,
          b.batch_size,
          b.batch_uom,
          b.yield_percent,
          b.status,
          COALESCE(b.approval_status, 'Approved') AS approval_status,
          b.created_by,
          b.created_at,
          b.updated_at,
          s.id AS sku_id,
          s.sku_code,
          s.name AS sku_name
        FROM public.boms b
        LEFT JOIN public.skus s ON b.sku_id = s.id
        ORDER BY b.created_at DESC
      `);
            const rows = res?.rows || (Array.isArray(res) ? res : []);
            if (rows && rows.length > 0) {
                // Also fetch bom_items for each bom
                let allItems = [];
                try {
                    const itemsRes = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
            SELECT 
              bi.id, bi.bom_id, bi.component_sku_id, bi.quantity, bi.scrap_percentage, bi.uom, bi.sequence, bi.stage,
              COALESCE(bi.component_name, s.name) AS component_name,
              COALESCE(bi.sku_code, s.sku_code) AS sku_code
            FROM public.bom_items bi
            LEFT JOIN public.skus s ON bi.component_sku_id = s.id
            ORDER BY bi.sequence ASC
          `);
                    allItems = itemsRes?.rows || (Array.isArray(itemsRes) ? itemsRes : []);
                }
                catch (itemErr) {
                    console.warn("DB list bom_items error:", itemErr.message);
                }
                return rows.map((r) => {
                    const bomItems = allItems.filter((it) => String(it.bom_id) === String(r.id));
                    const components = bomItems.length > 0
                        ? bomItems.map((bi) => ({
                            id: String(bi.id),
                            skuId: bi.component_sku_id ? String(bi.component_sku_id) : undefined,
                            skuCode: bi.sku_code || "ING-1001",
                            name: bi.component_name || "Component Ingredient",
                            quantity: Number(bi.quantity) || 100,
                            uom: bi.uom || "Kg",
                            scrapFactor: `${bi.scrap_percentage || 0}%`,
                            type: bi.stage || "Ingredient"
                        }))
                        : [
                            { id: `cmp-${r.id}`, skuId: r.sku_id ? String(r.sku_id) : "SKU-101", skuCode: r.sku_code || "ING-1001", name: r.sku_name || "Active Recipe Component", quantity: 1, uom: r.batch_uom || "Liters" }
                        ];
                    const statusDisplay = (r.status || "ACTIVE").toUpperCase() === "ACTIVE" ? "Active" : (r.status || "Active");
                    return {
                        id: String(r.id),
                        bomId: String(r.id),
                        bomNumber: r.bom_number || `BOM-${String(r.id).substring(0, 4)}`,
                        finishedSkuId: r.sku_id ? String(r.sku_id) : "SKU-001",
                        finishedSkuCode: r.sku_code || "SKU-5001",
                        finishedSkuName: r.name || r.sku_name || "Finished Beverage",
                        revision: r.version || "R1",
                        batchSize: `${Number(r.batch_size || 10000).toLocaleString()} ${r.batch_uom || 'Liters'}`,
                        yieldTarget: `${Number(r.yield_percent || 99.0).toFixed(1)}%`,
                        expectedYieldPct: Number(r.yield_percent) || 99.0,
                        status: statusDisplay,
                        approvalStatus: r.approval_status || "Approved",
                        createdBy: r.created_by || "Alexander Vance",
                        lastUpdated: r.updated_at ? new Date(r.updated_at).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
                        components,
                        revisionHistory: [
                            { revision: r.version || "R1", status: r.approval_status || "Approved", createdBy: r.created_by || "Alexander Vance", date: new Date(r.created_at).toISOString().substring(0, 10), changes: "Formulation active in PostgreSQL public.boms", approvedBy: "Sarah Jenkins" }
                        ]
                    };
                });
            }
        }
        catch (err) {
            console.warn("DB listBoms error:", err.message);
        }
        return [];
    }
    async getBomById(tenantId, id) {
        const list = await this.listBoms(tenantId);
        const found = list.find((b) => b.id === id || b.bomId === id || b.bomNumber === id);
        if (!found)
            throw new AppError_js_1.NotFoundError("BOM Recipe");
        return found;
    }
    async createBom(tenantId, input) {
        try {
            // 1. Resolve tenantId
            let resolvedTenantId = tenantId;
            if (resolvedTenantId) {
                const [tCheck] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).where((0, drizzle_orm_1.eq)(tenants_js_1.tenants.id, resolvedTenantId)).limit(1);
                if (!tCheck)
                    resolvedTenantId = undefined;
            }
            if (!resolvedTenantId) {
                const [firstTenant] = await database_js_1.db.select({ id: tenants_js_1.tenants.id }).from(tenants_js_1.tenants).limit(1);
                resolvedTenantId = firstTenant?.id;
            }
            if (!resolvedTenantId)
                throw new Error("No tenant available");
            // 2. Resolve or create finished product SKU
            let skuId = null;
            if (input.finishedSkuId || input.skuId) {
                const rawSku = input.finishedSkuId || input.skuId;
                const isUuid = rawSku && rawSku.length === 36 && rawSku.includes("-");
                const condition = isUuid
                    ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.id, rawSku), (0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, rawSku), (0, drizzle_orm_1.ilike)(masterData_js_1.skus.name, rawSku))
                    : (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, rawSku), (0, drizzle_orm_1.ilike)(masterData_js_1.skus.name, rawSku));
                const [skuMatch] = await database_js_1.db.select({ id: masterData_js_1.skus.id }).from(masterData_js_1.skus).where(condition).limit(1);
                if (skuMatch)
                    skuId = skuMatch.id;
            }
            if (!skuId && input.finishedSkuName) {
                const [nameMatch] = await database_js_1.db.select({ id: masterData_js_1.skus.id }).from(masterData_js_1.skus).where((0, drizzle_orm_1.ilike)(masterData_js_1.skus.name, input.finishedSkuName)).limit(1);
                if (nameMatch)
                    skuId = nameMatch.id;
            }
            if (!skuId) {
                // Auto-create finished goods SKU
                const skuCodeVal = input.finishedSkuCode || `SKU-${Date.now().toString().slice(-4)}`;
                const skuNameVal = input.finishedSkuName || input.name || "Finished Recipe Product";
                const [newSku] = await database_js_1.db.insert(masterData_js_1.skus).values({
                    tenantId: resolvedTenantId,
                    skuCode: skuCodeVal,
                    name: skuNameVal,
                    category: "FINISHED_GOODS",
                    uom: "Units",
                    standardCost: "15.00",
                    isActive: true,
                }).returning({ id: masterData_js_1.skus.id });
                if (newSku)
                    skuId = newSku.id;
            }
            // 3. Prepare BOM fields
            const bomNumber = String(input.bomNumber || `BOM-${Math.floor(5000 + Math.random() * 900)}`).trim();
            const name = String(input.finishedSkuName || input.name || bomNumber).trim();
            const version = input.revision || "R1";
            const batchSizeNum = Number(String(input.batchSize || "10000").replace(/[^\d.]/g, "")) || 10000;
            const batchUom = String(input.batchSize || "").toLowerCase().includes("liter") ? "Liters" : "Units";
            const yieldNum = Number(String(input.yieldTarget || input.yieldPercent || "99.0").replace(/[^\d.]/g, "")) || 99.0;
            const status = input.status || "Draft";
            const approvalStatus = input.approvalStatus || (status === "Active" ? "Approved" : "Draft");
            const createdBy = input.createdBy || "Alexander Vance";
            // 4. Insert into public.boms
            const [inserted] = await database_js_1.db.insert(masterData_js_1.boms).values({
                tenantId: resolvedTenantId,
                skuId: skuId,
                bomNumber,
                name,
                version,
                batchSize: String(batchSizeNum),
                batchUom,
                yieldPercent: String(yieldNum),
                status,
                approvalStatus,
                createdBy,
                isDefault: true,
            }).returning();
            const newBomId = inserted.id;
            // 5. Insert components
            const componentsRes = [];
            if (Array.isArray(input.components) && input.components.length > 0) {
                for (let i = 0; i < input.components.length; i++) {
                    const comp = input.components[i];
                    let compSkuId = null;
                    if (comp.skuId || comp.skuCode) {
                        const raw = comp.skuId || comp.skuCode;
                        const isUuid = raw && raw.length === 36 && raw.includes("-");
                        const condition = isUuid
                            ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.id, raw), (0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, raw), (0, drizzle_orm_1.ilike)(masterData_js_1.skus.name, comp.name || ""))
                            : (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, raw), (0, drizzle_orm_1.ilike)(masterData_js_1.skus.name, comp.name || ""));
                        const [cMatch] = await database_js_1.db.select({ id: masterData_js_1.skus.id }).from(masterData_js_1.skus).where(condition).limit(1);
                        if (cMatch)
                            compSkuId = cMatch.id;
                    }
                    if (!compSkuId && comp.name) {
                        const [cMatch] = await database_js_1.db.select({ id: masterData_js_1.skus.id }).from(masterData_js_1.skus).where((0, drizzle_orm_1.ilike)(masterData_js_1.skus.name, comp.name)).limit(1);
                        if (cMatch)
                            compSkuId = cMatch.id;
                    }
                    if (!compSkuId) {
                        try {
                            const [newCompSku] = await database_js_1.db.insert(masterData_js_1.skus).values({
                                tenantId: resolvedTenantId,
                                skuCode: comp.skuCode || `ING-${Date.now().toString().slice(-4)}-${i}`,
                                name: comp.name || "Recipe Component",
                                category: "RAW_MATERIAL",
                                uom: comp.uom || "Kg",
                                standardCost: "5.00",
                                isActive: true,
                            }).returning({ id: masterData_js_1.skus.id });
                            if (newCompSku)
                                compSkuId = newCompSku.id;
                        }
                        catch { }
                    }
                    const [insItem] = await database_js_1.db.insert(masterData_js_1.bomItems).values({
                        bomId: newBomId,
                        componentSkuId: compSkuId || skuId,
                        componentName: comp.name || "Component Ingredient",
                        skuCode: comp.skuCode || "ING-1001",
                        quantity: String(Number(comp.quantity) || 100),
                        scrapPercentage: String(Number(String(comp.scrapFactor || "0.5").replace(/[^\d.]/g, "")) || 0.5),
                        uom: comp.uom || "Kg",
                        sequence: i + 1,
                        stage: comp.type || "MIXING",
                    }).returning();
                    componentsRes.push({
                        id: insItem?.id || `cmp-${i}`,
                        skuId: compSkuId || skuId,
                        skuCode: comp.skuCode || "ING-1001",
                        name: comp.name || "Component Ingredient",
                        quantity: Number(comp.quantity) || 100,
                        uom: comp.uom || "Kg",
                        scrapFactor: `${comp.scrapFactor || "0.5%"}`,
                        type: comp.type || "MIXING"
                    });
                }
            }
            return {
                id: newBomId,
                bomId: newBomId,
                bomNumber,
                finishedSkuId: skuId,
                finishedSkuName: name,
                finishedSkuCode: input.finishedSkuCode || "SKU-5001",
                revision: version,
                batchSize: `${batchSizeNum.toLocaleString()} ${batchUom}`,
                yieldTarget: `${yieldNum.toFixed(1)}%`,
                status: status === "ACTIVE" ? "Active" : status,
                approvalStatus,
                components: componentsRes.length > 0 ? componentsRes : (input.components || []),
                createdBy,
                lastUpdated: new Date().toISOString().substring(0, 10),
                revisionHistory: [
                    { revision: version, status: approvalStatus, createdBy, date: new Date().toISOString().substring(0, 10), changes: "Initial BOM Draft Formulation registered in DB.", approvedBy: approvalStatus === "Approved" ? "Sarah Jenkins" : "-" }
                ]
            };
        }
        catch (err) {
            console.warn("DB createBom error:", err.message);
            throw err;
        }
    }
    async updateBom(tenantId, id, input) {
        try {
            const updates = { updatedAt: new Date() };
            if (input.bomNumber)
                updates.bomNumber = input.bomNumber;
            if (input.finishedSkuName || input.name)
                updates.name = input.finishedSkuName || input.name;
            if (input.batchSize)
                updates.batchSize = String(Number(String(input.batchSize).replace(/[^\d.]/g, "")) || 10000);
            if (input.yieldTarget || input.yieldPercent)
                updates.yieldPercent = String(Number(String(input.yieldTarget || input.yieldPercent).replace(/[^\d.]/g, "")) || 99.0);
            if (input.status)
                updates.status = input.status;
            if (input.approvalStatus)
                updates.approvalStatus = input.approvalStatus;
            if (input.revision)
                updates.version = input.revision;
            const [foundBom] = await database_js_1.db.select().from(masterData_js_1.boms).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.boms.id, id), (0, drizzle_orm_1.eq)(masterData_js_1.boms.bomNumber, id), (0, drizzle_orm_1.eq)(masterData_js_1.boms.name, id))).limit(1);
            if (foundBom) {
                await database_js_1.db.update(masterData_js_1.boms).set(updates).where((0, drizzle_orm_1.eq)(masterData_js_1.boms.id, foundBom.id));
                if (Array.isArray(input.components) && input.components.length > 0) {
                    await database_js_1.db.delete(masterData_js_1.bomItems).where((0, drizzle_orm_1.eq)(masterData_js_1.bomItems.bomId, foundBom.id));
                    for (let i = 0; i < input.components.length; i++) {
                        const comp = input.components[i];
                        await database_js_1.db.insert(masterData_js_1.bomItems).values({
                            bomId: foundBom.id,
                            componentSkuId: foundBom.skuId,
                            componentName: comp.name || "Component Ingredient",
                            skuCode: comp.skuCode || "ING-1001",
                            quantity: String(Number(comp.quantity) || 100),
                            scrapPercentage: String(Number(String(comp.scrapFactor || "0.5").replace(/[^\d.]/g, "")) || 0.5),
                            uom: comp.uom || "Kg",
                            sequence: i + 1,
                            stage: comp.type || "MIXING",
                        });
                    }
                }
            }
            else {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `
          UPDATE public.boms
          SET 
            bom_number = COALESCE(${updates.bomNumber || null}, bom_number),
            name = COALESCE(${updates.name || null}, name),
            batch_size = COALESCE(${updates.batchSize != null ? updates.batchSize : null}, batch_size),
            yield_percent = COALESCE(${updates.yieldPercent != null ? updates.yieldPercent : null}, yield_percent),
            status = COALESCE(${updates.status || null}, status),
            approval_status = COALESCE(${updates.approvalStatus || null}, approval_status),
            version = COALESCE(${updates.version || null}, version),
            updated_at = now()
          WHERE id::text = ${id} OR bom_number = ${id} OR name = ${id}
        `);
            }
            return { id, ...input, message: "BOM updated in public.boms" };
        }
        catch (err) {
            console.warn("DB updateBom error:", err.message);
            return { id, ...input };
        }
    }
    async deleteBom(tenantId, id) {
        try {
            const [foundBom] = await database_js_1.db.select().from(masterData_js_1.boms).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.boms.id, id), (0, drizzle_orm_1.eq)(masterData_js_1.boms.bomNumber, id), (0, drizzle_orm_1.eq)(masterData_js_1.boms.name, id))).limit(1);
            if (foundBom) {
                await database_js_1.db.delete(masterData_js_1.bomItems).where((0, drizzle_orm_1.eq)(masterData_js_1.bomItems.bomId, foundBom.id));
                await database_js_1.db.delete(masterData_js_1.boms).where((0, drizzle_orm_1.eq)(masterData_js_1.boms.id, foundBom.id));
            }
            else {
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.bom_items WHERE bom_id IN (SELECT id FROM public.boms WHERE id::text = ${id} OR bom_number = ${id})`);
                await database_js_1.db.execute((0, drizzle_orm_1.sql) `DELETE FROM public.boms WHERE id::text = ${id} OR bom_number = ${id} OR name = ${id}`);
            }
            return { id, message: "BOM deleted from public.boms" };
        }
        catch (err) {
            console.warn("DB deleteBom error:", err.message);
            return { id, message: "BOM deleted" };
        }
    }
    async listAssets(tenantId, plantId) {
        try {
            const tId = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
            const isUuid = plantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plantId);
            let rows;
            if (isUuid) {
                rows = await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.assets.tenantId, tId), (0, drizzle_orm_1.eq)(masterData_js_1.assets.plantId, plantId))).orderBy((0, drizzle_orm_1.desc)(masterData_js_1.assets.createdAt));
            }
            else {
                rows = await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.eq)(masterData_js_1.assets.tenantId, tId)).orderBy((0, drizzle_orm_1.desc)(masterData_js_1.assets.createdAt));
            }
            if (!rows || rows.length === 0) {
                rows = await database_js_1.db.select().from(masterData_js_1.assets).orderBy((0, drizzle_orm_1.desc)(masterData_js_1.assets.createdAt));
            }
            const linesList = await database_js_1.db.select({ id: masterData_js_1.productionLines.id, name: masterData_js_1.productionLines.name, code: masterData_js_1.productionLines.code }).from(masterData_js_1.productionLines);
            const lineMap = new Map();
            linesList.forEach(l => {
                lineMap.set(l.id, l.name);
            });
            return rows.map((r) => {
                const lineName = (r.lineId && lineMap.get(r.lineId)) || "Line 1 (Aseptic Bottling)";
                const rawStatus = (r.status || "Operational").trim();
                const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
                const rawCrit = (r.criticalLevel || "Medium").replace(/^CRITICAL_/i, "").replace(/_P[1-3]$/i, "");
                const criticality = rawCrit.charAt(0).toUpperCase() + rawCrit.slice(1).toLowerCase();
                return {
                    id: r.assetCode || r.id,
                    assetCode: r.assetCode,
                    dbId: r.id,
                    name: r.name,
                    type: r.modelNumber || "Packaging & Bottling",
                    department: "Packaging",
                    plant: "Plant 1 - North Facility",
                    line: lineName,
                    location: "Bay 4A - Main Hall",
                    status: formattedStatus,
                    health: Number(r.healthPercent) ?? 100,
                    criticality: criticality || "Medium",
                    mtbf: Number(r.mtbfHours) || 350,
                    mttr: Number(r.mttrHours) || 1.5,
                    vibration: 1.5,
                    temperature: 55.0,
                    manufacturer: r.manufacturer || "Standard OEM",
                    model: r.modelNumber || "Series-2026",
                    serialNumber: `SN-${r.assetCode || r.id.substring(0, 8)}`,
                    commissionDate: r.installDate ? new Date(r.installDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
                    installedDate: r.installDate ? new Date(r.installDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                };
            });
        }
        catch (err) {
            console.error("listAssets error:", err.message);
            return [];
        }
    }
    async createAsset(tenantId, input) {
        const tId = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        let plantId = input.plantId;
        if (!plantId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plantId)) {
            const p = await database_js_1.db.select({ id: tenants_js_1.plants.id }).from(tenants_js_1.plants).limit(1);
            plantId = p[0]?.id || "bead41e2-b735-41b8-bd00-bdba1682fb6a";
        }
        let lineId = input.lineId;
        if (lineId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lineId)) {
            const pl = await database_js_1.db.select({ id: masterData_js_1.productionLines.id }).from(masterData_js_1.productionLines).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.name, lineId), (0, drizzle_orm_1.eq)(masterData_js_1.productionLines.code, lineId))).limit(1);
            lineId = pl[0]?.id || null;
        }
        const assetCode = String(input.id || input.assetCode || `ASSET-${Date.now()}`).trim();
        const name = String(input.name || "Unnamed Machine").trim();
        const status = String(input.status || "OPERATIONAL").toUpperCase();
        const healthPercent = Number(input.health ?? input.healthPercent) || 100;
        const criticalLevel = String(input.criticality || input.criticalLevel || "IMPORTANT_P2");
        const mtbfHours = String(input.mtbf || input.mtbfHours || "400.0");
        const mttrHours = String(input.mttr || input.mttrHours || "1.5");
        const manufacturer = String(input.manufacturer || "Standard OEM").trim();
        const modelNumber = String(input.model || input.modelNumber || input.type || "Packaging & Bottling").trim();
        const [inserted] = await database_js_1.db.insert(masterData_js_1.assets).values({
            tenantId: tId,
            plantId,
            lineId: lineId || null,
            assetCode,
            name,
            criticalLevel,
            status,
            healthPercent,
            mtbfHours,
            mttrHours,
            manufacturer,
            modelNumber,
            installDate: input.installedDate ? new Date(input.installedDate) : new Date(),
            lastServiceDate: new Date(),
        }).returning();
        return {
            id: inserted.assetCode,
            assetCode: inserted.assetCode,
            dbId: inserted.id,
            name: inserted.name,
            type: inserted.modelNumber,
            department: input.department || "Packaging",
            plant: input.plant || "Plant 1 - North Facility",
            line: input.line || "Line 1 (Aseptic Bottling)",
            location: input.location || "Bay 4A - Main Hall",
            status: input.status || "Operational",
            health: inserted.healthPercent,
            criticality: input.criticality || "Medium",
            mtbf: Number(inserted.mtbfHours),
            mttr: Number(inserted.mttrHours),
            vibration: 1.5,
            temperature: 55.0,
            manufacturer: inserted.manufacturer,
            model: inserted.modelNumber,
            serialNumber: `SN-${inserted.assetCode}`,
            installedDate: inserted.installDate ? new Date(inserted.installDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
            createdAt: inserted.createdAt,
        };
    }
    async updateAsset(tenantId, id, input) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const condition = isUuid
            ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.assets.id, id), (0, drizzle_orm_1.eq)(masterData_js_1.assets.assetCode, id))
            : (0, drizzle_orm_1.eq)(masterData_js_1.assets.assetCode, id);
        let existing = await database_js_1.db.select().from(masterData_js_1.assets).where(condition);
        if (!existing[0]) {
            const fallback = await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(masterData_js_1.assets.assetCode, id), (0, drizzle_orm_1.ilike)(masterData_js_1.assets.name, id)));
            if (!fallback[0]) {
                throw new AppError_js_1.NotFoundError(`Asset not found: ${id}`);
            }
            existing = fallback;
        }
        const target = existing[0];
        const updateData = {
            updatedAt: new Date(),
        };
        if (input.name !== undefined)
            updateData.name = String(input.name).trim();
        if (input.assetCode !== undefined || input.newId !== undefined) {
            updateData.assetCode = String(input.assetCode || input.newId).trim();
        }
        if (input.status !== undefined)
            updateData.status = String(input.status).toUpperCase();
        if (input.health !== undefined || input.healthPercent !== undefined) {
            updateData.healthPercent = Number(input.health ?? input.healthPercent);
        }
        if (input.criticality !== undefined || input.criticalLevel !== undefined) {
            updateData.criticalLevel = String(input.criticality || input.criticalLevel);
        }
        if (input.manufacturer !== undefined)
            updateData.manufacturer = String(input.manufacturer).trim();
        if (input.model !== undefined || input.modelNumber !== undefined || input.type !== undefined) {
            updateData.modelNumber = String(input.model || input.modelNumber || input.type).trim();
        }
        if (input.mtbf !== undefined || input.mtbfHours !== undefined) {
            updateData.mtbfHours = String(input.mtbf || input.mtbfHours);
        }
        if (input.mttr !== undefined || input.mttrHours !== undefined) {
            updateData.mttrHours = String(input.mttr || input.mttrHours);
        }
        const [updated] = await database_js_1.db.update(masterData_js_1.assets).set(updateData).where((0, drizzle_orm_1.eq)(masterData_js_1.assets.id, target.id)).returning();
        return {
            id: updated.assetCode,
            assetCode: updated.assetCode,
            dbId: updated.id,
            name: updated.name,
            type: updated.modelNumber,
            department: input.department || "Packaging",
            line: input.line || "Line 1 (Aseptic Bottling)",
            location: input.location || "Bay 4A - Main Hall",
            status: input.status || (updated.status ? updated.status.charAt(0).toUpperCase() + updated.status.slice(1).toLowerCase() : "Operational"),
            health: updated.healthPercent,
            criticality: input.criticality || (updated.criticalLevel ? updated.criticalLevel.replace(/^CRITICAL_/i, "").replace(/_P[1-3]$/i, "") : "Medium"),
            mtbf: Number(updated.mtbfHours),
            mttr: Number(updated.mttrHours),
            vibration: 1.5,
            temperature: 55.0,
            manufacturer: updated.manufacturer,
            model: updated.modelNumber,
            serialNumber: `SN-${updated.assetCode}`,
            updatedAt: updated.updatedAt,
        };
    }
    async deleteAsset(tenantId, id) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const condition = isUuid
            ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.assets.id, id), (0, drizzle_orm_1.eq)(masterData_js_1.assets.assetCode, id))
            : (0, drizzle_orm_1.eq)(masterData_js_1.assets.assetCode, id);
        let existing = await database_js_1.db.select().from(masterData_js_1.assets).where(condition);
        if (!existing[0]) {
            const fallback = await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(masterData_js_1.assets.assetCode, id), (0, drizzle_orm_1.ilike)(masterData_js_1.assets.name, id)));
            if (!fallback[0]) {
                throw new AppError_js_1.NotFoundError(`Asset not found: ${id}`);
            }
            existing = fallback;
        }
        const target = existing[0];
        await database_js_1.db.delete(masterData_js_1.assets).where((0, drizzle_orm_1.eq)(masterData_js_1.assets.id, target.id));
        return {
            success: true,
            id: target.assetCode,
            dbId: target.id,
            message: `Asset ${target.assetCode} (${target.name}) deleted successfully`,
        };
    }
    async listStaff(tenantId, plantId) {
        if (tenantId) {
            try {
                const isUuid = plantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plantId);
                if (isUuid) {
                    return await database_js_1.db.select().from(masterData_js_1.staff).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.staff.tenantId, tenantId), (0, drizzle_orm_1.eq)(masterData_js_1.staff.plantId, plantId)));
                }
                return await database_js_1.db.select().from(masterData_js_1.staff).where((0, drizzle_orm_1.eq)(masterData_js_1.staff.tenantId, tenantId));
            }
            catch {
                return [];
            }
        }
        return [];
    }
    async listQualitySpecs(tenantId) {
        if (tenantId) {
            try {
                return await database_js_1.db.select().from(masterData_js_1.qualitySpecs).where((0, drizzle_orm_1.eq)(masterData_js_1.qualitySpecs.tenantId, tenantId));
            }
            catch {
                return [];
            }
        }
        return [];
    }
    // ==========================================
    // 15. LABOUR STANDARDS & CREW MANNING
    // ==========================================
    async listLabourStandards(tenantId) {
        if (tenantId) {
            return [];
        }
        return inMemoryLabourStandards;
    }
    async createLabourStandard(tenantId, input) {
        const newId = `LBR-0${inMemoryLabourStandards.length + 1}`;
        const rawCost = input.directCostPerHour !== undefined ? input.directCostPerHour.toString().trim() : "$25.00";
        const costStr = rawCost.startsWith("$") ? rawCost : `$${rawCost}`;
        const newStandard = {
            id: input.id || newId,
            lineId: input.lineId || "LIN-01",
            lineName: input.lineName || "Production Line",
            standardCrew: Number(input.standardCrew) || 8,
            stdLaborHoursPer1kUnits: Number(input.stdLaborHoursPer1kUnits) || 2.0,
            directCostPerHour: costStr,
            status: input.status || "Active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        inMemoryLabourStandards.unshift(newStandard);
        return newStandard;
    }
    async updateLabourStandard(tenantId, id, input) {
        const idx = inMemoryLabourStandards.findIndex((s) => s.id === id);
        if (idx !== -1) {
            let costStr = inMemoryLabourStandards[idx].directCostPerHour;
            if (input.directCostPerHour !== undefined) {
                const raw = input.directCostPerHour.toString().trim();
                costStr = raw.startsWith("$") ? raw : `$${raw}`;
            }
            inMemoryLabourStandards[idx] = {
                ...inMemoryLabourStandards[idx],
                ...input,
                standardCrew: input.standardCrew !== undefined ? Number(input.standardCrew) : inMemoryLabourStandards[idx].standardCrew,
                stdLaborHoursPer1kUnits: input.stdLaborHoursPer1kUnits !== undefined ? Number(input.stdLaborHoursPer1kUnits) : inMemoryLabourStandards[idx].stdLaborHoursPer1kUnits,
                directCostPerHour: costStr,
                updatedAt: new Date().toISOString()
            };
            return inMemoryLabourStandards[idx];
        }
        return { id, ...input };
    }
    async deleteLabourStandard(tenantId, id) {
        const idx = inMemoryLabourStandards.findIndex((s) => s.id === id);
        if (idx !== -1) {
            const deleted = inMemoryLabourStandards.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Labour standard deleted" };
    }
}
exports.MasterDataService = MasterDataService;
exports.masterDataService = new MasterDataService();
//# sourceMappingURL=masterData.service.js.map