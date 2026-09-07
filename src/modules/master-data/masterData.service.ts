import { db } from "../../config/database.js";
import { skus, boms, bomItems, productionLines, workCenters, assets, staff, qualitySpecs } from "../../db/schema/masterData.js";
import { tenants, plants } from "../../db/schema/tenants.js";
import { eq, and, sql } from "drizzle-orm";
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

let inMemoryCompanies: CompanyEntity[] = [
  {
    id: "CMP-01",
    companyId: "CMP-01",
    code: "ABCMFG",
    name: "ABC Manufacturing Global",
    taxId: "US-9842109-K",
    currency: "USD",
    hqLocation: "Austin, Texas, USA",
    fiscalYearStart: "January",
    status: "Active",
  },
];

let inMemoryPlants: PlantEntity[] = [
  {
    id: "PLT-01",
    plantId: "PLT-01",
    companyId: "CMP-01",
    code: "PLT-IND",
    name: "Indore Plant - Processing & Bottling",
    location: "Sector 3 Industrial Corridor, Indore, MP",
    city: "Indore",
    state: "MP",
    country: "India",
    capacity: "350,000 Units/Day",
    dailyCapacity: "350,000 Units/Day",
    operatingShifts: 3,
    timezone: "Asia/Kolkata (IST)",
    linesCount: 3,
    status: "Active",
  },
  {
    id: "PLT-02",
    plantId: "PLT-02",
    companyId: "CMP-01",
    code: "PLT-AUST",
    name: "Austin Facility - Canning & Logistics",
    location: "7400 Metropolis Dr, Austin, TX",
    city: "Austin",
    state: "TX",
    country: "USA",
    capacity: "280,000 Units/Day",
    dailyCapacity: "280,000 Units/Day",
    operatingShifts: 2,
    timezone: "America/Chicago (CST)",
    linesCount: 2,
    status: "Active",
  },
];

let inMemoryDepartments: DepartmentEntity[] = [
  { id: "DEP-01", departmentId: "DEP-01", plantId: "PLT-01", code: "PROD", name: "Production & Bottling", deptHead: "Robert Thorne", managerName: "Robert Thorne", costCenter: "CC-101", operatingShifts: "3 Shifts (24/7 Continuous)", status: "Active" },
  { id: "DEP-02", departmentId: "DEP-02", plantId: "PLT-01", code: "MAINT", name: "Maintenance & Reliability", deptHead: "Marcus Vance", managerName: "Marcus Vance", costCenter: "CC-102", operatingShifts: "3 Shifts (24/7 Continuous)", status: "Active" },
  { id: "DEP-03", departmentId: "DEP-03", plantId: "PLT-01", code: "QAQC", name: "Quality Assurance & Lab", deptHead: "Sarah Jenkins", managerName: "Sarah Jenkins", costCenter: "CC-103", operatingShifts: "2 Shifts (Day & Night)", status: "Active" },
  { id: "DEP-04", departmentId: "DEP-04", plantId: "PLT-01", code: "WHSE", name: "Warehouse & Materials", deptHead: "David Kim", managerName: "David Kim", costCenter: "CC-104", operatingShifts: "3 Shifts (24/7 Continuous)", status: "Active" },
  { id: "DEP-05", departmentId: "DEP-05", plantId: "PLT-01", code: "CI-ENG", name: "Continuous Improvement & Engineering", deptHead: "Alexander Vance", managerName: "Alexander Vance", costCenter: "CC-105", operatingShifts: "1 Shift (General)", status: "Active" },
];

let inMemoryLines: LineEntity[] = [
  { lineId: "LIN-01", id: "LIN-01", lineCode: "LINE-1", code: "LINE-1", name: "High-Speed Bottling Line 1", plantId: "PLT-01", plantName: "Indore Plant", type: "Continuous Flow", lineType: "BOTTLING", ratedSpeed: "38,000 BPH", ratedSpeedBPH: 38000, status: "Active", healthScore: 96 },
  { lineId: "LIN-02", id: "LIN-02", lineCode: "LINE-2", code: "LINE-2", name: "Medium-Speed Glass Bottling Line 2", plantId: "PLT-01", plantName: "Indore Plant", type: "Continuous Flow", lineType: "BOTTLING", ratedSpeed: "38,000 BPH", ratedSpeedBPH: 38000, status: "Active", healthScore: 92 },
  { lineId: "LIN-03", id: "LIN-03", lineCode: "LINE-3", code: "LINE-3", name: "Automated Sleek Canning Line 3", plantId: "PLT-02", plantName: "Austin Facility", type: "Continuous Flow", lineType: "CANNING", ratedSpeed: "38,000 BPH", ratedSpeedBPH: 38000, status: "Active", healthScore: 94 },
];

let inMemoryWorkCenters: WorkCenterEntity[] = [
  { id: "WC-101", workCenterId: "WC-101", code: "FILL-01", name: "Rotary Isobaric Filler", lineId: "LIN-01", lineName: "Line 1 — Aseptic Bottling", plantId: "PLT-01", capacity: "38,000 BPH", category: "PACKAGING", status: "Active" },
  { id: "WC-102", workCenterId: "WC-102", code: "CAPP-01", name: "Induction Cap Sealer", lineId: "LIN-01", lineName: "Line 1 — Aseptic Bottling", plantId: "PLT-01", capacity: "38,000 BPH", category: "PACKAGING", status: "Active" },
  { id: "WC-103", workCenterId: "WC-103", code: "LABL-01", name: "Sleeve Rotary Labeler", lineId: "LIN-01", lineName: "Line 1 — Aseptic Bottling", plantId: "PLT-01", capacity: "40,000 BPH", category: "PACKAGING", status: "Active" },
  { id: "WC-201", workCenterId: "WC-201", code: "PAST-02", name: "HTST Flash Pasteurizer", lineId: "LIN-02", lineName: "Line 2 — Formulation & Pasteurizer", plantId: "PLT-01", capacity: "30,000 L/hr", category: "PROCESSING", status: "Active" },
  { id: "WC-301", workCenterId: "WC-301", code: "SEAM-03", name: "Can Seamer Station", lineId: "LIN-03", lineName: "Line 3 — Canning Line", plantId: "PLT-02", capacity: "45,000 CPH", category: "PACKAGING", status: "Active" },
];

export class MasterDataService {
  // ==========================================
  // 1. COMPANIES / LEGAL ENTITIES
  // ==========================================
  async listCompanies(tenantId?: string) {
    return inMemoryCompanies;
  }

  async createCompany(tenantId: string | undefined, input: any) {
    const newId = `CMP-0${inMemoryCompanies.length + 1}`;
    const newCompany: CompanyEntity = {
      id: newId,
      companyId: newId,
      code: input.code ? input.code.toUpperCase() : `CMP-0${inMemoryCompanies.length + 1}`,
      name: input.name,
      taxId: input.taxId || "US-EIN-94821039",
      currency: input.currency || "USD ($)",
      hqLocation: input.hqLocation || input.headquarters || "Austin, Texas, USA",
      fiscalYearStart: input.fiscalYearStart || "January",
      status: input.status || "Active",
    };
    inMemoryCompanies.push(newCompany);
    return newCompany;
  }

  async updateCompany(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryCompanies.findIndex((c) => c.id === id || c.companyId === id || c.code === id);
    if (idx === -1) {
      const fallback: CompanyEntity = {
        id,
        companyId: id,
        code: input.code || id,
        name: input.name || "Enterprise Entity",
        taxId: input.taxId || "US-EIN-94821039",
        currency: input.currency || "USD",
        hqLocation: input.hqLocation || "Austin, Texas, USA",
        status: input.status || "Active",
      };
      inMemoryCompanies.push(fallback);
      return fallback;
    }
    inMemoryCompanies[idx] = {
      ...inMemoryCompanies[idx],
      ...input,
      id: inMemoryCompanies[idx].id,
      companyId: inMemoryCompanies[idx].companyId || inMemoryCompanies[idx].id,
    };
    return inMemoryCompanies[idx];
  }

  async deleteCompany(tenantId: string | undefined, id: string) {
    const idx = inMemoryCompanies.findIndex((c) => c.id === id || c.companyId === id);
    if (idx !== -1) {
      const deleted = inMemoryCompanies.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Company removed" };
  }

  // ==========================================
  // 2. PLANTS / FACILITIES
  // ==========================================
  async listPlants(tenantId?: string) {
    try {
      const dbPlants = await db.select().from(plants);
      if (dbPlants && dbPlants.length > 0) {
        // Merge with memory
        const dbMapped: PlantEntity[] = dbPlants.map((p) => ({
          id: p.id,
          plantId: p.code || p.id,
          code: p.code,
          name: p.name,
          city: p.city,
          state: p.state || "",
          country: p.country || "India",
          timezone: p.timezone,
          location: `${p.city}, ${p.state || ""}, ${p.country || ""}`,
          status: p.isActive ? "Active" : "Inactive",
          capacity: "350,000 Units/Day",
          linesCount: 3,
        }));
        return dbMapped.length >= inMemoryPlants.length ? dbMapped : inMemoryPlants;
      }
    } catch (err) {
      // fallback to memory
    }
    return inMemoryPlants;
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
    inMemoryPlants.push(newPlant);
    return newPlant;
  }

  async updatePlant(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryPlants.findIndex((p) => p.id === id || p.plantId === id || p.code === id);
    if (idx === -1) {
      const fallback: PlantEntity = {
        id,
        plantId: id,
        code: input.code || id,
        name: input.name || "Plant Facility",
        status: input.status || "Active",
      };
      inMemoryPlants.push(fallback);
      return fallback;
    }
    inMemoryPlants[idx] = {
      ...inMemoryPlants[idx],
      ...input,
      id: inMemoryPlants[idx].id,
      plantId: inMemoryPlants[idx].plantId || inMemoryPlants[idx].id,
    };
    return inMemoryPlants[idx];
  }

  async deletePlant(tenantId: string | undefined, id: string) {
    const idx = inMemoryPlants.findIndex((p) => p.id === id || p.plantId === id);
    if (idx !== -1) {
      const deleted = inMemoryPlants.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Plant deleted" };
  }

  // ==========================================
  // 3. DEPARTMENTS
  // ==========================================
  async listDepartments(tenantId?: string, plantId?: string) {
    if (plantId && plantId !== "ALL") {
      return inMemoryDepartments.filter((d) => d.plantId === plantId);
    }
    return inMemoryDepartments;
  }

  async createDepartment(tenantId: string | undefined, input: any) {
    const newId = `DEP-0${inMemoryDepartments.length + 1}`;
    const newDept: DepartmentEntity = {
      id: newId,
      departmentId: newId,
      plantId: input.plantId || "PLT-01",
      code: input.code ? input.code.toUpperCase() : `DEP-0${inMemoryDepartments.length + 1}`,
      name: input.name,
      deptHead: input.deptHead || input.managerName || "Robert Thorne",
      managerName: input.deptHead || input.managerName || "Robert Thorne",
      costCenter: input.costCenter || "CC-101",
      operatingShifts: input.operatingShifts || "3 Shifts (24/7 Continuous)",
      status: input.status || "Active",
    };
    inMemoryDepartments.push(newDept);
    return newDept;
  }

  async updateDepartment(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryDepartments.findIndex((d) => d.id === id || d.departmentId === id || d.code === id);
    if (idx === -1) {
      const fallback: DepartmentEntity = {
        id,
        departmentId: id,
        plantId: input.plantId || "PLT-01",
        code: input.code || id,
        name: input.name || "Department",
        status: input.status || "Active",
      };
      inMemoryDepartments.push(fallback);
      return fallback;
    }
    inMemoryDepartments[idx] = {
      ...inMemoryDepartments[idx],
      ...input,
      id: inMemoryDepartments[idx].id,
      departmentId: inMemoryDepartments[idx].departmentId || inMemoryDepartments[idx].id,
    };
    return inMemoryDepartments[idx];
  }

  async deleteDepartment(tenantId: string | undefined, id: string) {
    const idx = inMemoryDepartments.findIndex((d) => d.id === id || d.departmentId === id);
    if (idx !== -1) {
      const deleted = inMemoryDepartments.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Department deleted" };
  }

  // ==========================================
  // 4. PRODUCTION LINES
  // ==========================================
  async listLines(tenantId: string | undefined, plantId?: string) {
    if (plantId && plantId !== "ALL") {
      return inMemoryLines.filter((l) => l.plantId === plantId);
    }
    return inMemoryLines;
  }

  async createLine(tenantId: string | undefined, input: any) {
    const newId = `LIN-0${inMemoryLines.length + 1}`;
    const newLine: LineEntity = {
      id: newId,
      lineId: newId,
      lineCode: input.lineCode ? input.lineCode.toUpperCase() : (input.code || `LINE-${inMemoryLines.length + 1}`).toUpperCase(),
      code: input.lineCode ? input.lineCode.toUpperCase() : (input.code || `LINE-${inMemoryLines.length + 1}`).toUpperCase(),
      name: input.name,
      plantId: input.plantId || "PLT-01",
      plantName: input.plantId === "PLT-02" ? "Austin Facility" : "Indore Plant",
      type: input.type || "Continuous Flow",
      lineType: input.lineType || "BOTTLING",
      ratedSpeed: input.ratedSpeed || "38,000 BPH",
      ratedSpeedBPH: Number(input.ratedSpeedBPH) || 38000,
      status: input.status || "Active",
      healthScore: 95,
    };
    inMemoryLines.push(newLine);
    return newLine;
  }

  async updateLine(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryLines.findIndex((l) => l.lineId === id || l.id === id || l.lineCode === id || l.code === id);
    if (idx === -1) {
      const fallback: LineEntity = {
        lineId: id,
        id,
        lineCode: input.lineCode || id,
        name: input.name || "Production Line",
        plantId: input.plantId || "PLT-01",
        status: input.status || "Active",
      };
      inMemoryLines.push(fallback);
      return fallback;
    }
    inMemoryLines[idx] = {
      ...inMemoryLines[idx],
      ...input,
      lineId: inMemoryLines[idx].lineId || inMemoryLines[idx].id || id,
      id: inMemoryLines[idx].id || inMemoryLines[idx].lineId || id,
    };
    return inMemoryLines[idx];
  }

  async deleteLine(tenantId: string | undefined, id: string) {
    const idx = inMemoryLines.findIndex((l) => l.lineId === id || l.id === id);
    if (idx !== -1) {
      const deleted = inMemoryLines.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Line deleted" };
  }

  // ==========================================
  // 5. WORK CENTERS
  // ==========================================
  async listWorkCenters(tenantId: string | undefined, plantId?: string) {
    if (plantId && plantId !== "ALL") {
      return inMemoryWorkCenters.filter((w) => w.plantId === plantId || !w.plantId);
    }
    return inMemoryWorkCenters;
  }

  async createWorkCenter(tenantId: string | undefined, input: any) {
    const newId = `WC-${Math.floor(400 + Math.random() * 99)}`;
    const lineObj = inMemoryLines.find((l) => l.lineId === input.lineId || l.id === input.lineId);
    const newWC: WorkCenterEntity = {
      id: newId,
      workCenterId: newId,
      code: input.code ? input.code.toUpperCase() : `WC-0${inMemoryWorkCenters.length + 1}`,
      name: input.name,
      lineId: input.lineId || "LIN-01",
      lineName: input.lineName || (lineObj ? lineObj.name : "Line 1 — Aseptic Bottling"),
      plantId: input.plantId || (lineObj ? lineObj.plantId : "PLT-01"),
      capacity: input.capacity || "38,000 BPH",
      category: input.category || "PACKAGING",
      status: input.status || "Active",
    };
    inMemoryWorkCenters.push(newWC);
    return newWC;
  }

  async updateWorkCenter(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryWorkCenters.findIndex((w) => w.id === id || w.workCenterId === id || w.code === id);
    const lineObj = input.lineId ? inMemoryLines.find((l) => l.lineId === input.lineId || l.id === input.lineId) : undefined;
    if (idx === -1) {
      const fallback: WorkCenterEntity = {
        id,
        workCenterId: id,
        code: input.code || id,
        name: input.name || "Work Center",
        lineId: input.lineId || "LIN-01",
        lineName: input.lineName || "Line 1",
        capacity: input.capacity || "38,000 BPH",
        status: input.status || "Active",
      };
      inMemoryWorkCenters.push(fallback);
      return fallback;
    }
    inMemoryWorkCenters[idx] = {
      ...inMemoryWorkCenters[idx],
      ...input,
      lineName: lineObj ? lineObj.name : (input.lineName || inMemoryWorkCenters[idx].lineName),
      id: inMemoryWorkCenters[idx].id,
      workCenterId: inMemoryWorkCenters[idx].workCenterId || inMemoryWorkCenters[idx].id,
    };
    return inMemoryWorkCenters[idx];
  }

  async deleteWorkCenter(tenantId: string | undefined, id: string) {
    const idx = inMemoryWorkCenters.findIndex((w) => w.id === id || w.workCenterId === id);
    if (idx !== -1) {
      const deleted = inMemoryWorkCenters.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Work Center deleted" };
  }

  // ==========================================
  // 6. SKUs, BOMs, ASSETS, STAFF, SPECS
  // ==========================================
  async listSkus(tenantId: string) {
    return await db.select().from(skus).where(eq(skus.tenantId, tenantId));
  }

  async createSku(tenantId: string, input: CreateSkuInput) {
    const [newSku] = await db
      .insert(skus)
      .values({
        tenantId,
        skuCode: input.skuCode,
        name: input.name,
        category: input.category,
        familyId: input.familyId,
        uom: input.uom,
        barcode: input.barcode,
        standardCost: input.standardCost.toString(),
        shelfLifeDays: input.shelfLifeDays,
        minStockLevel: input.minStockLevel.toString(),
        maxStockLevel: input.maxStockLevel.toString(),
      })
      .returning();

    return newSku;
  }

  async listBoms(tenantId: string) {
    return await db.query.boms.findMany({
      where: eq(boms.tenantId, tenantId),
      with: {
        sku: true,
        items: {
          with: {
            componentSku: true,
          },
        },
      },
    });
  }

  async getBomById(tenantId: string, id: string) {
    const bom = await db.query.boms.findFirst({
      where: and(eq(boms.tenantId, tenantId), eq(boms.id, id)),
      with: {
        sku: true,
        items: {
          with: {
            componentSku: true,
          },
        },
      },
    });

    if (!bom) throw new NotFoundError("BOM Recipe");
    return bom;
  }

  async listAssets(tenantId: string, plantId?: string) {
    if (plantId) {
      return await db.select().from(assets).where(and(eq(assets.tenantId, tenantId), eq(assets.plantId, plantId)));
    }
    return await db.select().from(assets).where(eq(assets.tenantId, tenantId));
  }

  async listStaff(tenantId: string, plantId?: string) {
    if (plantId) {
      return await db.select().from(staff).where(and(eq(staff.tenantId, tenantId), eq(staff.plantId, plantId)));
    }
    return await db.select().from(staff).where(eq(staff.tenantId, tenantId));
  }

  async listQualitySpecs(tenantId: string) {
    return await db.select().from(qualitySpecs).where(eq(qualitySpecs.tenantId, tenantId));
  }
}

export const masterDataService = new MasterDataService();

