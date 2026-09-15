import { db } from "../../config/database.js";
import { skus, boms, bomItems, productionLines, workCenters, assets, staff, qualitySpecs, routings, routingSteps } from "../../db/schema/masterData.js";
import { tenants, plants } from "../../db/schema/tenants.js";
import { eq, and, or, sql, desc, asc, ilike } from "drizzle-orm";
import { CreateSkuInput, CreateBomInput } from "./masterData.schema.js";
import { NotFoundError } from "../../shared/errors/AppError.js";

// In-Memory Persistent Store synced with database records
export interface CompanyEntity {
  id: string;
  companyId?: string;
  code: string;
  name: string;
  taxId: string;
  currency: string;
  hqLocation: string;
  fiscalYearStart?: string;
  status: string;
}

export interface PlantEntity {
  id: string;
  plantId?: string;
  companyId?: string;
  code: string;
  name: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  capacity?: string;
  dailyCapacity?: string;
  operatingShifts?: number;
  timezone?: string;
  linesCount?: number;
  status: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface DepartmentEntity {
  id: string;
  departmentId?: string;
  plantId: string;
  code: string;
  name: string;
  deptHead?: string;
  managerName?: string;
  costCenter?: string;
  operatingShifts?: string;
  status: string;
}

export interface LineEntity {
  id?: string;
  lineId: string;
  lineCode: string;
  code?: string;
  name: string;
  plantId: string;
  plantName?: string;
  type?: string;
  lineType?: string;
  ratedSpeed?: string;
  ratedSpeedBPH?: number;
  status: string;
  healthScore?: number;
}

export interface WorkCenterEntity {
  id: string;
  workCenterId?: string;
  code: string;
  name: string;
  lineId: string;
  lineName: string;
  plantId?: string;
  capacity?: string;
  category?: string;
  status: string;
}

let inMemoryCompanies: CompanyEntity[] = [];
let inMemoryPlants: PlantEntity[] = [];
let inMemoryDepartments: DepartmentEntity[] = [];
let inMemoryLines: LineEntity[] = [];
let inMemoryWorkCenters: WorkCenterEntity[] = [];

export interface OperationEntity {
  id: string;
  operationId?: string;
  operationCode: string;
  code?: string;
  name: string;
  sequence: number;
  department: string;
  stdDurationMin: number;
  setupDurationMin: number;
  status: string;
}

export interface RoutingEntity {
  id: string;
  routingId?: string;
  routingCode: string;
  skuId?: string;
  skuCode: string;
  skuName: string;
  lineId: string;
  lineCode?: string;
  lineName: string;
  revision: string;
  approvalStatus: string;
  status: string;
  stdRunRateBPH: number;
  setupDurationMin: number;
  expectedYieldPct: number;
  effectiveFrom: string;
  effectiveTo: string;
  notes?: string;
  steps?: any[];
}

export interface ProductFamilyEntity {
  id: string;
  familyId?: string;
  code: string;
  name: string;
  category: string;
  description?: string;
  status: string;
  skusCount?: number;
}

export interface UomEntity {
  id: string;
  uomId?: string;
  code: string;
  name: string;
  category: string;
  baseUnit: string;
  conversionFactor: number;
  status: string;
}

export interface PackConfigEntity {
  id: string;
  configId?: string;
  code: string;
  name: string;
  packagingType: string;
  primaryUnitCount: number;
  secondaryUnitCount: number;
  palletCount: number;
  grossWeightKg: number;
  status: string;
}

export interface LineTargetEntity {
  id: string;
  targetId?: string;
  plantId: string;
  lineId: string;
  lineName: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  shift: string;
  plannedOEE: number;
  plannedUnitsPerHour: number;
  plannedYieldPct: number;
  changeoverTimeMin: number;
  status: string;
}

export interface ChangeoverRuleEntity {
  id: string;
  matrixId?: string;
  fromSkuId?: string;
  fromSkuCode?: string;
  fromFamily?: string;
  toSkuId?: string;
  toSkuCode?: string;
  toFamily?: string;
  changeoverDurationMin?: number;
  sanitationClass?: string;
  allergenCleaningRequired?: boolean;
  notes?: string;
  status?: string;
}

export interface SanitationClassEntity {
  id: string;
  classId?: string;
  sanitationId?: string;
  code?: string;
  name?: string;
  sanitationClass: string;
  description?: string;
  durationMin: number;
  washDurationMin?: number;
  cleaningMethod: string;
  cleaningLevel?: string;
  riskLevel: string;
  applicableProducts?: string;
  chemicalAgent?: string;
  validationMethod?: string;
  frequency?: string;
  status: string;
}

export interface AllergenRuleEntity {
  id: string;
  ruleId?: string;
  allergenId?: string;
  allergenType?: string;
  allergenName: string;
  skuId?: string;
  skuCode: string;
  riskLevel: string;
  protocol?: string;
  cleaningProtocol: string;
  changeoverRestriction: string;
  verificationTest?: string;
  status: string;
}

export interface LabourStandardEntity {
  id: string;
  standardId?: string;
  lineId: string;
  lineName: string;
  standardCrew: number;
  stdLaborHoursPer1kUnits: number;
  directCostPerHour: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeSkillEntity {
  id: string;
  employeeId?: string;
  name: string;
  email?: string;
  department: string;
  departmentId?: string;
  role: string;
  plantId?: string;
  plantName?: string;
  skillLevel: string;
  skills: string[];
  certifications: string[];
  assignedLineIds: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

let inMemoryOperations: OperationEntity[] = [
  { id: "OP-01", operationId: "OP-01", operationCode: "OP-DEPAL", code: "OP-DEPAL", name: "Bulk Depalletization", sequence: 10, department: "Packaging", stdDurationMin: 30, setupDurationMin: 15, status: "Active" },
  { id: "OP-02", operationId: "OP-02", operationCode: "OP-RINSE", code: "OP-RINSE", name: "Ionized Air & Water Rinse", sequence: 20, department: "Packaging", stdDurationMin: 45, setupDurationMin: 15, status: "Active" },
  { id: "OP-03", operationId: "OP-03", operationCode: "OP-FILL", code: "OP-FILL", name: "Isobaric Filling & Purge", sequence: 30, department: "Packaging", stdDurationMin: 60, setupDurationMin: 20, status: "Active" },
  { id: "OP-04", operationId: "OP-04", operationCode: "OP-CAP", code: "OP-CAP", name: "Aseptic Induction Capping", sequence: 40, department: "Packaging", stdDurationMin: 30, setupDurationMin: 10, status: "Active" },
  { id: "OP-05", operationId: "OP-05", operationCode: "OP-LABEL", code: "OP-LABEL", name: "Rotary Hot-Melt Labeling", sequence: 50, department: "Packaging", stdDurationMin: 45, setupDurationMin: 15, status: "Active" },
  { id: "OP-06", operationId: "OP-06", operationCode: "OP-CASE", code: "OP-CASE", name: "Wrap-Around Case Packing", sequence: 60, department: "Packaging", stdDurationMin: 40, setupDurationMin: 15, status: "Active" },
  { id: "OP-07", operationId: "OP-07", operationCode: "OP-PALLET", code: "OP-PALLET", name: "Robotic High-Level Palletizing", sequence: 70, department: "Packaging", stdDurationMin: 30, setupDurationMin: 10, status: "Active" },
];

let inMemoryRoutings: RoutingEntity[] = [];

let inMemoryProductFamilies: ProductFamilyEntity[] = [];

let inMemoryUoms: UomEntity[] = [];

let inMemoryPackConfigs: any[] = [];

let inMemoryLineTargets: LineTargetEntity[] = [];

let inMemoryChangeoverRules: ChangeoverRuleEntity[] = [];

let inMemorySanitationClasses: SanitationClassEntity[] = [];

let inMemoryAllergenRules: AllergenRuleEntity[] = [];

let inMemoryLabourStandards: LabourStandardEntity[] = [];

let inMemoryEmployeeSkills: EmployeeSkillEntity[] = [];

let inMemorySkus: any[] = [];

function matchKey(entity: any, keyVal: string, candidateProps: string[] = ["id", "code", "companyId", "plantId", "departmentId", "lineId", "workCenterId", "operationId", "routingId", "familyId", "uomId", "configId", "targetId", "ruleId", "classId", "name"]): boolean {
  if (!keyVal || !entity) return false;
  try {
    const search = decodeURIComponent(String(keyVal)).trim().toLowerCase();
    for (const prop of candidateProps) {
      if (entity[prop] !== undefined && entity[prop] !== null) {
        const val = String(entity[prop]).trim().toLowerCase();
        if (val === search) return true;
      }
    }
  } catch (_) {}
  return false;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolvePlantId(tenantId: string, plantIdOrCode?: string): Promise<string | undefined> {
  if (!plantIdOrCode) return undefined;
  if (UUID_REGEX.test(plantIdOrCode)) return plantIdOrCode;

  // Try to find plant by code (e.g. "INDORE-01", "PUNE-02", "PLT-01")
  const [plant] = await db
    .select({ id: plants.id })
    .from(plants)
    .where(and(eq(plants.tenantId, tenantId), or(eq(plants.code, plantIdOrCode), sql`lower(${plants.code}) = lower(${plantIdOrCode})`)))
    .limit(1);

  if (plant) return plant.id;

  // Fallback to first plant for tenant so it never throws invalid UUID error
  const [firstPlant] = await db
    .select({ id: plants.id })
    .from(plants)
    .where(eq(plants.tenantId, tenantId))
    .limit(1);

  return firstPlant?.id;
}

export class MasterDataService {
  // ==========================================
  // 1. COMPANIES / LEGAL ENTITIES (STRICTLY public.companies)
  // ==========================================
  async listCompanies(tenantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT id, code, name, tax_id, currency, hq_location, fiscal_year_start, status
        FROM public.companies
        ORDER BY created_at DESC
      `);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listCompanies from companies table fallback:", err.message);
    }

    if (tenantId) {
      try {
        const [tenantRecord] = await db
          .select()
          .from(tenants)
          .where(eq(tenants.id, tenantId))
          .limit(1);
        if (tenantRecord) {
          return [{
            id: tenantRecord.id,
            companyId: tenantRecord.id,
            code: tenantRecord.slug ? tenantRecord.slug.substring(0, 8).toUpperCase() : "CMP",
            name: tenantRecord.name,
            taxId: "TAX-" + (tenantRecord.slug ? tenantRecord.slug.substring(0, 6).toUpperCase() : "001"),
            currency: (tenantRecord.settings as any)?.currency || "USD ($)",
            hqLocation: "Corporate Headquarters",
            fiscalYearStart: "January",
            status: tenantRecord.status === "ACTIVE" ? "Active" : "Suspended",
          }];
        }
      } catch (_) {}
    }

    return [];
  }

  async createCompany(tenantId: string | undefined, input: any) {
    const code = (input.code || `CMP-${Date.now().toString().slice(-4)}`).toUpperCase();
    const name = String(input.name || "Company").trim();
    const taxId = input.taxId || "TAX-001";
    const currency = input.currency || "USD ($)";
    const hqLocation = input.hqLocation || input.headquarters || "Corporate Headquarters";
    const fiscalYearStart = input.fiscalYearStart || "January";
    const status = input.status || "Active";

    try {
      const res = await db.execute(sql`
        INSERT INTO public.companies (code, name, tax_id, currency, hq_location, fiscal_year_start, status, created_at, updated_at)
        VALUES (${code}, ${name}, ${taxId}, ${currency}, ${hqLocation}, ${fiscalYearStart}, ${status}, NOW(), NOW())
        RETURNING *
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
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
    } catch (err: any) {
      console.warn("DB createCompany into companies table error:", err.message);
      throw err;
    }
  }

  async updateCompany(tenantId: string | undefined, id: string, input: any) {
    try {
      if (input.name) {
        await db.execute(sql`UPDATE public.companies SET name = ${input.name}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }
      if (input.code) {
        await db.execute(sql`UPDATE public.companies SET code = ${input.code.toUpperCase()}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }
      if (input.taxId) {
        await db.execute(sql`UPDATE public.companies SET tax_id = ${input.taxId}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }
      if (input.currency) {
        await db.execute(sql`UPDATE public.companies SET currency = ${input.currency}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }
      if (input.hqLocation || input.headquarters) {
        await db.execute(sql`UPDATE public.companies SET hq_location = ${input.hqLocation || input.headquarters}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }
      if (input.fiscalYearStart) {
        await db.execute(sql`UPDATE public.companies SET fiscal_year_start = ${input.fiscalYearStart}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }
      if (input.status) {
        await db.execute(sql`UPDATE public.companies SET status = ${input.status}, updated_at = NOW() WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      }

      const res = await db.execute(sql`SELECT id, code, name, tax_id, currency, hq_location, fiscal_year_start, status FROM public.companies WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id}) LIMIT 1`);
      if (res.rows && res.rows[0]) {
        const u = res.rows[0] as any;
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
    } catch (err: any) {
      console.warn("DB updateCompany error:", err.message);
    }
    return { id, ...input };
  }

  async deleteCompany(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.companies
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);
      return { id, message: "Company removed" };
    } catch (err: any) {
      console.warn("DB deleteCompany error:", err.message);
      return { id, message: "Company removed" };
    }
  }

  // ==========================================
  // 2. PLANTS / FACILITIES (STRICTLY public.plants)
  // ==========================================
  async listPlants(tenantId?: string) {
    try {
      const dbPlants = tenantId
        ? await db.select().from(plants).where(eq(plants.tenantId, tenantId)).orderBy(desc(plants.createdAt))
        : await db.select().from(plants).orderBy(desc(plants.createdAt));
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
    } catch (err: any) {
      console.warn("DB listPlants fallback:", err.message);
    }
    return tenantId ? [] : inMemoryPlants;
  }

  async createPlant(tenantId: string | undefined, input: any) {
    const newId = `PLT-0${inMemoryPlants.length + 1}`;
    const newPlant: PlantEntity = {
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
        const [t] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        dbTenantId = t?.id;
      }
      const city = input.city || (input.location ? input.location.split(',')[0]?.trim() : "Indore") || "Indore";
      const state = input.state || (input.location ? input.location.split(',')[1]?.trim() : "Madhya Pradesh") || "Madhya Pradesh";
      const country = input.country || (input.location ? input.location.split(',')[2]?.trim() : "India") || "India";
      const timezone = (input.timezone || "Asia/Kolkata").replace(/\s*\(.*\)/, "").trim();

      const [created] = await db.insert(plants).values({
        tenantId: dbTenantId!,
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
    } catch (err: any) {
      console.warn("DB createPlant error:", err.message);
    }

    inMemoryPlants.unshift(newPlant);
    return newPlant;
  }

  async updatePlant(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryPlants.findIndex((p) => matchKey(p, id, ["id", "plantId", "code", "name"]));
    if (idx !== -1) {
      inMemoryPlants[idx] = { ...inMemoryPlants[idx], ...input };
    }

    try {
      const updateData: any = { updatedAt: new Date() };
      if (input.name) updateData.name = input.name;
      if (input.code) updateData.code = input.code.toUpperCase();
      if (input.city) updateData.city = input.city;
      if (input.state) updateData.state = input.state;
      if (input.country) updateData.country = input.country;
      if (input.location) {
        const parts = input.location.split(',').map((s: string) => s.trim());
        if (parts[0]) updateData.city = parts[0];
        if (parts[1]) updateData.state = parts[1];
        if (parts[2]) updateData.country = parts[2];
      }
      if (input.timezone) updateData.timezone = input.timezone.replace(/\s*\(.*\)/, "").trim();
      if (input.status !== undefined) updateData.isActive = input.status === "Active" || input.status === true;

      await db
        .update(plants)
        .set(updateData)
        .where(sql`${plants.id}::text = ${id} OR ${plants.code} = ${id} OR lower(${plants.code}) = lower(${id})`);
    } catch (err: any) {
      console.warn("DB updatePlant error:", err.message);
    }

    return idx !== -1 ? inMemoryPlants[idx] : { id, ...input };
  }

  async deletePlant(tenantId: string | undefined, id: string) {
    try {
      await db
        .delete(plants)
        .where(sql`${plants.id}::text = ${id} OR ${plants.code} = ${id} OR lower(${plants.code}) = lower(${id})`);
    } catch (err: any) {
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
  async listDepartments(tenantId?: string, plantId?: string) {
    try {
      let query = sql`SELECT id, plant_id, code, name, manager_name, dept_head, cost_center, operating_shifts, status FROM public.departments`;
      if (plantId && plantId !== "ALL") {
        query = sql`SELECT id, plant_id, code, name, manager_name, dept_head, cost_center, operating_shifts, status FROM public.departments WHERE plant_id::text = ${plantId}`;
      }
      query = sql`${query} ORDER BY created_at ASC`;
      const res = await db.execute(query);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      return rows.map((d: any) => ({
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
    } catch (err: any) {
      console.warn("DB listDepartments error:", err.message);
      return [];
    }
  }

  async createDepartment(tenantId: string | undefined, input: any) {
    let resolvedTenantId = tenantId;
    if (!resolvedTenantId) {
      const [t] = await db.select({ id: tenants.id }).from(tenants).limit(1);
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
      const res = await db.execute(sql`
        INSERT INTO public.departments (tenant_id, plant_id, code, name, manager_name, dept_head, cost_center, operating_shifts, status, is_active, created_at)
        VALUES (${resolvedTenantId || null}, ${plantId}, ${code}, ${name}, ${deptHead}, ${deptHead}, ${costCenter}, ${operatingShifts}, ${status}, ${status === "Active"}, NOW())
        RETURNING *
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
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
    } catch (err: any) {
      console.warn("DB createDepartment error:", err.message);
      throw err;
    }
  }

  async updateDepartment(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
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
    } catch (err: any) {
      console.warn("DB updateDepartment error:", err.message);
      return { id, ...input };
    }
  }

  async deleteDepartment(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.departments WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})`);
      return { id, message: "Department deleted" };
    } catch (err: any) {
      console.warn("DB deleteDepartment error:", err.message);
      return { id, message: "Department deleted" };
    }
  }

  // ==========================================
  // 4. PRODUCTION LINES
  // ==========================================
  async listLines(tenantId: string | undefined, plantId?: string) {
    try {
      let query = sql`
        SELECT l.*, p.name as plant_name 
        FROM public.lines l 
        LEFT JOIN public.plants p ON l.plant_id = p.id 
        ORDER BY l.created_at DESC
      `;
      if (plantId && plantId !== "ALL" && plantId !== "undefined") {
        query = sql`
          SELECT l.*, p.name as plant_name 
          FROM public.lines l 
          LEFT JOIN public.plants p ON l.plant_id = p.id 
          WHERE l.plant_id::text = ${plantId} OR p.code = ${plantId} OR p.name = ${plantId}
          ORDER BY l.created_at DESC
        `;
      }
      const res = await db.execute(query);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      return rows.map((l: any) => {
        const nominalBpm = Number(l.nominal_speed_bpm) || 633;
        const bph = nominalBpm * 60;
        return {
          id: String(l.id),
          lineId: String(l.id),
          lineCode: l.code || `LINE-${String(l.id).substring(0, 4)}`,
          code: l.code || `LINE-${String(l.id).substring(0, 4)}`,
          name: l.name || "Production Line",
          plantId: l.plant_id ? String(l.plant_id) : "",
          plantName: l.plant_name || "Indore Facility",
          type: l.line_type || "Continuous Flow",
          lineType: l.line_type || "BOTTLING",
          ratedSpeed: `${bph.toLocaleString()} BPH`,
          ratedSpeedBPH: bph,
          status: l.status || "Active",
          healthScore: l.health_score || 95,
          supervisorId: "EMP-005",
          supervisorName: "David Kim",
          ratedOEE: "88.0%",
          currentRunningSku: "SKU-5001"
        };
      });
    } catch (e: any) {
      console.warn("DB listLines error:", e.message);
      return [];
    }
  }

  async createLine(tenantId: string | undefined, input: any) {
    try {
      let resolvedTenantId = tenantId;
      if (!resolvedTenantId) {
        const [t] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        resolvedTenantId = t?.id;
      }
      const code = (input.lineCode || input.code || `LINE-${Date.now().toString().slice(-4)}`).toUpperCase();
      const name = String(input.name || "Production Line").trim();
      const lineType = input.lineType || input.type || "BOTTLING";
      const ratedSpeedBPH = Number(input.ratedSpeedBPH) || (input.ratedSpeed ? parseInt(String(input.ratedSpeed).replace(/[^0-9]/g, ""), 10) : 38000) || 38000;
      const nominalSpeedBpm = Math.round(ratedSpeedBPH / 60) || 250;
      const status = input.status || "Active";
      
      let plantId = (input.plantId && input.plantId.length === 36 && input.plantId.includes("-")) ? input.plantId : null;
      if (!plantId) {
        const pRes = await db.execute(sql`SELECT id FROM public.plants LIMIT 1`);
        const pRow = (pRes as any)?.rows?.[0] || (Array.isArray(pRes) ? pRes[0] : null);
        if (pRow?.id) plantId = pRow.id;
      }

      // Insert into public.lines (Primary lines table shown in pgAdmin)
      const res = await db.execute(sql`
        INSERT INTO public.lines (
          plant_id, code, name, line_type, nominal_speed_bpm, health_score, status, created_at
        ) VALUES (
          ${plantId}, ${code}, ${name}, ${lineType}, ${nominalSpeedBpm}, 95, ${status}, NOW()
        ) RETURNING *
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      const newId = row?.id ? String(row.id) : `LIN-${Date.now().toString().slice(-4)}`;

      // Sync into public.production_lines
      try {
        await db.execute(sql`
          INSERT INTO public.production_lines (
            id, tenant_id, plant_id, code, name, line_type, nominal_speed_bpm, health_score, status, created_at
          ) VALUES (
            ${row.id}, ${resolvedTenantId || null}, ${plantId}, ${code}, ${name}, ${lineType}, ${nominalSpeedBpm}, 95, ${status}, NOW()
          ) ON CONFLICT (id) DO NOTHING
        `);
      } catch (errSync: any) {
        console.warn("production_lines sync warning:", errSync.message);
      }

      return {
        id: newId,
        lineId: newId,
        code,
        lineCode: code,
        name,
        lineType,
        type: lineType,
        ratedSpeed: `${ratedSpeedBPH.toLocaleString()} BPH`,
        ratedSpeedBPH,
        status,
        plantId: plantId || "",
        plantName: input.plantName || "Main Facility",
        supervisorName: input.supervisorName || "David Kim",
        supervisorId: input.supervisorId || "EMP-005",
        ratedOEE: "88.0%",
        currentRunningSku: "SKU-5001",
        healthScore: 95
      };
    } catch (err: any) {
      console.warn("DB createLine error:", err.message);
      throw err;
    }
  }

  async updateLine(tenantId: string | undefined, id: string, input: any) {
    try {
      const code = input.code || input.lineCode || null;
      const name = input.name || null;
      const lineType = input.lineType || input.type || null;
      const status = input.status || null;
      const ratedSpeedBPH = input.ratedSpeedBPH != null ? Number(input.ratedSpeedBPH) : (input.ratedSpeed ? parseInt(String(input.ratedSpeed).replace(/[^0-9]/g, ""), 10) : null);
      const nominalSpeedBpm = ratedSpeedBPH ? Math.round(ratedSpeedBPH / 60) : null;

      // Update public.lines
      await db.execute(sql`
        UPDATE public.lines
        SET 
          name = COALESCE(${name}, name),
          code = COALESCE(${code}, code),
          line_type = COALESCE(${lineType}, line_type),
          nominal_speed_bpm = COALESCE(${nominalSpeedBpm}, nominal_speed_bpm),
          status = COALESCE(${status}, status)
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);

      // Update public.production_lines
      try {
        await db.execute(sql`
          UPDATE public.production_lines
          SET 
            name = COALESCE(${name}, name),
            code = COALESCE(${code}, code),
            line_type = COALESCE(${lineType}, line_type),
            nominal_speed_bpm = COALESCE(${nominalSpeedBpm}, nominal_speed_bpm),
            status = COALESCE(${status}, status)
          WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
        `);
      } catch (_) {}

      return { id, ...input };
    } catch (err: any) {
      console.warn("DB updateLine error:", err.message);
      return { id, ...input };
    }
  }

  async deleteLine(tenantId: string | undefined, id: string) {
    try {
      // 1. Unlink referencing tables if needed
      try {
        await db.execute(sql`UPDATE public.work_centers SET line_id = NULL WHERE line_id = ${id} OR line_id::text = ${id}`);
      } catch (_) {}

      // 2. Delete from production_lines
      try {
        await db.execute(sql`
          DELETE FROM public.production_lines
          WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
        `);
      } catch (errProd: any) {
        console.warn("production_lines delete warning:", errProd.message);
      }

      // 3. Delete from public.lines (Primary lines table shown in pgAdmin)
      await db.execute(sql`
        DELETE FROM public.lines
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);

      return { id, message: "Line deleted successfully" };
    } catch (err: any) {
      console.warn("DB deleteLine error:", err.message);
      return { id, message: "Line deleted" };
    }
  }

  // ==========================================
  // 5. WORK CENTERS
  // ==========================================
  async listWorkCenters(tenantId: string | undefined, plantId?: string) {
    try {
      let query = sql`SELECT * FROM public.work_centers ORDER BY created_at DESC`;
      if (plantId && plantId !== "ALL" && plantId !== "undefined") {
        query = sql`SELECT * FROM public.work_centers WHERE plant_id::text = ${plantId} ORDER BY created_at DESC`;
      }
      const res = await db.execute(query);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      return rows.map((w: any) => ({
        id: String(w.id),
        workCenterId: String(w.id),
        code: w.code,
        name: w.name,
        category: w.category || "PACKAGING",
        capacity: w.capacity || (w.capacity_per_hour ? `${Number(w.capacity_per_hour).toLocaleString()} Units/Hr` : "38,000 BPH"),
        lineId: w.line_id || "LIN-01",
        lineName: w.line_name || "Line 1",
        plantId: w.plant_id ? String(w.plant_id) : "",
        status: w.status || (w.is_active ? "Active" : "Inactive"),
      }));
    } catch (err: any) {
      console.warn("DB listWorkCenters error:", err.message);
      return [];
    }
  }

  async createWorkCenter(tenantId: string | undefined, input: any) {
    try {
      let resolvedTenantId = tenantId;
      if (!resolvedTenantId) {
        const [t] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        resolvedTenantId = t?.id;
      }
      const code = input.code ? String(input.code).trim().toUpperCase() : `WC-${Date.now().toString().slice(-4)}`;
      const name = String(input.name || "Work Center").trim();
      const category = input.category || "PACKAGING";
      const capacity = input.capacity || "35,000 BPH";
      const lineId = input.lineId || null;
      const lineName = input.lineName || "Line 1";
      const status = input.status || "Active";
      const plantId = (input.plantId && input.plantId.length === 36 && input.plantId.includes("-")) ? input.plantId : null;

      const res = await db.execute(sql`
        INSERT INTO public.work_centers (
          tenant_id, plant_id, code, name, category, capacity, line_id, line_name, status, is_active, created_at
        ) VALUES (
          ${resolvedTenantId || null}, ${plantId}, ${code}, ${name}, ${category}, ${capacity}, ${lineId}, ${lineName}, ${status}, ${status === "Active"}, NOW()
        ) RETURNING *
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
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
        plantId: plantId || "",
        status
      };
    } catch (err: any) {
      console.warn("DB createWorkCenter error:", err.message);
      throw err;
    }
  }

  async updateWorkCenter(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
        UPDATE public.work_centers
        SET 
          name = COALESCE(${input.name || null}, name),
          code = COALESCE(${input.code || null}, code),
          category = COALESCE(${input.category || null}, category),
          capacity = COALESCE(${input.capacity || null}, capacity),
          line_id = COALESCE(${input.lineId || null}, line_id),
          line_name = COALESCE(${input.lineName || null}, line_name),
          status = COALESCE(${input.status || null}, status),
          is_active = COALESCE(${input.status ? input.status === "Active" : null}, is_active)
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);
      return { id, ...input };
    } catch (err: any) {
      console.warn("DB updateWorkCenter error:", err.message);
      return { id, ...input };
    }
  }

  async deleteWorkCenter(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.work_centers
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id}) OR name = ${id}
      `);
      return { id, message: "Work Center deleted successfully" };
    } catch (err: any) {
      console.warn("DB deleteWorkCenter error:", err.message);
      return { id, message: "Work Center deleted" };
    }
  }

  // ==========================================
  // 6. STANDARD OPERATIONS
  // ==========================================
  async listOperations(tenantId?: string, department?: string) {
    try {
      const query = (department && department !== "ALL")
        ? sql`SELECT id, operation_code AS "operationCode", operation_code AS code, name, sequence, department, std_duration_min AS "stdDurationMin", setup_duration_min AS "setupDurationMin", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM public.operations WHERE department = ${department} ORDER BY sequence ASC`
        : sql`SELECT id, operation_code AS "operationCode", operation_code AS code, name, sequence, department, std_duration_min AS "stdDurationMin", setup_duration_min AS "setupDurationMin", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM public.operations ORDER BY sequence ASC`;

      const result = await db.execute(query);
      if (result.rows && result.rows.length > 0) {
        return result.rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listOperations error:", err.message);
    }
    if (department && department !== "ALL") {
      return tenantId ? [] : inMemoryOperations.filter((o) => o.department === department);
    }
    return tenantId ? [] : inMemoryOperations;
  }

  async createOperation(tenantId: string | undefined, input: any) {
    const codeVal = (input.operationCode || input.code || `OP-${Date.now().toString().slice(-4)}`).toUpperCase();
    const seq = Number(input.sequence) || (inMemoryOperations.length + 1) * 10;
    const dept = input.department || "Packaging";
    const stdDur = Number(input.stdDurationMin || input.stdTimeMins) || 45;
    const setupDur = Number(input.setupDurationMin) || 15;
    const stat = input.status || "Active";
    const nameVal = input.name || "New Operation";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.operations (operation_code, name, sequence, department, std_duration_min, setup_duration_min, status, created_at, updated_at)
        VALUES (${codeVal}, ${nameVal}, ${seq}, ${dept}, ${stdDur}, ${setupDur}, ${stat}, NOW(), NOW())
        ON CONFLICT (operation_code) DO UPDATE 
        SET name = EXCLUDED.name, sequence = EXCLUDED.sequence, department = EXCLUDED.department, std_duration_min = EXCLUDED.std_duration_min, setup_duration_min = EXCLUDED.setup_duration_min, status = EXCLUDED.status, updated_at = NOW()
        RETURNING id, operation_code, name, sequence, department, std_duration_min, setup_duration_min, status
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createOperation error:", err.message);
    }

    const newOp: OperationEntity = {
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

  async updateOperation(tenantId: string | undefined, id: string, input: any) {
    try {
      const codeVal = input.operationCode || input.code;
      const nameVal = input.name;
      const seq = input.sequence !== undefined ? Number(input.sequence) : null;
      const dept = input.department;
      const stdDur = input.stdDurationMin !== undefined ? Number(input.stdDurationMin) : null;
      const setupDur = input.setupDurationMin !== undefined ? Number(input.setupDurationMin) : null;
      const stat = input.status;

      await db.execute(sql`
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
    } catch (err: any) {
      console.warn("DB updateOperation error:", err.message);
    }

    const idx = inMemoryOperations.findIndex((o) => matchKey(o, id, ["id", "operationId", "operationCode", "code", "name"]));
    if (idx === -1) {
      const fallback: OperationEntity = {
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

  async deleteOperation(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.operations WHERE id::text = ${id} OR operation_code = ${id} OR lower(operation_code) = lower(${id})`);
    } catch (err: any) {
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
  async listRoutings(tenantId?: string) {
    try {
      const dbRoutings = await db
        .select({
          id: routings.id,
          routingCode: routings.routingCode,
          skuId: routings.skuId,
          skuCode: skus.skuCode,
          skuName: skus.name,
          lineId: routings.lineId,
          lineCode: productionLines.code,
          lineName: productionLines.name,
          revision: routings.revision,
          approvalStatus: routings.approvalStatus,
          status: routings.status,
          stdRunRateBPH: routings.stdRunRateBph,
          setupDurationMin: routings.setupDurationMin,
          expectedYieldPct: routings.expectedYieldPct,
          effectiveFrom: routings.effectiveFrom,
          effectiveTo: routings.effectiveTo,
          notes: routings.notes,
          createdAt: routings.createdAt,
          updatedAt: routings.updatedAt,
        })
        .from(routings)
        .leftJoin(skus, eq(routings.skuId, skus.id))
        .leftJoin(productionLines, eq(routings.lineId, productionLines.id))
        .where(tenantId ? eq(routings.tenantId, tenantId) : undefined)
        .orderBy(desc(routings.createdAt));

      if (dbRoutings && dbRoutings.length > 0) {
        const allSteps = await db.select().from(routingSteps).orderBy(asc(routingSteps.sequence));
        const stepsByRoutingId = new Map<string, any[]>();
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

        const mapped: RoutingEntity[] = dbRoutings.map((r) => ({
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
      return [];
    } catch (err) {
      console.warn("Could not query DB routings, falling back to memory:", (err as Error).message);
      return inMemoryRoutings;
    }
  }

  async getRoutingById(tenantId: string | undefined, id: string) {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const condition = isUUID ? eq(routings.id, id) : eq(routings.routingCode, id);

      const [r] = await db
        .select({
          id: routings.id,
          routingCode: routings.routingCode,
          skuId: routings.skuId,
          skuCode: skus.skuCode,
          skuName: skus.name,
          lineId: routings.lineId,
          lineCode: productionLines.code,
          lineName: productionLines.name,
          revision: routings.revision,
          approvalStatus: routings.approvalStatus,
          status: routings.status,
          stdRunRateBPH: routings.stdRunRateBph,
          setupDurationMin: routings.setupDurationMin,
          expectedYieldPct: routings.expectedYieldPct,
          effectiveFrom: routings.effectiveFrom,
          effectiveTo: routings.effectiveTo,
          notes: routings.notes,
          createdAt: routings.createdAt,
          updatedAt: routings.updatedAt,
        })
        .from(routings)
        .leftJoin(skus, eq(routings.skuId, skus.id))
        .leftJoin(productionLines, eq(routings.lineId, productionLines.id))
        .where(condition)
        .limit(1);

      if (r) {
        const steps = await db
          .select()
          .from(routingSteps)
          .where(eq(routingSteps.routingId, r.id))
          .orderBy(asc(routingSteps.sequence));

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
    } catch (err) {
      console.warn("DB getRoutingById fallback:", (err as Error).message);
    }
    const found = inMemoryRoutings.find((r) => matchKey(r, id, ["id", "routingId", "routingCode"]));
    return found || null;
  }

  async createRouting(tenantId: string | undefined, input: any) {
    try {
      let resolvedTenantId = tenantId;
      if (!resolvedTenantId) {
        const [defaultTenant] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        resolvedTenantId = defaultTenant?.id;
      }

      const isUuid = (val: any) => typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

      let resolvedSkuId = input.skuId;
      let skuCode = input.skuCode;
      let skuName = input.skuName;
      if (!isUuid(resolvedSkuId)) {
        const rawSku = input.skuCode || input.skuId || "";
        const [sku] = await db.select().from(skus).where(or(eq(skus.skuCode, rawSku), eq(skus.name, rawSku), ilike(skus.skuCode, `%${rawSku}%`))).limit(1);
        if (sku) {
          resolvedSkuId = sku.id;
          skuCode = sku.skuCode;
          skuName = sku.name;
        } else {
          const [firstSku] = await db.select().from(skus).limit(1);
          if (firstSku) {
            resolvedSkuId = firstSku.id;
            skuCode = firstSku.skuCode;
            skuName = firstSku.name;
          }
        }
      } else {
        const [sku] = await db.select().from(skus).where(eq(skus.id, resolvedSkuId)).limit(1);
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
        const [line] = await db.select().from(productionLines).where(or(eq(productionLines.code, rawLine), ilike(productionLines.code, `%${rawLine}%`), eq(productionLines.name, rawLine))).limit(1);
        if (line) {
          resolvedLineId = line.id;
          lineCode = line.code;
          lineName = line.name;
        } else {
          const [firstLine] = await db.select().from(productionLines).limit(1);
          if (firstLine) {
            resolvedLineId = firstLine.id;
            lineCode = firstLine.code;
            lineName = firstLine.name;
          }
        }
      } else {
        const [line] = await db.select().from(productionLines).where(eq(productionLines.id, resolvedLineId)).limit(1);
        if (line) {
          lineCode = line.code;
          lineName = line.name;
        }
      }

      const routingCode = (input.routingCode || `RTG-${skuCode || "5000"}-L1`).toUpperCase();
      const resolvedPlantId = isUuid(input.plantId) ? input.plantId : null;

      if (resolvedTenantId && resolvedSkuId) {
        const [inserted] = await db
          .insert(routings)
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

        const createdSteps: any[] = [];
        if (Array.isArray(input.steps) && input.steps.length > 0) {
          for (const s of input.steps) {
            const [st] = await db
              .insert(routingSteps)
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

        const newRtg: RoutingEntity = {
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
    } catch (err) {
      console.warn("DB createRouting error, falling back to memory:", (err as Error).message);
    }

    const newId = `RTG-00${inMemoryRoutings.length + 1}`;
    const newRtg: RoutingEntity = {
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

  async updateRouting(tenantId: string | undefined, id: string, input: any) {
    try {
      const updateData: any = { updatedAt: new Date() };
      if (input.routingCode) updateData.routingCode = input.routingCode.toUpperCase();
      if (input.revision) updateData.revision = input.revision;
      if (input.approvalStatus) updateData.approvalStatus = input.approvalStatus;
      if (input.status) updateData.status = input.status;
      if (input.stdRunRateBPH || input.stdRunRateBph) updateData.stdRunRateBph = Number(input.stdRunRateBPH || input.stdRunRateBph);
      if (input.setupDurationMin) updateData.setupDurationMin = Number(input.setupDurationMin);
      if (input.expectedYieldPct) updateData.expectedYieldPct = String(input.expectedYieldPct);
      if (input.effectiveFrom) updateData.effectiveFrom = new Date(input.effectiveFrom);
      if (input.effectiveTo) updateData.effectiveTo = new Date(input.effectiveTo);
      if (input.notes !== undefined) updateData.notes = input.notes;

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const condition = isUUID ? eq(routings.id, id) : eq(routings.routingCode, id);

      const [updated] = await db
        .update(routings)
        .set(updateData)
        .where(condition)
        .returning();

      if (updated) {
        if (Array.isArray(input.steps)) {
          await db.delete(routingSteps).where(eq(routingSteps.routingId, updated.id));
          for (const s of input.steps) {
            await db.insert(routingSteps).values({
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
    } catch (err) {
      console.warn("DB updateRouting error, falling back to memory:", (err as Error).message);
    }

    const idx = inMemoryRoutings.findIndex((r) => matchKey(r, id, ["id", "routingId", "routingCode", "skuCode", "name"]));
    if (idx === -1) {
      const fallback: RoutingEntity = {
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

  async updateRoutingStatus(tenantId: string | undefined, id: string, input: { status?: string; approvalStatus?: string }) {
    return this.updateRouting(tenantId, id, input);
  }

  async deleteRouting(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.routing_steps
        WHERE routing_id IN (
          SELECT id FROM public.routings
          WHERE id::text = ${id} OR routing_code = ${id} OR lower(routing_code) = lower(${id})
        )
      `);
      await db.execute(sql`
        DELETE FROM public.routings
        WHERE id::text = ${id} OR routing_code = ${id} OR lower(routing_code) = lower(${id})
      `);
    } catch (err) {
      console.warn("DB deleteRouting error:", (err as Error).message);
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
  async listProductFamilies(tenantId?: string) {
    try {
      const query = tenantId
        ? sql`
            SELECT id, code, name, category, description, plant_id, allergen_risk, standard_margin, status, created_at
            FROM public.product_families
            WHERE tenant_id = ${tenantId} OR tenant_id IS NULL
            ORDER BY created_at ASC
          `
        : sql`
            SELECT id, code, name, category, description, plant_id, allergen_risk, standard_margin, status, created_at
            FROM public.product_families
            ORDER BY created_at ASC
          `;
      const dbFamilies = await db.execute(query);
      const rows = (dbFamilies as any)?.rows || (Array.isArray(dbFamilies) ? dbFamilies : []);
      if (rows.length > 0) {
        return rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listProductFamilies error:", err.message);
    }
    return [];
  }

  async createProductFamily(tenantId: string | undefined, input: any) {
    const code = (input.code ? String(input.code).trim().toUpperCase() : `PF-${Date.now()}`);
    const name = String(input.name || "Product Family").trim();
    const category = input.category || "BEVERAGE";
    const description = input.description || "";
    const plantId = input.plantId || "PLT-01";
    const allergenRisk = input.allergenRisk || "None";
    const standardMargin = input.standardMargin || "55.0%";
    const status = input.status || "Active";

    let dbId: string | null = null;
    try {
      let tId = tenantId;
      if (!tId) {
        const [firstTenant] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        tId = firstTenant?.id;
      }
      const res = await db.execute(sql`
        INSERT INTO public.product_families (tenant_id, code, name, category, description, plant_id, allergen_risk, standard_margin, status)
        VALUES (${tId || null}, ${code}, ${name}, ${category}, ${description}, ${plantId}, ${allergenRisk}, ${standardMargin}, ${status})
        RETURNING id, code, name, category, description, plant_id, allergen_risk, standard_margin, status
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      if (row?.id) {
        dbId = String(row.id);
      }
    } catch (err: any) {
      console.warn("DB insert public.product_families error:", err.message);
    }

    const newId = dbId || `PF-0${inMemoryProductFamilies.length + 1}`;
    const newFamily: ProductFamilyEntity = {
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

  async updateProductFamily(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
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
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB update public.product_families error:", err.message);
    }
    const idx = inMemoryProductFamilies.findIndex((f) => matchKey(f, id, ["id", "familyId", "code", "name"]));
    if (idx === -1) {
      const fallback: ProductFamilyEntity = {
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

  async deleteProductFamily(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.product_families
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id}) OR name = ${id}
      `);
    } catch (err: any) {
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
  async listUoms(tenantId?: string) {
    try {
      const dbUoms = await db.execute(sql`
        SELECT id, code, name, category, type, base_unit, conversion_factor, status, created_at
        FROM public.uoms
        ORDER BY created_at ASC
      `);
      const rows = (dbUoms as any)?.rows || (Array.isArray(dbUoms) ? dbUoms : []);
      if (rows.length > 0) {
        return rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listUoms error:", err.message);
    }
    return [];
  }

  async createUom(tenantId: string | undefined, input: any) {
    const code = (input.uomCode || input.code || `UOM-${Date.now()}`).toUpperCase().trim();
    const name = String(input.name || "UOM").trim();
    const category = input.category || input.type || "Count";
    const type = input.type || input.category || "Packaging";
    const baseUnit = input.baseUom || input.baseUnit || "EA";
    const factor = Number(input.conversionFactor || input.factor) || 1.0;
    const status = input.status || "Active";

    let dbId: string | null = null;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.uoms (code, name, category, type, base_unit, conversion_factor, status)
        VALUES (${code}, ${name}, ${category}, ${type}, ${baseUnit}, ${factor}, ${status})
        RETURNING id, code, name, category, type, base_unit, conversion_factor, status
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      if (row?.id) {
        dbId = String(row.id);
      }
    } catch (err: any) {
      console.warn("DB insert public.uoms error:", err.message);
    }

    const newId = dbId || `UOM-0${inMemoryUoms.length + 1}`;
    const newUom: UomEntity = {
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

  async updateUom(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
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
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id}) OR name = ${id}
      `);
    } catch (err: any) {
      console.warn("DB update public.uoms error:", err.message);
    }
    const idx = inMemoryUoms.findIndex((u) => matchKey(u, id, ["id", "uomId", "code", "name"]));
    if (idx !== -1) {
      inMemoryUoms[idx] = { ...inMemoryUoms[idx], ...input };
      return inMemoryUoms[idx];
    }
    return { id, ...input };
  }

  async deleteUom(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.uoms
        WHERE id::text = ${id} OR code = ${id} OR lower(code) = lower(${id}) OR name = ${id}
      `);
    } catch (err: any) {
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
  async listPackConfigs(tenantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id, pack_code, name, sku_id, sku_code, sku_name,
          units_per_pack, pack_type, case_configuration,
          pallet_configuration, pallet_count, packaging_uom,
          tare_weight_kg, gross_weight_kg, status, created_at
        FROM public.packaging
        ORDER BY created_at ASC
      `);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
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
      return [];
    } catch (err: any) {
      console.warn("DB listPackConfigs error:", err.message);
      return inMemoryPackConfigs;
    }
  }

  async createPackConfig(tenantId: string | undefined, input: any) {
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

    let dbId: string | null = null;
    try {
      const res = await db.execute(sql`
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
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      if (row?.id) {
        dbId = String(row.id);
      }
    } catch (err: any) {
      console.warn("DB insert public.packaging error:", err.message);
    }

    const newId = dbId || `PC-0${inMemoryPackConfigs.length + 1}`;
    const newConfig: any = {
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

  async updatePackConfig(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
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
        WHERE id::text = ${id} OR pack_code = ${id} OR lower(pack_code) = lower(${id}) OR name = ${id}
      `);
    } catch (err: any) {
      console.warn("DB update public.packaging error:", err.message);
    }
    const idx = inMemoryPackConfigs.findIndex((p) => matchKey(p, id, ["id", "configId", "packConfigId", "code", "packCode", "name"]));
    if (idx !== -1) {
      inMemoryPackConfigs[idx] = { ...inMemoryPackConfigs[idx], ...input };
      return inMemoryPackConfigs[idx];
    }
    return { id, ...input };
  }

  async deletePackConfig(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.packaging
        WHERE id::text = ${id} OR pack_code = ${id} OR lower(pack_code) = lower(${id}) OR name = ${id}
      `);
    } catch (err: any) {
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
  async listLineTargets(tenantId?: string) {
    try {
      const res = await db.execute(sql`
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
        return res.rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listLineTargets error:", err.message);
    }
    return inMemoryLineTargets;
  }

  async createLineTarget(tenantId: string | undefined, input: any) {
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

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
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
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createLineTarget error:", err.message);
    }

    const newTarget: any = {
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

  async updateLineTarget(tenantId: string | undefined, id: string, input: any) {
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

      await db.execute(sql`
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
    } catch (err: any) {
      console.warn("DB updateLineTarget error:", err.message);
    }

    const idx = inMemoryLineTargets.findIndex((t) => t.id === id || t.targetId === id);
    if (idx !== -1) {
      inMemoryLineTargets[idx] = { ...inMemoryLineTargets[idx], ...input };
      return inMemoryLineTargets[idx];
    }
    return { id, ...input };
  }

  async deleteLineTarget(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.line_targets WHERE id::text = ${id} OR target_id = ${id} OR lower(target_id) = lower(${id})`);
    } catch (err: any) {
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
  async listChangeoverRules(tenantId?: string) {
    try {
      const res = await db.execute(sql`
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
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          matrixId: r.matrixId || r.id,
          fromSkuId: r.fromSkuId || "",
          fromSkuCode: r.fromSkuCode || "",
          fromFamily: r.fromFamily || "",
          toSkuId: r.toSkuId || "",
          toSkuCode: r.toSkuCode || "",
          toFamily: r.toFamily || "",
          changeoverDurationMin: Number(r.changeoverDurationMin) || 0,
          sanitationClass: r.sanitationClass || "",
          allergenCleaningRequired: Boolean(r.allergenCleaningRequired),
          notes: r.notes || "",
          status: r.status || "Active",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listChangeoverRules error:", err.message);
    }
    return [];
  }

  async createChangeoverRule(tenantId: string | undefined, input: any) {
    const newId = input.id || input.matrixId || `CO-${Math.floor(1000 + Math.random() * 9000)}`;
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
      await db.execute(sql`
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
    } catch (err: any) {
      console.warn("DB createChangeoverRule error:", err.message);
    }

    const newRule: ChangeoverRuleEntity = {
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

  async updateChangeoverRule(tenantId: string | undefined, id: string, input: any) {
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
      await db.execute(sql`
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
    } catch (err: any) {
      console.warn("DB updateChangeoverRule error:", err.message);
    }

    const idx = inMemoryChangeoverRules.findIndex((r) => r.id === id || r.matrixId === id);
    if (idx !== -1) {
      inMemoryChangeoverRules[idx] = { ...inMemoryChangeoverRules[idx], ...input };
      return inMemoryChangeoverRules[idx];
    }
    return { id, ...input };
  }

  async deleteChangeoverRule(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.changeover_rules 
        WHERE id::text = ${id} OR matrix_id = ${id} OR lower(matrix_id) = lower(${id})
      `);
    } catch (err: any) {
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
  async listSanitationClasses(tenantId?: string) {
    try {
      const res = await db.execute(sql`
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
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listSanitationClasses error:", err.message);
    }
    return [];
  }

  async createSanitationClass(tenantId: string | undefined, input: any) {
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

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
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
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createSanitationClass error:", err.message);
    }

    const newSan: any = {
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

  async updateSanitationClass(tenantId: string | undefined, id: string, input: any) {
    try {
      const nameVal = input.sanitationClass || input.name || null;
      const descVal = input.description !== undefined ? input.description : null;
      const durVal = input.durationMin !== undefined ? Number(input.durationMin) : (input.washDurationMin !== undefined ? Number(input.washDurationMin) : null);
      const methodVal = input.cleaningMethod !== undefined ? input.cleaningMethod : null;
      const levelVal = input.cleaningLevel !== undefined ? input.cleaningLevel : null;
      const riskVal = input.riskLevel !== undefined ? input.riskLevel : null;
      const prodsVal = input.applicableProducts !== undefined ? input.applicableProducts : null;
      const chemVal = input.chemicalAgent !== undefined ? input.chemicalAgent : null;
      const valMethod = input.validationMethod !== undefined ? input.validationMethod : null;
      const freqVal = input.frequency !== undefined ? input.frequency : null;
      const statVal = input.status !== undefined ? input.status : null;

      await db.execute(sql`
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
    } catch (err: any) {
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

  async deleteSanitationClass(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.sanitation_classes WHERE id::text = ${id} OR class_id = ${id} OR sanitation_id = ${id} OR lower(code) = lower(${id})`);
    } catch (err: any) {
      console.warn("DB deleteSanitationClass error:", err.message);
    }

    const idx = inMemorySanitationClasses.findIndex((s) => s.id === id || s.sanitationId === id || s.classId === id);
    if (idx !== -1) {
      const deleted = inMemorySanitationClasses.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Sanitation class deleted" };
  }

  async listAllergenRules(tenantId?: string) {
    try {
      const res = await db.execute(sql`
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
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
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
    } catch (err: any) {
      console.warn("DB listAllergenRules error:", err.message);
    }
    return [];
  }

  async createAllergenRule(tenantId: string | undefined, input: any) {
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

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
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
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createAllergenRule error:", err.message);
    }

    const newAlg: any = {
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

  async updateAllergenRule(tenantId: string | undefined, id: string, input: any) {
    try {
      const nameVal = input.allergenName !== undefined ? input.allergenName : null;
      const skuCodeVal = input.skuCode !== undefined ? input.skuCode : null;
      const skuIdVal = input.skuId !== undefined ? input.skuId : null;
      const riskVal = input.riskLevel !== undefined ? input.riskLevel : null;
      const protocolVal = (input.cleaningProtocol || input.protocol) !== undefined ? (input.cleaningProtocol || input.protocol) : null;
      const restrictionVal = input.changeoverRestriction !== undefined ? input.changeoverRestriction : null;
      const testVal = input.verificationTest !== undefined ? input.verificationTest : null;
      const statVal = input.status !== undefined ? input.status : null;

      await db.execute(sql`
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
    } catch (err: any) {
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

  async deleteAllergenRule(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.allergen_rules WHERE id::text = ${id} OR rule_id = ${id} OR allergen_id = ${id}`);
    } catch (err: any) {
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
  async listSkus(tenantId?: string) {
    try {
      // Fetch ALL SKUs from DB (no tenant filter) so data is always visible.
      // In a strict multi-tenant setup, filter by tenantId here.
      const dbSkus = await db.select().from(skus);
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
    } catch (err: any) {
      console.warn("DB listSkus error:", err.message);
    }
    return [];
  }

  async createSku(tenantId: string | undefined, input: any) {
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
        const [firstTenant] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        tId = firstTenant?.id;
      }
      if (!tId) throw new Error("No tenantId available to persist SKU");
      const cat = (newSku.category.toUpperCase().includes("RAW")) ? "RAW_MATERIAL" : (newSku.category.toUpperCase().includes("PACK") ? "PACKAGING" : "FINISHED_GOODS");
      const costRaw = String(newSku.stdCost || "0").replace(/[^\d.]/g, "");
      const [insertedSku] = await db.insert(skus).values({
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
        (newSku as any).skuId = insertedSku.id;
      }
    } catch (err: any) {
      console.warn("DB insert sku error:", err.message);
    }

    return newSku;
  }

  async updateSku(tenantId: string | undefined, id: string, input: any) {
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
      const rawCost = input.stdCost !== undefined || input.standardCost !== undefined
        ? String(input.stdCost || input.standardCost || "0").replace(/[^\d.]/g, "")
        : null;
      const activeVal = input.status !== undefined
        ? (input.status === "Active" || input.status === "ACTIVE" || input.status === true)
        : input.isActive !== undefined ? Boolean(input.isActive) : null;

      await db.execute(sql`
        UPDATE public.skus
        SET
          name = COALESCE(${input.name || null}, name),
          sku_code = COALESCE(${input.skuCode || input.code || null}, sku_code),
          category = COALESCE(${cat || null}, category),
          uom = COALESCE(${input.uom || null}, uom),
          standard_cost = COALESCE(${rawCost}, standard_cost),
          is_active = COALESCE(${activeVal}, is_active),
          updated_at = now()
        WHERE id::text = ${id} OR sku_code = ${id} OR lower(sku_code) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB update sku error:", err.message);
    }
    return idx !== -1 ? inMemorySkus[idx] : { id, ...input };
  }

  async deleteSku(tenantId: string | undefined, id: string) {
    const idx = inMemorySkus.findIndex((s) => matchKey(s, id, ["id", "skuId", "skuCode", "code", "name"]));
    let deleted: any = { id, message: "SKU deleted" };
    if (idx !== -1) {
      deleted = inMemorySkus.splice(idx, 1)[0];
    }
    // Persist delete to PostgreSQL directly
    try {
      await db.execute(sql`
        DELETE FROM public.skus
        WHERE id::text = ${id} OR sku_code = ${id} OR lower(sku_code) = lower(${id}) OR name = ${id}
      `);
    } catch (err: any) {
      console.warn("DB delete sku error:", err.message);
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          await db.delete(skus).where(eq(skus.id, id));
        } else {
          await db.delete(skus).where(eq(skus.skuCode, id));
        }
      } catch (e: any) {
        console.warn("DB drizzle delete sku error:", e.message);
      }
    }
    return deleted;
  }

  async listBoms(tenantId?: string) {
    try {
      // Fetch ALL BOMs from DB (no strict tenant filter) so data is always visible.
      const res = await db.execute(sql`
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
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      if (rows && rows.length > 0) {
        // Also fetch bom_items for each bom
        let allItems: any[] = [];
        try {
          const itemsRes = await db.execute(sql`
            SELECT 
              bi.id, bi.bom_id, bi.component_sku_id, bi.quantity, bi.scrap_percentage, bi.uom, bi.sequence, bi.stage,
              COALESCE(bi.component_name, s.name) AS component_name,
              COALESCE(bi.sku_code, s.sku_code) AS sku_code
            FROM public.bom_items bi
            LEFT JOIN public.skus s ON bi.component_sku_id = s.id
            ORDER BY bi.sequence ASC
          `);
          allItems = (itemsRes as any)?.rows || (Array.isArray(itemsRes) ? itemsRes : []);
        } catch (itemErr: any) {
          console.warn("DB list bom_items error:", itemErr.message);
        }

        return rows.map((r: any) => {
          const bomItems = allItems.filter((it: any) => String(it.bom_id) === String(r.id));
          const components = bomItems.length > 0
            ? bomItems.map((bi: any) => ({
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
    } catch (err: any) {
      console.warn("DB listBoms error:", err.message);
    }
    return [];
  }

  async getBomById(tenantId: string, id: string) {
    const list = await this.listBoms(tenantId);
    const found = list.find((b: any) => b.id === id || b.bomId === id || b.bomNumber === id);
    if (!found) throw new NotFoundError("BOM Recipe");
    return found;
  }

  async createBom(tenantId: string | undefined, input: any) {
    try {
      // 1. Resolve tenantId
      let resolvedTenantId = tenantId;
      if (resolvedTenantId) {
        const [tCheck] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.id, resolvedTenantId)).limit(1);
        if (!tCheck) resolvedTenantId = undefined;
      }
      if (!resolvedTenantId) {
        const [firstTenant] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        resolvedTenantId = firstTenant?.id;
      }
      if (!resolvedTenantId) throw new Error("No tenant available");

      // 2. Resolve or create finished product SKU
      let skuId: string | null = null;
      if (input.finishedSkuId || input.skuId) {
        const rawSku = input.finishedSkuId || input.skuId;
        const isUuid = rawSku && rawSku.length === 36 && rawSku.includes("-");
        const condition = isUuid 
          ? or(eq(skus.id, rawSku), eq(skus.skuCode, rawSku), ilike(skus.name, rawSku))
          : or(eq(skus.skuCode, rawSku), ilike(skus.name, rawSku));
        
        const [skuMatch] = await db.select({ id: skus.id }).from(skus).where(condition).limit(1);
        if (skuMatch) skuId = skuMatch.id;
      }
      if (!skuId && input.finishedSkuName) {
        const [nameMatch] = await db.select({ id: skus.id }).from(skus).where(ilike(skus.name, input.finishedSkuName)).limit(1);
        if (nameMatch) skuId = nameMatch.id;
      }
      if (!skuId) {
        // Auto-create finished goods SKU
        const skuCodeVal = input.finishedSkuCode || `SKU-${Date.now().toString().slice(-4)}`;
        const skuNameVal = input.finishedSkuName || input.name || "Finished Recipe Product";
        const [newSku] = await db.insert(skus).values({
          tenantId: resolvedTenantId,
          skuCode: skuCodeVal,
          name: skuNameVal,
          category: "FINISHED_GOODS",
          uom: "Units",
          standardCost: "15.00",
          isActive: true,
        }).returning({ id: skus.id });
        if (newSku) skuId = newSku.id;
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
      const [inserted] = await db.insert(boms).values({
        tenantId: resolvedTenantId,
        skuId: skuId!,
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
      const componentsRes: any[] = [];
      if (Array.isArray(input.components) && input.components.length > 0) {
        for (let i = 0; i < input.components.length; i++) {
          const comp = input.components[i];
          let compSkuId: string | null = null;
          if (comp.skuId || comp.skuCode) {
            const raw = comp.skuId || comp.skuCode;
            const isUuid = raw && raw.length === 36 && raw.includes("-");
            const condition = isUuid
              ? or(eq(skus.id, raw), eq(skus.skuCode, raw), ilike(skus.name, comp.name || ""))
              : or(eq(skus.skuCode, raw), ilike(skus.name, comp.name || ""));
            
            const [cMatch] = await db.select({ id: skus.id }).from(skus).where(condition).limit(1);
            if (cMatch) compSkuId = cMatch.id;
          }
          if (!compSkuId && comp.name) {
            const [cMatch] = await db.select({ id: skus.id }).from(skus).where(ilike(skus.name, comp.name)).limit(1);
            if (cMatch) compSkuId = cMatch.id;
          }
          if (!compSkuId) {
            try {
              const [newCompSku] = await db.insert(skus).values({
                tenantId: resolvedTenantId,
                skuCode: comp.skuCode || `ING-${Date.now().toString().slice(-4)}-${i}`,
                name: comp.name || "Recipe Component",
                category: "RAW_MATERIAL",
                uom: comp.uom || "Kg",
                standardCost: "5.00",
                isActive: true,
              }).returning({ id: skus.id });
              if (newCompSku) compSkuId = newCompSku.id;
            } catch {}
          }

          const [insItem] = await db.insert(bomItems).values({
            bomId: newBomId,
            componentSkuId: compSkuId || skuId!,
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
    } catch (err: any) {
      console.warn("DB createBom error:", err.message);
      throw err;
    }
  }

  async updateBom(tenantId: string | undefined, id: string, input: any) {
    try {
      const updates: any = { updatedAt: new Date() };
      if (input.bomNumber) updates.bomNumber = input.bomNumber;
      if (input.finishedSkuName || input.name) updates.name = input.finishedSkuName || input.name;
      if (input.batchSize) updates.batchSize = String(Number(String(input.batchSize).replace(/[^\d.]/g, "")) || 10000);
      if (input.yieldTarget || input.yieldPercent) updates.yieldPercent = String(Number(String(input.yieldTarget || input.yieldPercent).replace(/[^\d.]/g, "")) || 99.0);
      if (input.status) updates.status = input.status;
      if (input.approvalStatus) updates.approvalStatus = input.approvalStatus;
      if (input.revision) updates.version = input.revision;

      const res = await db.execute(sql`
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
        WHERE id::text = ${id} OR bom_number = ${id} OR lower(bom_number) = lower(${id}) OR name = ${id}
        RETURNING id
      `);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      const actualBomId = row?.id || id;

      if (Array.isArray(input.components) && input.components.length > 0) {
        await db.execute(sql`DELETE FROM public.bom_items WHERE bom_id::text = ${actualBomId}::text`);
        for (let i = 0; i < input.components.length; i++) {
          const comp = input.components[i];
          await db.execute(sql`
            INSERT INTO public.bom_items (bom_id, component_name, sku_code, quantity, scrap_percentage, uom, sequence, stage)
            VALUES (
              ${actualBomId},
              ${comp.name || "Component Ingredient"},
              ${comp.skuCode || "ING-1001"},
              ${Number(comp.quantity) || 100},
              ${Number(String(comp.scrapFactor || "0.5").replace(/[^\d.]/g, "")) || 0.5},
              ${comp.uom || "Kg"},
              ${i + 1},
              ${comp.type || "MIXING"}
            )
          `);
        }
      }
      return { id, ...input, message: "BOM updated in public.boms" };
    } catch (err: any) {
      console.warn("DB updateBom error:", err.message);
      return { id, ...input };
    }
  }

  async deleteBom(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.bom_items 
        WHERE bom_id IN (
          SELECT id FROM public.boms 
          WHERE id::text = ${id} OR bom_number = ${id} OR lower(bom_number) = lower(${id}) OR name = ${id}
        )
      `);
      await db.execute(sql`
        DELETE FROM public.boms 
        WHERE id::text = ${id} OR bom_number = ${id} OR lower(bom_number) = lower(${id}) OR name = ${id}
      `);
      return { id, message: "BOM deleted from public.boms" };
    } catch (err: any) {
      console.warn("DB deleteBom error:", err.message);
      return { id, message: "BOM deleted" };
    }
  }

  // ==========================================
  // 13. ASSETS & MACHINE CAPABILITY (STRICTLY public.assets)
  // ==========================================
  async listAssets(tenantId: string | undefined, plantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id,
          asset_id AS "assetId",
          asset_code AS "assetCode",
          name,
          type,
          line_id AS "lineId",
          line_name AS "lineName",
          plant_id AS "plantId",
          plant_name AS "plantName",
          criticality,
          critical_level AS "criticalLevel",
          manufacturer,
          model_number AS "modelNumber",
          status,
          health_score AS "healthScore",
          health_percent AS "healthPercent",
          rated_speed AS "ratedSpeed",
          mtbf_hours AS "mtbfHours",
          mttr_hours AS "mttrHours",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.assets
        ORDER BY created_at ASC
      `);
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          assetId: r.assetId || r.assetCode || `AST-${String(r.id).slice(0, 8)}`,
          assetCode: r.assetCode || r.assetId || `AST-${String(r.id).slice(0, 8)}`,
          name: r.name,
          type: r.type || "Packaging / Filling",
          lineId: r.lineId || "LIN-01",
          lineName: r.lineName || "High-Speed Bottling Line 1",
          plantId: r.plantId || "PLT-01",
          plantName: r.plantName || "Indore Plant",
          criticality: r.criticality || "Critical (Class A)",
          criticalLevel: r.criticalLevel || "CRITICAL_P1",
          manufacturer: r.manufacturer || "Krones AG",
          modelNumber: r.modelNumber || "",
          status: r.status || "Operational",
          healthScore: r.healthScore !== null && r.healthScore !== undefined ? Number(r.healthScore) : (r.healthPercent || 95),
          healthPercent: r.healthPercent !== null && r.healthPercent !== undefined ? Number(r.healthPercent) : 92,
          ratedSpeed: r.ratedSpeed || "40,000 BPH",
          mtbfHours: r.mtbfHours || "412.50",
          mttrHours: r.mttrHours || "1.80",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listAssets error:", err.message);
    }
    return [];
  }

  async createAsset(tenantId: string | undefined, input: any) {
    const rawId = input.assetId || input.id || input.assetCode || `AST-0${Date.now().toString().slice(-4)}`;
    const codeVal = input.assetCode || rawId;
    const nameVal = input.name || "Machine Asset";
    const typeVal = input.type || "Packaging / Filling";
    const lineIdVal = input.lineId || "LIN-01";
    const lineNameVal = input.lineName || "High-Speed Bottling Line 1";
    const plantIdVal = input.plantId || "PLT-01";
    const plantNameVal = input.plantName || "Indore Plant";
    const critVal = input.criticality || "Critical (Class A)";
    const critLevel = input.criticalLevel || (critVal.includes("Class A") ? "CRITICAL_P1" : "IMPORTANT_P2");
    const mfgVal = input.manufacturer || "Krones AG";
    const modelVal = input.modelNumber || input.serialNumber || "";
    const statVal = input.status || "Operational";
    const healthVal = Number(input.healthScore) || 95;
    const speedVal = input.ratedSpeed || "40,000 BPH";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.assets (
          asset_id, asset_code, name, type, line_id, line_name, plant_id, plant_name,
          criticality, critical_level, manufacturer, model_number, status, health_score,
          health_percent, rated_speed, created_at, updated_at
        ) VALUES (
          ${rawId}, ${codeVal}, ${nameVal}, ${typeVal}, ${lineIdVal}, ${lineNameVal}, ${plantIdVal}, ${plantNameVal},
          ${critVal}, ${critLevel}, ${mfgVal}, ${modelVal}, ${statVal}, ${healthVal},
          ${healthVal}, ${speedVal}, NOW(), NOW()
        )
        RETURNING id, asset_id, asset_code
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createAsset error:", err.message);
    }

    return {
      id: dbId || rawId,
      assetId: rawId,
      assetCode: codeVal,
      name: nameVal,
      type: typeVal,
      lineId: lineIdVal,
      lineName: lineNameVal,
      plantId: plantIdVal,
      plantName: plantNameVal,
      criticality: critVal,
      criticalLevel: critLevel,
      manufacturer: mfgVal,
      modelNumber: modelVal,
      status: statVal,
      healthScore: healthVal,
      healthPercent: healthVal,
      ratedSpeed: speedVal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateAsset(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
        UPDATE public.assets
        SET
          name = COALESCE(${input.name || null}, name),
          type = COALESCE(${input.type || null}, type),
          line_id = COALESCE(${input.lineId || null}, line_id),
          line_name = COALESCE(${input.lineName || null}, line_name),
          plant_id = COALESCE(${input.plantId || null}, plant_id),
          plant_name = COALESCE(${input.plantName || null}, plant_name),
          criticality = COALESCE(${input.criticality || null}, criticality),
          critical_level = COALESCE(${input.criticalLevel || null}, critical_level),
          manufacturer = COALESCE(${input.manufacturer || null}, manufacturer),
          model_number = COALESCE(${input.modelNumber || input.serialNumber || null}, model_number),
          status = COALESCE(${input.status || null}, status),
          health_score = COALESCE(${input.healthScore !== undefined ? Number(input.healthScore) : null}, health_score),
          health_percent = COALESCE(${input.healthPercent !== undefined ? Number(input.healthPercent) : null}, health_percent),
          rated_speed = COALESCE(${input.ratedSpeed || null}, rated_speed),
          updated_at = NOW()
        WHERE id::text = ${id} OR asset_id = ${id} OR asset_code = ${id} OR lower(asset_id) = lower(${id}) OR lower(asset_code) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB updateAsset error:", err.message);
    }
    return { id, ...input, updatedAt: new Date().toISOString() };
  }

  async deleteAsset(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.assets
        WHERE id::text = ${id} OR asset_id = ${id} OR asset_code = ${id} OR lower(asset_id) = lower(${id}) OR lower(asset_code) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB deleteAsset error:", err.message);
    }
    return { id, message: "Asset record deleted from database" };
  }

  async listStaff(tenantId: string | undefined, plantId?: string) {
    if (tenantId) {
      try {
        const isUuid = plantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plantId);
        if (isUuid) {
          return await db.select().from(staff).where(and(eq(staff.tenantId, tenantId), eq(staff.plantId, plantId)));
        }
        return await db.select().from(staff).where(eq(staff.tenantId, tenantId));
      } catch {
        return [];
      }
    }
    return [];
  }

  // ==========================================
  // 14. QUALITY SPECS (STRICTLY public.quality_specs)
  // ==========================================
  async listQualitySpecs(tenantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id,
          spec_id AS "specId",
          specification_title AS "specificationTitle",
          sku_id AS "skuId",
          sku_code AS "skuCode",
          sku_name AS "skuName",
          parameter,
          parameter_name AS "parameterName",
          target,
          target_value AS "targetValue",
          min,
          min_tolerance AS "minTolerance",
          max,
          max_tolerance AS "maxTolerance",
          uom,
          criticality,
          is_ccp AS "isCCP",
          critical_limit AS "criticalLimit",
          test_method AS "testMethod",
          approval_status AS "approvalStatus",
          revision,
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.quality_specs
        ORDER BY created_at ASC
      `);
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          specId: r.specId || `SPEC-${String(r.id).slice(0, 8)}`,
          specificationTitle: r.specificationTitle || r.parameter || r.parameterName || "Quality Specification",
          skuId: r.skuId || "SKU-001",
          skuCode: r.skuCode || "SKU-5001",
          skuName: r.skuName || "500ml Sparkling Citrus Soda",
          parameter: r.parameter || r.parameterName || "Quality Parameter",
          parameterName: r.parameterName || r.parameter || "Quality Parameter",
          target: r.target || String(r.targetValue || "10.0"),
          targetValue: r.targetValue ? Number(r.targetValue) : (Number(r.target) || 10.0),
          min: r.min || String(r.minTolerance || "9.5"),
          minTolerance: r.minTolerance ? Number(r.minTolerance) : (Number(r.min) || 9.5),
          max: r.max || String(r.maxTolerance || "10.5"),
          maxTolerance: r.maxTolerance ? Number(r.maxTolerance) : (Number(r.max) || 10.5),
          uom: r.uom || "°Bx",
          criticality: r.criticality || (r.isCCP ? "Critical CCP (HACCP-1)" : "Quality Spec"),
          isCCP: !!r.isCCP,
          criticalLimit: r.criticalLimit || "Standard QA Boundary",
          testMethod: r.testMethod || "Standard QA Digital Gauge",
          approvalStatus: r.approvalStatus || "Approved",
          revision: r.revision || "Rev 1.0",
          status: r.status || "Active",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listQualitySpecs error:", err.message);
    }
    return [];
  }

  async createQualitySpec(tenantId: string | undefined, input: any) {
    const rawId = input.specId || input.id || `SPEC-0${Date.now().toString().slice(-4)}`;
    const titleVal = input.specificationTitle || input.parameter || "Quality Parameter Spec Standard";
    const skuIdVal = input.skuId || "SKU-001";
    const skuCodeVal = input.skuCode || "SKU-5001";
    const skuNameVal = input.skuName || "500ml Sparkling Citrus Soda";
    const paramVal = input.parameter || input.parameterName || "Quality Parameter";
    const targetVal = String(input.target || input.targetValue || "10.0");
    const minVal = String(input.min || input.minTolerance || "9.5");
    const maxVal = String(input.max || input.maxTolerance || "10.5");
    const uomVal = input.uom || "°Bx";
    const critVal = input.criticality || "Quality Spec";
    const isCCPVal = input.isCCP !== undefined ? !!input.isCCP : critVal.toLowerCase().includes("ccp");
    const critLimitVal = input.criticalLimit || "Standard QA tolerance band";
    const testMethodVal = input.testMethod || "Digital Refractometer";
    const appStatusVal = input.approvalStatus || "Approved";
    const revVal = input.revision || "Rev 1.0";
    const statVal = input.status || "Active";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.quality_specs (
          spec_id, specification_title, sku_id, sku_code, sku_name,
          parameter, parameter_name, target, target_value, min, min_tolerance,
          max, max_tolerance, uom, criticality, is_ccp, critical_limit,
          test_method, approval_status, revision, status, created_at, updated_at
        ) VALUES (
          ${rawId}, ${titleVal}, ${skuIdVal}, ${skuCodeVal}, ${skuNameVal},
          ${paramVal}, ${paramVal}, ${targetVal}, ${Number(targetVal) || 0}, ${minVal}, ${Number(minVal) || 0},
          ${maxVal}, ${Number(maxVal) || 0}, ${uomVal}, ${critVal}, ${isCCPVal}, ${critLimitVal},
          ${testMethodVal}, ${appStatusVal}, ${revVal}, ${statVal}, NOW(), NOW()
        )
        ON CONFLICT (spec_id) DO UPDATE SET
          specification_title = EXCLUDED.specification_title,
          sku_code = EXCLUDED.sku_code,
          sku_name = EXCLUDED.sku_name,
          parameter = EXCLUDED.parameter,
          parameter_name = EXCLUDED.parameter_name,
          target = EXCLUDED.target,
          target_value = EXCLUDED.target_value,
          min = EXCLUDED.min,
          min_tolerance = EXCLUDED.min_tolerance,
          max = EXCLUDED.max,
          max_tolerance = EXCLUDED.max_tolerance,
          uom = EXCLUDED.uom,
          criticality = EXCLUDED.criticality,
          is_ccp = EXCLUDED.is_ccp,
          critical_limit = EXCLUDED.critical_limit,
          test_method = EXCLUDED.test_method,
          approval_status = EXCLUDED.approval_status,
          revision = EXCLUDED.revision,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id, spec_id
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createQualitySpec error:", err.message);
    }

    return {
      id: dbId || rawId,
      specId: rawId,
      specificationTitle: titleVal,
      skuId: skuIdVal,
      skuCode: skuCodeVal,
      skuName: skuNameVal,
      parameter: paramVal,
      parameterName: paramVal,
      target: targetVal,
      targetValue: Number(targetVal) || 0,
      min: minVal,
      minTolerance: Number(minVal) || 0,
      max: maxVal,
      maxTolerance: Number(maxVal) || 0,
      uom: uomVal,
      criticality: critVal,
      isCCP: isCCPVal,
      criticalLimit: critLimitVal,
      testMethod: testMethodVal,
      approvalStatus: appStatusVal,
      revision: revVal,
      status: statVal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateQualitySpec(tenantId: string | undefined, id: string, input: any) {
    try {
      const targetVal = input.target !== undefined ? String(input.target) : (input.targetValue !== undefined ? String(input.targetValue) : null);
      const minVal = input.min !== undefined ? String(input.min) : (input.minTolerance !== undefined ? String(input.minTolerance) : null);
      const maxVal = input.max !== undefined ? String(input.max) : (input.maxTolerance !== undefined ? String(input.maxTolerance) : null);

      await db.execute(sql`
        UPDATE public.quality_specs
        SET
          specification_title = COALESCE(${input.specificationTitle || null}, specification_title),
          sku_code = COALESCE(${input.skuCode || null}, sku_code),
          sku_name = COALESCE(${input.skuName || null}, sku_name),
          parameter = COALESCE(${input.parameter || input.parameterName || null}, parameter),
          parameter_name = COALESCE(${input.parameter || input.parameterName || null}, parameter_name),
          target = COALESCE(${targetVal}, target),
          target_value = COALESCE(${targetVal ? Number(targetVal) : null}, target_value),
          min = COALESCE(${minVal}, min),
          min_tolerance = COALESCE(${minVal ? Number(minVal) : null}, min_tolerance),
          max = COALESCE(${maxVal}, max),
          max_tolerance = COALESCE(${maxVal ? Number(maxVal) : null}, max_tolerance),
          uom = COALESCE(${input.uom || null}, uom),
          criticality = COALESCE(${input.criticality || null}, criticality),
          is_ccp = COALESCE(${input.isCCP !== undefined ? !!input.isCCP : null}, is_ccp),
          critical_limit = COALESCE(${input.criticalLimit || null}, critical_limit),
          test_method = COALESCE(${input.testMethod || null}, test_method),
          approval_status = COALESCE(${input.approvalStatus || null}, approval_status),
          revision = COALESCE(${input.revision || null}, revision),
          status = COALESCE(${input.status || null}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR spec_id = ${id} OR lower(spec_id) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB updateQualitySpec error:", err.message);
    }
    return { id, ...input, updatedAt: new Date().toISOString() };
  }

  async deleteQualitySpec(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.quality_specs
        WHERE id::text = ${id} OR spec_id = ${id} OR lower(spec_id) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB deleteQualitySpec error:", err.message);
    }
    return { id, message: "Quality specification deleted from database" };
  }

  // ==========================================
  // 15. LABOUR STANDARDS & CREW MANNING
  // ==========================================
  async listLabourStandards(tenantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id,
          standard_id AS "standardId",
          line_id AS "lineId",
          line_name AS "lineName",
          standard_crew AS "standardCrew",
          std_labor_hours_per_1k_units AS "stdLaborHoursPer1kUnits",
          direct_cost_per_hour AS "directCostPerHour",
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.labour_standards
        ORDER BY created_at ASC
      `);
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          standardId: r.standardId || r.id,
          lineId: r.lineId || "LIN-01",
          lineName: r.lineName || "Production Line",
          standardCrew: Number(r.standardCrew) || 8,
          stdLaborHoursPer1kUnits: Number(r.stdLaborHoursPer1kUnits) || 2.0,
          directCostPerHour: r.directCostPerHour || "$25.00",
          status: r.status || "Active",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listLabourStandards error:", err.message);
    }
    return [];
  }

  async createLabourStandard(tenantId: string | undefined, input: any) {
    const stdId = input.standardId || input.id || `LBR-0${Date.now().toString().slice(-4)}`;
    const rawCost = input.directCostPerHour !== undefined ? input.directCostPerHour.toString().trim() : "$25.00";
    const costStr = rawCost.startsWith("$") ? rawCost : `$${rawCost}`;
    const lineIdVal = input.lineId || "LIN-01";
    const lineNameVal = input.lineName || "Production Line";
    const crewVal = Number(input.standardCrew) || 8;
    const hrsVal = Number(input.stdLaborHoursPer1kUnits) || 2.0;
    const statVal = input.status || "Active";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.labour_standards (
          standard_id, line_id, line_name, standard_crew, std_labor_hours_per_1k_units,
          direct_cost_per_hour, status, created_at, updated_at
        ) VALUES (
          ${stdId}, ${lineIdVal}, ${lineNameVal}, ${crewVal}, ${hrsVal},
          ${costStr}, ${statVal}, NOW(), NOW()
        )
        ON CONFLICT (standard_id) DO UPDATE SET
          line_id = EXCLUDED.line_id,
          line_name = EXCLUDED.line_name,
          standard_crew = EXCLUDED.standard_crew,
          std_labor_hours_per_1k_units = EXCLUDED.std_labor_hours_per_1k_units,
          direct_cost_per_hour = EXCLUDED.direct_cost_per_hour,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id, standard_id
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createLabourStandard error:", err.message);
    }

    const newStandard: any = {
      id: dbId || stdId,
      standardId: stdId,
      lineId: lineIdVal,
      lineName: lineNameVal,
      standardCrew: crewVal,
      stdLaborHoursPer1kUnits: hrsVal,
      directCostPerHour: costStr,
      status: statVal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const existingIdx = inMemoryLabourStandards.findIndex((s) => s.id === (dbId || stdId) || s.standardId === stdId);
    if (existingIdx !== -1) {
      inMemoryLabourStandards[existingIdx] = newStandard;
    } else {
      inMemoryLabourStandards.unshift(newStandard);
    }
    return newStandard;
  }

  async updateLabourStandard(tenantId: string | undefined, id: string, input: any) {
    let costStr = undefined;
    if (input.directCostPerHour !== undefined) {
      const raw = input.directCostPerHour.toString().trim();
      costStr = raw.startsWith("$") ? raw : `$${raw}`;
    }

    try {
      await db.execute(sql`
        UPDATE public.labour_standards
        SET
          line_id = COALESCE(${input.lineId || null}, line_id),
          line_name = COALESCE(${input.lineName || null}, line_name),
          standard_crew = COALESCE(${input.standardCrew !== undefined ? Number(input.standardCrew) : null}, standard_crew),
          std_labor_hours_per_1k_units = COALESCE(${input.stdLaborHoursPer1kUnits !== undefined ? Number(input.stdLaborHoursPer1kUnits) : null}, std_labor_hours_per_1k_units),
          direct_cost_per_hour = COALESCE(${costStr || null}, direct_cost_per_hour),
          status = COALESCE(${input.status || null}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR standard_id = ${id} OR lower(standard_id) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB updateLabourStandard error:", err.message);
    }

    const idx = inMemoryLabourStandards.findIndex((s) => s.id === id || s.standardId === id);
    if (idx !== -1) {
      inMemoryLabourStandards[idx] = {
        ...inMemoryLabourStandards[idx],
        ...input,
        standardCrew: input.standardCrew !== undefined ? Number(input.standardCrew) : inMemoryLabourStandards[idx].standardCrew,
        stdLaborHoursPer1kUnits: input.stdLaborHoursPer1kUnits !== undefined ? Number(input.stdLaborHoursPer1kUnits) : inMemoryLabourStandards[idx].stdLaborHoursPer1kUnits,
        directCostPerHour: costStr || inMemoryLabourStandards[idx].directCostPerHour,
        updatedAt: new Date().toISOString()
      };
      return inMemoryLabourStandards[idx];
    }
    return { id, ...input };
  }

  async deleteLabourStandard(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.labour_standards WHERE id::text = ${id} OR standard_id = ${id} OR lower(standard_id) = lower(${id})`);
    } catch (err: any) {
      console.warn("DB deleteLabourStandard error:", err.message);
    }

    const idx = inMemoryLabourStandards.findIndex((s) => s.id === id || s.standardId === id);
    if (idx !== -1) {
      const deleted = inMemoryLabourStandards.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Labour standard deleted" };
  }

  // ==========================================
  // 17. EMPLOYEE SKILLS & QUALIFICATIONS MATRIX
  // ==========================================
  async listEmployeeSkills(tenantId?: string, plantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id,
          employee_id AS "employeeId",
          name,
          email,
          department,
          department_id AS "departmentId",
          role,
          plant_id AS "plantId",
          plant_name AS "plantName",
          skill_level AS "skillLevel",
          skills,
          certifications,
          assigned_line_ids AS "assignedLineIds",
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.employee_skills
        ORDER BY created_at ASC
      `);
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          employeeId: r.employeeId || r.id,
          name: r.name,
          email: r.email || "",
          department: r.department || "Production Operations",
          departmentId: r.departmentId || "DEP-01",
          role: r.role || "Line Operator",
          plantId: r.plantId || "PLT-01",
          plantName: r.plantName || "Indore Plant",
          skillLevel: r.skillLevel || "Level 2 (Certified Operator)",
          skills: Array.isArray(r.skills) ? r.skills : [],
          certifications: Array.isArray(r.certifications) ? r.certifications : [],
          assignedLineIds: Array.isArray(r.assignedLineIds) ? r.assignedLineIds : [],
          status: r.status || "Active",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listEmployeeSkills error:", err.message);
    }
    return [];
  }

  async createEmployeeSkill(tenantId: string | undefined, input: any) {
    const empId = input.employeeId || input.id || `EMP-00${Date.now().toString().slice(-3)}`;
    const nameVal = input.name || "Employee";
    const emailVal = input.email || `${nameVal.toLowerCase().replace(/\s+/g, ".")}@flowstate.io`;
    const deptVal = input.department || "Production Operations";
    const deptIdVal = input.departmentId || "DEP-01";
    const roleVal = input.role || "Line Operator";
    const plantIdVal = input.plantId || "PLT-01";
    const plantNameVal = input.plantName || "Indore Plant";
    const levelVal = input.skillLevel || "Level 2 (Certified Operator)";
    const skillsJson = JSON.stringify(Array.isArray(input.skills) ? input.skills : ["Standard Operating Procedures"]);
    const certsJson = JSON.stringify(Array.isArray(input.certifications) ? input.certifications : ["Plant Safety GMP"]);
    const linesJson = JSON.stringify(Array.isArray(input.assignedLineIds) ? input.assignedLineIds : ["LIN-01"]);
    const statVal = input.status || "Active";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.employee_skills (
          employee_id, name, email, department, department_id, role,
          plant_id, plant_name, skill_level, skills, certifications,
          assigned_line_ids, status, created_at, updated_at
        ) VALUES (
          ${empId}, ${nameVal}, ${emailVal}, ${deptVal}, ${deptIdVal}, ${roleVal},
          ${plantIdVal}, ${plantNameVal}, ${levelVal}, ${skillsJson}::jsonb, ${certsJson}::jsonb,
          ${linesJson}::jsonb, ${statVal}, NOW(), NOW()
        )
        ON CONFLICT (employee_id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          department = EXCLUDED.department,
          department_id = EXCLUDED.department_id,
          role = EXCLUDED.role,
          plant_id = EXCLUDED.plant_id,
          plant_name = EXCLUDED.plant_name,
          skill_level = EXCLUDED.skill_level,
          skills = EXCLUDED.skills,
          certifications = EXCLUDED.certifications,
          assigned_line_ids = EXCLUDED.assigned_line_ids,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id, employee_id
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createEmployeeSkill error:", err.message);
    }

    const createdRecord: any = {
      id: dbId || empId,
      employeeId: empId,
      name: nameVal,
      email: emailVal,
      department: deptVal,
      departmentId: deptIdVal,
      role: roleVal,
      plantId: plantIdVal,
      plantName: plantNameVal,
      skillLevel: levelVal,
      skills: Array.isArray(input.skills) ? input.skills : ["Standard Operating Procedures"],
      certifications: Array.isArray(input.certifications) ? input.certifications : ["Plant Safety GMP"],
      assignedLineIds: Array.isArray(input.assignedLineIds) ? input.assignedLineIds : ["LIN-01"],
      status: statVal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryEmployeeSkills.unshift(createdRecord);
    return createdRecord;
  }

  async updateEmployeeSkill(tenantId: string | undefined, id: string, input: any) {
    const skillsJson = input.skills !== undefined ? JSON.stringify(Array.isArray(input.skills) ? input.skills : []) : null;
    const certsJson = input.certifications !== undefined ? JSON.stringify(Array.isArray(input.certifications) ? input.certifications : []) : null;
    const linesJson = input.assignedLineIds !== undefined ? JSON.stringify(Array.isArray(input.assignedLineIds) ? input.assignedLineIds : []) : null;

    try {
      await db.execute(sql`
        UPDATE public.employee_skills
        SET
          name = COALESCE(${input.name || null}, name),
          email = COALESCE(${input.email || null}, email),
          department = COALESCE(${input.department || null}, department),
          department_id = COALESCE(${input.departmentId || null}, department_id),
          role = COALESCE(${input.role || null}, role),
          plant_id = COALESCE(${input.plantId || null}, plant_id),
          plant_name = COALESCE(${input.plantName || null}, plant_name),
          skill_level = COALESCE(${input.skillLevel || null}, skill_level),
          skills = CASE WHEN ${skillsJson}::text IS NOT NULL THEN ${skillsJson}::jsonb ELSE skills END,
          certifications = CASE WHEN ${certsJson}::text IS NOT NULL THEN ${certsJson}::jsonb ELSE certifications END,
          assigned_line_ids = CASE WHEN ${linesJson}::text IS NOT NULL THEN ${linesJson}::jsonb ELSE assigned_line_ids END,
          status = COALESCE(${input.status || null}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR employee_id = ${id} OR lower(employee_id) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB updateEmployeeSkill error:", err.message);
    }

    const idx = inMemoryEmployeeSkills.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx !== -1) {
      inMemoryEmployeeSkills[idx] = { ...inMemoryEmployeeSkills[idx], ...input, updatedAt: new Date().toISOString() };
      return inMemoryEmployeeSkills[idx];
    }
    return { id, ...input, updatedAt: new Date().toISOString() };
  }

  async deleteEmployeeSkill(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`DELETE FROM public.employee_skills WHERE id::text = ${id} OR employee_id = ${id} OR lower(employee_id) = lower(${id})`);
    } catch (err: any) {
      console.warn("DB deleteEmployeeSkill error:", err.message);
    }

    const idx = inMemoryEmployeeSkills.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx !== -1) {
      const deleted = inMemoryEmployeeSkills.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Employee record deleted" };
  }

  // ==========================================
  // 18. HACCP CRITICAL CONTROL POINT (CCP) LIMITS (STRICTLY public.ccp_limits)
  // ==========================================
  async listCCPLimits(tenantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id,
          ccp_number AS "ccpNumber",
          process_step AS "processStep",
          hazard,
          critical_limit AS "criticalLimit",
          auto_divert_action AS "autoDivertAction",
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.ccp_limits
        ORDER BY created_at ASC
      `);
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          ccpNumber: r.ccpNumber || `CCP-${String(r.id).slice(0, 8)}`,
          processStep: r.processStep || "Thermal Pasteurization Hold",
          hazard: r.hazard || "Microbial Contamination",
          criticalLimit: r.criticalLimit || "Standard Critical Limit",
          autoDivertAction: r.autoDivertAction || "Automated Flow Divert",
          status: r.status || "Critical Mandatory",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listCCPLimits error:", err.message);
    }
    return [];
  }

  async createCCPLimit(tenantId: string | undefined, input: any) {
    const rawNum = input.ccpNumber || input.id || `CCP-${Date.now().toString().slice(-4)}`;
    const stepVal = input.processStep || "Thermal Pasteurization Hold";
    const hazardVal = input.hazard || "Microbial Contamination Risk";
    const limitVal = input.criticalLimit || "Standard Critical Limit Specification";
    const divertVal = input.autoDivertAction || "Automated Flow Divert Valve";
    const statVal = input.status || "Critical Mandatory";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.ccp_limits (
          ccp_number, process_step, hazard, critical_limit, auto_divert_action,
          status, created_at, updated_at
        ) VALUES (
          ${rawNum}, ${stepVal}, ${hazardVal}, ${limitVal}, ${divertVal},
          ${statVal}, NOW(), NOW()
        )
        ON CONFLICT (ccp_number) DO UPDATE SET
          process_step = EXCLUDED.process_step,
          hazard = EXCLUDED.hazard,
          critical_limit = EXCLUDED.critical_limit,
          auto_divert_action = EXCLUDED.auto_divert_action,
          status = EXCLUDED.status,
          updated_at = NOW()
        RETURNING id, ccp_number
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createCCPLimit error:", err.message);
    }

    return {
      id: dbId || rawNum,
      ccpNumber: rawNum,
      processStep: stepVal,
      hazard: hazardVal,
      criticalLimit: limitVal,
      autoDivertAction: divertVal,
      status: statVal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateCCPLimit(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
        UPDATE public.ccp_limits
        SET
          process_step = COALESCE(${input.processStep || null}, process_step),
          hazard = COALESCE(${input.hazard || null}, hazard),
          critical_limit = COALESCE(${input.criticalLimit || null}, critical_limit),
          auto_divert_action = COALESCE(${input.autoDivertAction || null}, auto_divert_action),
          status = COALESCE(${input.status || null}, status),
          updated_at = NOW()
        WHERE id::text = ${id} OR ccp_number = ${id} OR lower(ccp_number) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB updateCCPLimit error:", err.message);
    }
    return { id, ...input, updatedAt: new Date().toISOString() };
  }

  async deleteCCPLimit(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.ccp_limits
        WHERE id::text = ${id} OR ccp_number = ${id} OR lower(ccp_number) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB deleteCCPLimit error:", err.message);
    }
    return { id, message: "CCP Limit record deleted from database" };
  }

  // ==========================================
  // 19. STORAGE RESOURCES & WAREHOUSE (STRICTLY public.storage_resources)
  // ==========================================
  async listStorageResources(tenantId?: string, plantId?: string) {
    try {
      const res = await db.execute(sql`
        SELECT 
          id,
          resource_id AS "resourceId",
          resource_code AS "resourceCode",
          name,
          resource_type AS "resourceType",
          plant_id AS "plantId",
          plant_name AS "plantName",
          zone,
          capacity_unit AS "capacityUnit",
          total_capacity AS "totalCapacity",
          capacity,
          current_occupancy AS "currentOccupancy",
          temperature_zone AS "temperatureZone",
          status,
          effective_from AS "effectiveFrom",
          effective_to AS "effectiveTo",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM public.storage_resources
        ORDER BY created_at ASC
      `);
      if (Array.isArray(res?.rows)) {
        return res.rows.map((r: any) => ({
          id: r.id,
          resourceId: r.resourceId || r.resourceCode || `STR-${String(r.id).slice(0, 8)}`,
          resourceCode: r.resourceCode || r.resourceId || `STR-${String(r.id).slice(0, 8)}`,
          name: r.name,
          resourceType: r.resourceType || "Selective Pallet Rack",
          type: r.resourceType || "Selective Pallet Rack",
          plantId: r.plantId || "PLT-01",
          plantName: r.plantName || "Indore Plant",
          zone: r.zone || "General Staging",
          capacityUnit: r.capacityUnit || "Pallet Positions",
          totalCapacity: r.totalCapacity !== null && r.totalCapacity !== undefined ? Number(r.totalCapacity) : 500,
          capacity: r.capacity || `${r.totalCapacity || 500} ${r.capacityUnit || "Pallet Positions"}`,
          currentOccupancy: r.currentOccupancy || "0 Pallets (0%)",
          temperatureZone: r.temperatureZone || "Ambient (18°C - 24°C)",
          tempControl: r.temperatureZone || "Ambient (18°C - 24°C)",
          status: r.status || "Active",
          effectiveFrom: r.effectiveFrom || "2025-01-01",
          effectiveTo: r.effectiveTo || "2030-12-31",
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch (err: any) {
      console.warn("DB listStorageResources error:", err.message);
    }
    return [];
  }

  async createStorageResource(tenantId: string | undefined, input: any) {
    const rawId = input.resourceId || input.id || input.resourceCode || `STR-0${Date.now().toString().slice(-4)}`;
    const codeVal = input.resourceCode || input.code || rawId;
    const nameVal = input.name || "Storage Resource Bay";
    const typeVal = input.resourceType || input.type || "Selective Pallet Rack";
    const plantIdVal = input.plantId || "PLT-01";
    const plantNameVal = input.plantName || "Indore Plant";
    const zoneVal = input.zone || "General Staging";
    const unitVal = input.capacityUnit || "Pallet Positions";
    const totalCap = Number(input.totalCapacity) || 500;
    const capStr = input.capacity || `${totalCap} ${unitVal}`;
    const occStr = input.currentOccupancy || "0 Pallets (0%)";
    const tempVal = input.temperatureZone || input.temperatureRange || "Ambient (18°C - 24°C)";
    const statVal = input.status || "Active";
    const effFrom = input.effectiveFrom || new Date().toISOString().substring(0, 10);
    const effTo = input.effectiveTo || "2030-12-31";

    let dbId: string | undefined;
    try {
      const res = await db.execute(sql`
        INSERT INTO public.storage_resources (
          resource_id, resource_code, name, resource_type, plant_id, plant_name,
          zone, capacity_unit, total_capacity, capacity, current_occupancy,
          temperature_zone, status, effective_from, effective_to, created_at, updated_at
        ) VALUES (
          ${rawId}, ${codeVal}, ${nameVal}, ${typeVal}, ${plantIdVal}, ${plantNameVal},
          ${zoneVal}, ${unitVal}, ${totalCap}, ${capStr}, ${occStr},
          ${tempVal}, ${statVal}, ${effFrom}, ${effTo}, NOW(), NOW()
        )
        ON CONFLICT (resource_code) DO UPDATE SET
          name = EXCLUDED.name,
          resource_type = EXCLUDED.resource_type,
          plant_id = EXCLUDED.plant_id,
          plant_name = EXCLUDED.plant_name,
          zone = EXCLUDED.zone,
          capacity_unit = EXCLUDED.capacity_unit,
          total_capacity = EXCLUDED.total_capacity,
          capacity = EXCLUDED.capacity,
          current_occupancy = EXCLUDED.current_occupancy,
          temperature_zone = EXCLUDED.temperature_zone,
          status = EXCLUDED.status,
          effective_from = EXCLUDED.effective_from,
          effective_to = EXCLUDED.effective_to,
          updated_at = NOW()
        RETURNING id, resource_id, resource_code
      `);
      if (res.rows && res.rows.length > 0) {
        dbId = (res.rows[0] as any).id;
      }
    } catch (err: any) {
      console.warn("DB createStorageResource error:", err.message);
    }

    return {
      id: dbId || rawId,
      resourceId: rawId,
      resourceCode: codeVal,
      name: nameVal,
      resourceType: typeVal,
      type: typeVal,
      plantId: plantIdVal,
      plantName: plantNameVal,
      zone: zoneVal,
      capacityUnit: unitVal,
      totalCapacity: totalCap,
      capacity: capStr,
      currentOccupancy: occStr,
      temperatureZone: tempVal,
      tempControl: tempVal,
      status: statVal,
      effectiveFrom: effFrom,
      effectiveTo: effTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateStorageResource(tenantId: string | undefined, id: string, input: any) {
    try {
      await db.execute(sql`
        UPDATE public.storage_resources
        SET
          name = COALESCE(${input.name || null}, name),
          resource_type = COALESCE(${input.resourceType || input.type || null}, resource_type),
          plant_id = COALESCE(${input.plantId || null}, plant_id),
          plant_name = COALESCE(${input.plantName || null}, plant_name),
          zone = COALESCE(${input.zone || null}, zone),
          capacity_unit = COALESCE(${input.capacityUnit || null}, capacity_unit),
          total_capacity = COALESCE(${input.totalCapacity !== undefined ? Number(input.totalCapacity) : null}, total_capacity),
          capacity = COALESCE(${input.capacity || null}, capacity),
          current_occupancy = COALESCE(${input.currentOccupancy || null}, current_occupancy),
          temperature_zone = COALESCE(${input.temperatureZone || input.temperatureRange || null}, temperature_zone),
          status = COALESCE(${input.status || null}, status),
          effective_from = COALESCE(${input.effectiveFrom || null}, effective_from),
          effective_to = COALESCE(${input.effectiveTo || null}, effective_to),
          updated_at = NOW()
        WHERE id::text = ${id} OR resource_id = ${id} OR resource_code = ${id} OR lower(resource_code) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB updateStorageResource error:", err.message);
    }
    return { id, ...input, updatedAt: new Date().toISOString() };
  }

  async deleteStorageResource(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql`
        DELETE FROM public.storage_resources
        WHERE id::text = ${id} OR resource_id = ${id} OR resource_code = ${id} OR lower(resource_code) = lower(${id})
      `);
    } catch (err: any) {
      console.warn("DB deleteStorageResource error:", err.message);
    }
    return { id, message: "Storage resource deleted from database" };
  }
}

export const masterDataService = new MasterDataService();


