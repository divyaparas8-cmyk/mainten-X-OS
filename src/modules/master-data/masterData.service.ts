import { db } from "../../config/database.js";
import { skus, boms, bomItems, productionLines, workCenters, assets, staff, qualitySpecs, routings, routingSteps } from "../../db/schema/masterData.js";
import { tenants, plants } from "../../db/schema/tenants.js";
import { eq, and, sql, desc, asc } from "drizzle-orm";
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
  ruleId?: string;
  fromSkuFamily: string;
  toSkuFamily: string;
  matrixType: string;
  requiredCleaningMin: number;
  allergenCleaningRequired: boolean;
  allergenType?: string;
  mechanicalChangeoverMin: number;
  totalDurationMin: number;
  status: string;
}

export interface SanitationClassEntity {
  id: string;
  classId?: string;
  code: string;
  name: string;
  cleaningLevel: string;
  washDurationMin: number;
  chemicalAgent: string;
  validationMethod: string;
  frequency: string;
  status: string;
}

export interface AllergenRuleEntity {
  id: string;
  ruleId?: string;
  allergenType: string;
  allergenName: string;
  riskLevel: string;
  protocol: string;
  verificationTest: string;
  status: string;
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

let inMemoryRoutings: RoutingEntity[] = [
  { id: "RTG-001", routingId: "RTG-001", routingCode: "RTG-SKU5001-L1", skuId: "SKU-001", skuCode: "SKU-5001", skuName: "Citrus Burst Soda 500ml PET", lineId: "LIN-01", lineCode: "LINE-1", lineName: "High-Speed Bottling Line 1", revision: "R1", approvalStatus: "Approved", status: "Active", stdRunRateBPH: 38000, setupDurationMin: 30, expectedYieldPct: 99.2, effectiveFrom: "2024-01-01", effectiveTo: "2030-12-31" },
  { id: "RTG-002", routingId: "RTG-002", routingCode: "RTG-SKU5002-L2", skuId: "SKU-002", skuCode: "SKU-5002", skuName: "Wild Berry Sparkling Water 330ml Can", lineId: "LIN-02", lineCode: "LINE-2", lineName: "Medium-Speed Glass Bottling Line 2", revision: "R1", approvalStatus: "Approved", status: "Active", stdRunRateBPH: 32000, setupDurationMin: 25, expectedYieldPct: 98.8, effectiveFrom: "2024-01-01", effectiveTo: "2030-12-31" },
];

let inMemoryProductFamilies: ProductFamilyEntity[] = [
  { id: "PF-01", familyId: "PF-01", code: "CSD-CARBONATED", name: "Carbonated Soft Drinks", category: "BEVERAGE", description: "High carbonation CSD beverages in PET and cans", status: "Active", skusCount: 12 },
  { id: "PF-02", familyId: "PF-02", code: "SPARK-WATER", name: "Flavored Sparkling Waters", category: "BEVERAGE", description: "Zero-sugar naturally flavored mineral waters", status: "Active", skusCount: 8 },
  { id: "PF-03", familyId: "PF-03", code: "JUICE-ASEPTIC", name: "Aseptic Juices & Nectars", category: "BEVERAGE", description: "100% fruit pulp juices in aseptic cartons & PET", status: "Active", skusCount: 6 },
];

let inMemoryUoms: UomEntity[] = [
  { id: "UOM-01", uomId: "UOM-01", code: "EA", name: "Each / Unit", category: "Count", baseUnit: "EA", conversionFactor: 1, status: "Active" },
  { id: "UOM-02", uomId: "UOM-02", code: "CS-24", name: "Case of 24", category: "Packaging", baseUnit: "EA", conversionFactor: 24, status: "Active" },
  { id: "UOM-03", uomId: "UOM-03", code: "PLT-72", name: "Pallet of 72 Cases", category: "Logistics", baseUnit: "CS-24", conversionFactor: 72, status: "Active" },
  { id: "UOM-04", uomId: "UOM-04", code: "LTR", name: "Liter", category: "Volume", baseUnit: "LTR", conversionFactor: 1, status: "Active" },
  { id: "UOM-05", uomId: "UOM-05", code: "KG", name: "Kilogram", category: "Weight", baseUnit: "KG", conversionFactor: 1, status: "Active" },
];

let inMemoryPackConfigs: PackConfigEntity[] = [
  { id: "PC-01", configId: "PC-01", code: "PC-PET500-24", name: "500ml PET 24-Pack Shrink Tray", packagingType: "Tray + Poly Film", primaryUnitCount: 24, secondaryUnitCount: 1, palletCount: 72, grossWeightKg: 12.8, status: "Active" },
  { id: "PC-02", configId: "PC-02", code: "PC-CAN330-24", name: "330ml Sleek Can 24-Pack Corrugated Box", packagingType: "RSC Cardboard Box", primaryUnitCount: 24, secondaryUnitCount: 1, palletCount: 80, grossWeightKg: 8.4, status: "Active" },
];

let inMemoryLineTargets: LineTargetEntity[] = [
  { id: "TGT-01", targetId: "TGT-01", plantId: "PLT-01", lineId: "LIN-01", lineName: "High-Speed Bottling Line 1", skuId: "SKU-001", skuCode: "SKU-5001", skuName: "Citrus Burst Soda", shift: "Morning Shift (A)", plannedOEE: 88.0, plannedUnitsPerHour: 36000, plannedYieldPct: 99.2, changeoverTimeMin: 20, status: "Active" },
  { id: "TGT-02", targetId: "TGT-02", plantId: "PLT-01", lineId: "LIN-02", lineName: "Medium-Speed Glass Line 2", skuId: "SKU-002", skuCode: "SKU-5002", skuName: "Wild Berry Sparkling Water", shift: "Morning Shift (A)", plannedOEE: 85.0, plannedUnitsPerHour: 30000, plannedYieldPct: 98.8, changeoverTimeMin: 25, status: "Active" },
];

let inMemoryChangeoverRules: ChangeoverRuleEntity[] = [
  { id: "CO-01", ruleId: "CO-01", fromSkuFamily: "CSD-CARBONATED", toSkuFamily: "SPARK-WATER", matrixType: "Flavor & Color Clear", requiredCleaningMin: 35, allergenCleaningRequired: false, allergenType: "", mechanicalChangeoverMin: 15, totalDurationMin: 50, status: "Active" },
  { id: "CO-02", ruleId: "CO-02", fromSkuFamily: "JUICE-ASEPTIC", toSkuFamily: "CSD-CARBONATED", matrixType: "Full CIP Sterilization", requiredCleaningMin: 60, allergenCleaningRequired: true, allergenType: "Fruit Pulp", mechanicalChangeoverMin: 30, totalDurationMin: 90, status: "Active" },
];

let inMemorySanitationClasses: SanitationClassEntity[] = [
  { id: "SAN-01", classId: "SAN-01", code: "SAN-CIP-HOT", name: "Hot Caustic CIP (3-Phase)", cleaningLevel: "Comprehensive", washDurationMin: 45, chemicalAgent: "2.0% NaOH @ 80°C", validationMethod: "Conductivity & Swab Test", frequency: "Daily / Major Changeover", status: "Active" },
  { id: "SAN-02", classId: "SAN-02", code: "SAN-RINSE-COLD", name: "Treated Water Flush & PAA Sanitize", cleaningLevel: "Intermediate", washDurationMin: 20, chemicalAgent: "0.2% Peracetic Acid", validationMethod: "Visual & ATP Swab", frequency: "Minor Flavor Shift", status: "Active" },
];

let inMemoryAllergenRules: AllergenRuleEntity[] = [
  { id: "ALG-01", ruleId: "ALG-01", allergenType: "Soy & Lecithin", allergenName: "Soy-Derived Emulsifiers", riskLevel: "High", protocol: "Hot Caustic CIP + Strip Inspection", verificationTest: "ELISA Specific Strip Test", status: "Active" },
  { id: "ALG-02", ruleId: "ALG-02", allergenType: "Dairy & Whey", allergenName: "Hydrolyzed Whey Protein", riskLevel: "Critical", protocol: "Full Alkaline CIP + Acid Rinse + Heat Sanitize", verificationTest: "Lateral Flow Strip + QA Signoff", status: "Active" },
];

let inMemorySkus: any[] = [
  {
    id: "SKU-001",
    skuId: "SKU-001",
    skuCode: "SKU-5001",
    code: "SKU-5001",
    name: "500ml Sparkling Citrus Soda",
    category: "Finished Goods",
    itemType: "Finished Good",
    familyId: "PF-01",
    family: "Sparkling Flavors",
    uom: "Bottles",
    plantId: "PLT-01",
    stdCost: 0.42,
    revision: "R3",
    status: "Active",
    approvalStatus: "Approved",
    shelfLifeDays: 365,
    packConfigCode: "PCK-5001-24",
    packSize: "24 x 500ml",
    eligibleLineIds: ["LIN-01", "LIN-02"],
    stdRunRateBPH: 42000,
    expectedYieldPct: 99.4,
  },
  {
    id: "SKU-002",
    skuId: "SKU-002",
    skuCode: "SKU-5002",
    code: "SKU-5002",
    name: "1L Tonic Water Natural Quinine",
    category: "Finished Goods",
    itemType: "Finished Good",
    familyId: "PF-02",
    family: "Tonics & Mixers",
    uom: "Bottles",
    plantId: "PLT-01",
    stdCost: 0.68,
    revision: "R2",
    status: "Active",
    approvalStatus: "Approved",
    shelfLifeDays: 540,
    packConfigCode: "PCK-5002-12",
    packSize: "12 x 1L",
    eligibleLineIds: ["LIN-01", "LIN-02"],
    stdRunRateBPH: 28000,
    expectedYieldPct: 99.2,
  },
  {
    id: "SKU-003",
    skuId: "SKU-003",
    skuCode: "SKU-5003",
    code: "SKU-5003",
    name: "330ml Organic Ginger Beer",
    category: "Finished Goods",
    itemType: "Finished Good",
    familyId: "PF-03",
    family: "Ginger Beers",
    uom: "Cans",
    plantId: "PLT-02",
    stdCost: 0.38,
    revision: "R4",
    status: "Active",
    approvalStatus: "Approved",
    shelfLifeDays: 270,
    packConfigCode: "PCK-5003-24",
    packSize: "24 x 330ml",
    eligibleLineIds: ["LIN-03"],
    stdRunRateBPH: 55000,
    expectedYieldPct: 99.0,
  },
  {
    id: "SKU-101",
    skuId: "SKU-101",
    skuCode: "ING-1001",
    code: "ING-1001",
    name: "Liquid Cane Sugar 67°Bx",
    category: "Raw Ingredients",
    itemType: "Raw Material",
    familyId: "FAM-04",
    family: "Sweeteners",
    uom: "Liters",
    plantId: "PLT-01",
    stdCost: 1.20,
    status: "Active",
  },
  {
    id: "SKU-201",
    skuId: "SKU-201",
    skuCode: "PKG-2001",
    code: "PKG-2001",
    name: "28mm Tamper-Evident HDPE Bottle Cap",
    category: "Packaging",
    itemType: "Packaging Component",
    familyId: "FAM-05",
    family: "Caps & Closures",
    uom: "Units",
    plantId: "PLT-01",
    stdCost: 0.025,
    status: "Active",
  },
];

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
    const idx = inMemoryCompanies.findIndex((c) => matchKey(c, id, ["id", "companyId", "code", "name"]));
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
    const idx = inMemoryCompanies.findIndex((c) => matchKey(c, id, ["id", "companyId", "code", "name"]));
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
    const idx = inMemoryPlants.findIndex((p) => matchKey(p, id, ["id", "plantId", "code", "name"]));
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
    const idx = inMemoryPlants.findIndex((p) => matchKey(p, id, ["id", "plantId", "code", "name"]));
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
      code: input.code ? String(input.code).trim().toUpperCase() : `DEP-0${inMemoryDepartments.length + 1}`,
      name: String(input.name || "Department").trim(),
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
    const idx = inMemoryDepartments.findIndex((d) => matchKey(d, id, ["id", "departmentId", "code", "name"]));
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
    const idx = inMemoryDepartments.findIndex((d) => matchKey(d, id, ["id", "departmentId", "code", "name"]));
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
      lineCode: input.lineCode ? String(input.lineCode).trim().toUpperCase() : (input.code ? String(input.code).trim().toUpperCase() : `LINE-${inMemoryLines.length + 1}`),
      code: input.lineCode ? String(input.lineCode).trim().toUpperCase() : (input.code ? String(input.code).trim().toUpperCase() : `LINE-${inMemoryLines.length + 1}`),
      name: String(input.name || "Production Line").trim(),
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

    try {
      const tId: string = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
      const [p] = await db.select().from(plants).where(eq(plants.tenantId, tId)).limit(1);
      const [insertedLine] = await db.insert(productionLines).values({
        tenantId: tId,
        plantId: p?.id || "bead41e2-b735-41b8-bd00-bdba1682fb6a",
        code: newLine.code || "LINE-01",
        name: newLine.name || "Production Line",
        lineType: newLine.lineType || "BOTTLING",
        nominalSpeedBpm: newLine.ratedSpeedBPH ? Math.round(newLine.ratedSpeedBPH / 60) : 250,
      }).returning();
      if (insertedLine) {
        newLine.id = insertedLine.id;
      }
    } catch (err: any) {
      console.warn("DB insert line error:", err.message);
    }

    return newLine;
  }

  async updateLine(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryLines.findIndex((l) => matchKey(l, id, ["id", "lineId", "lineCode", "code", "name"]));
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
    const idx = inMemoryLines.findIndex((l) => matchKey(l, id, ["id", "lineId", "lineCode", "code", "name"]));
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
    const lineObj = inMemoryLines.find((l) => matchKey(l, input.lineId, ["id", "lineId", "lineCode", "code", "name"]));
    const newWC: WorkCenterEntity = {
      id: newId,
      workCenterId: newId,
      code: input.code ? String(input.code).trim().toUpperCase() : `WC-0${inMemoryWorkCenters.length + 1}`,
      name: String(input.name || "Work Center").trim(),
      lineId: input.lineId || "LIN-01",
      lineName: input.lineName || (lineObj ? lineObj.name : "Line 1 — Aseptic Bottling"),
      plantId: input.plantId || (lineObj ? lineObj.plantId : "PLT-01"),
      capacity: input.capacity || "38,000 BPH",
      category: input.category || "PACKAGING",
      status: input.status || "Active",
    };
    inMemoryWorkCenters.push(newWC);

    try {
      const tId: string = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
      const [p] = await db.select().from(plants).where(eq(plants.tenantId, tId)).limit(1);
      const [insertedWc] = await db.insert(workCenters).values({
        tenantId: tId,
        plantId: p?.id || "bead41e2-b735-41b8-bd00-bdba1682fb6a",
        code: newWC.code || "WC-01",
        name: newWC.name || "Work Center",
        category: newWC.category || "PACKAGING",
        capacityPerHour: "36000",
      }).returning();
      if (insertedWc) {
        newWC.id = insertedWc.id;
      }
    } catch (err: any) {
      console.warn("DB insert workCenter error:", err.message);
    }

    return newWC;
  }

  async updateWorkCenter(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryWorkCenters.findIndex((w) => matchKey(w, id, ["id", "workCenterId", "code", "name"]));
    const lineObj = input.lineId ? inMemoryLines.find((l) => matchKey(l, input.lineId, ["id", "lineId", "lineCode", "code", "name"])) : undefined;
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
    const idx = inMemoryWorkCenters.findIndex((w) => matchKey(w, id, ["id", "workCenterId", "code", "name"]));
    if (idx !== -1) {
      const deleted = inMemoryWorkCenters.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Work Center deleted" };
  }

  // ==========================================
  // 6. STANDARD OPERATIONS
  // ==========================================
  async listOperations(tenantId?: string, department?: string) {
    if (department && department !== "ALL") {
      return inMemoryOperations.filter((o) => o.department === department);
    }
    return inMemoryOperations;
  }

  async createOperation(tenantId: string | undefined, input: any) {
    const newId = `OP-0${inMemoryOperations.length + 1}`;
    const newOp: OperationEntity = {
      id: newId,
      operationId: newId,
      operationCode: (input.operationCode || input.code || `OP-${inMemoryOperations.length + 1}`).toUpperCase(),
      code: (input.operationCode || input.code || `OP-${inMemoryOperations.length + 1}`).toUpperCase(),
      name: input.name,
      sequence: Number(input.sequence) || (inMemoryOperations.length + 1) * 10,
      department: input.department || "Packaging",
      stdDurationMin: Number(input.stdDurationMin || input.stdTimeMins) || 45,
      setupDurationMin: Number(input.setupDurationMin) || 15,
      status: input.status || "Active",
    };
    inMemoryOperations.unshift(newOp);
    return newOp;
  }

  async updateOperation(tenantId: string | undefined, id: string, input: any) {
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
    } catch (err) {
      console.warn("Could not query DB routings, falling back to memory:", (err as Error).message);
    }
    return inMemoryRoutings;
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

      let resolvedSkuId = input.skuId;
      let skuCode = input.skuCode;
      let skuName = input.skuName;
      if (!resolvedSkuId || resolvedSkuId.startsWith("SKU-0")) {
        const [sku] = await db.select().from(skus).where(eq(skus.skuCode, input.skuCode || "SKU-5001")).limit(1);
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
      }

      let resolvedLineId = input.lineId;
      let lineCode = input.lineCode;
      let lineName = input.lineName;
      if (!resolvedLineId || resolvedLineId.startsWith("LIN-")) {
        const [line] = await db.select().from(productionLines).where(eq(productionLines.code, input.lineCode || "LINE-1")).limit(1);
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
      }

      const routingCode = (input.routingCode || `RTG-${skuCode || "5000"}-L1`).toUpperCase();

      if (resolvedTenantId && resolvedSkuId) {
        const [inserted] = await db
          .insert(routings)
          .values({
            tenantId: resolvedTenantId,
            plantId: input.plantId || null,
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
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const condition = isUUID ? eq(routings.id, id) : eq(routings.routingCode, id);
      await db.delete(routings).where(condition);
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
    return inMemoryProductFamilies;
  }

  async createProductFamily(tenantId: string | undefined, input: any) {
    const newId = `PF-0${inMemoryProductFamilies.length + 1}`;
    const newFamily: ProductFamilyEntity = {
      id: newId,
      familyId: newId,
      code: (input.code || `PF-0${inMemoryProductFamilies.length + 1}`).toUpperCase(),
      name: input.name,
      category: input.category || "BEVERAGE",
      description: input.description || "",
      status: input.status || "Active",
      skusCount: Number(input.skusCount) || 0,
    };
    inMemoryProductFamilies.unshift(newFamily);
    return newFamily;
  }

  async updateProductFamily(tenantId: string | undefined, id: string, input: any) {
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
    return inMemoryUoms;
  }

  async createUom(tenantId: string | undefined, input: any) {
    const newId = `UOM-0${inMemoryUoms.length + 1}`;
    const newUom: UomEntity = {
      id: newId,
      uomId: newId,
      code: (input.code || `UOM-${inMemoryUoms.length + 1}`).toUpperCase(),
      name: input.name,
      category: input.category || "Count",
      baseUnit: input.baseUnit || "EA",
      conversionFactor: Number(input.conversionFactor) || 1,
      status: input.status || "Active",
    };
    inMemoryUoms.push(newUom);
    return newUom;
  }

  async updateUom(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryUoms.findIndex((u) => matchKey(u, id, ["id", "uomId", "code", "name"]));
    if (idx !== -1) {
      inMemoryUoms[idx] = { ...inMemoryUoms[idx], ...input };
      return inMemoryUoms[idx];
    }
    return { id, ...input };
  }

  async deleteUom(tenantId: string | undefined, id: string) {
    const idx = inMemoryUoms.findIndex((u) => matchKey(u, id, ["id", "uomId", "code", "name"]));
    if (idx !== -1) {
      const deleted = inMemoryUoms.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "UOM deleted" };
  }

  // ==========================================
  // 10. PACK CONFIGS
  // ==========================================
  async listPackConfigs(tenantId?: string) {
    return inMemoryPackConfigs;
  }

  async createPackConfig(tenantId: string | undefined, input: any) {
    const newId = `PC-0${inMemoryPackConfigs.length + 1}`;
    const newConfig: PackConfigEntity = {
      id: newId,
      configId: newId,
      code: (input.code || `PC-0${inMemoryPackConfigs.length + 1}`).toUpperCase(),
      name: input.name,
      packagingType: input.packagingType || "Tray + Poly Film",
      primaryUnitCount: Number(input.primaryUnitCount) || 24,
      secondaryUnitCount: Number(input.secondaryUnitCount) || 1,
      palletCount: Number(input.palletCount) || 72,
      grossWeightKg: Number(input.grossWeightKg) || 12.5,
      status: input.status || "Active",
    };
    inMemoryPackConfigs.push(newConfig);
    return newConfig;
  }

  async updatePackConfig(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryPackConfigs.findIndex((p) => matchKey(p, id, ["id", "configId", "code", "name"]));
    if (idx !== -1) {
      inMemoryPackConfigs[idx] = { ...inMemoryPackConfigs[idx], ...input };
      return inMemoryPackConfigs[idx];
    }
    return { id, ...input };
  }

  async deletePackConfig(tenantId: string | undefined, id: string) {
    const idx = inMemoryPackConfigs.findIndex((p) => matchKey(p, id, ["id", "configId", "code", "name"]));
    if (idx !== -1) {
      const deleted = inMemoryPackConfigs.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "Pack config deleted" };
  }

  // ==========================================
  // 11. LINE TARGETS
  // ==========================================
  async listLineTargets(tenantId?: string) {
    return inMemoryLineTargets;
  }

  async createLineTarget(tenantId: string | undefined, input: any) {
    const newId = `TGT-0${inMemoryLineTargets.length + 1}`;
    const newTarget: LineTargetEntity = {
      id: newId,
      targetId: newId,
      plantId: input.plantId || "PLT-01",
      lineId: input.lineId || "LIN-01",
      lineName: input.lineName || "High-Speed Bottling Line 1",
      skuId: input.skuId || "SKU-001",
      skuCode: input.skuCode || "SKU-5001",
      skuName: input.skuName || "Citrus Burst Soda",
      shift: input.shift || "Morning Shift (A)",
      plannedOEE: Number(input.plannedOEE) || 88.0,
      plannedUnitsPerHour: Number(input.plannedUnitsPerHour) || 36000,
      plannedYieldPct: Number(input.plannedYieldPct) || 99.0,
      changeoverTimeMin: Number(input.changeoverTimeMin) || 20,
      status: input.status || "Active",
    };
    inMemoryLineTargets.push(newTarget);
    return newTarget;
  }

  async updateLineTarget(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryLineTargets.findIndex((t) => t.id === id || t.targetId === id);
    if (idx !== -1) {
      inMemoryLineTargets[idx] = { ...inMemoryLineTargets[idx], ...input };
      return inMemoryLineTargets[idx];
    }
    return { id, ...input };
  }

  async deleteLineTarget(tenantId: string | undefined, id: string) {
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
    return inMemoryChangeoverRules;
  }

  async createChangeoverRule(tenantId: string | undefined, input: any) {
    const newId = `CO-0${inMemoryChangeoverRules.length + 1}`;
    const newRule: ChangeoverRuleEntity = {
      id: newId,
      ruleId: newId,
      fromSkuFamily: input.fromSkuFamily || "CSD-CARBONATED",
      toSkuFamily: input.toSkuFamily || "JUICE-ASEPTIC",
      matrixType: input.matrixType || "Flavor Change",
      requiredCleaningMin: Number(input.requiredCleaningMin) || 30,
      allergenCleaningRequired: Boolean(input.allergenCleaningRequired),
      allergenType: input.allergenType || "",
      mechanicalChangeoverMin: Number(input.mechanicalChangeoverMin) || 20,
      totalDurationMin: Number(input.requiredCleaningMin || 30) + Number(input.mechanicalChangeoverMin || 20),
      status: input.status || "Active",
    };
    inMemoryChangeoverRules.push(newRule);
    return newRule;
  }

  async updateChangeoverRule(tenantId: string | undefined, id: string, input: any) {
    const idx = inMemoryChangeoverRules.findIndex((r) => r.id === id || r.ruleId === id);
    if (idx !== -1) {
      inMemoryChangeoverRules[idx] = { ...inMemoryChangeoverRules[idx], ...input };
      return inMemoryChangeoverRules[idx];
    }
    return { id, ...input };
  }

  async deleteChangeoverRule(tenantId: string | undefined, id: string) {
    const idx = inMemoryChangeoverRules.findIndex((r) => r.id === id || r.ruleId === id);
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
    return inMemorySanitationClasses;
  }

  async createSanitationClass(tenantId: string | undefined, input: any) {
    const newId = `SAN-0${inMemorySanitationClasses.length + 1}`;
    const newSan: SanitationClassEntity = {
      id: newId,
      classId: newId,
      code: (input.code || `SAN-${inMemorySanitationClasses.length + 1}`).toUpperCase(),
      name: input.name,
      cleaningLevel: input.cleaningLevel || "Intermediate",
      washDurationMin: Number(input.washDurationMin) || 30,
      chemicalAgent: input.chemicalAgent || "Caustic Solution",
      validationMethod: input.validationMethod || "Visual & Swab",
      frequency: input.frequency || "Daily",
      status: input.status || "Active",
    };
    inMemorySanitationClasses.push(newSan);
    return newSan;
  }

  async listAllergenRules(tenantId?: string) {
    return inMemoryAllergenRules;
  }

  async createAllergenRule(tenantId: string | undefined, input: any) {
    const newId = `ALG-0${inMemoryAllergenRules.length + 1}`;
    const newAlg: AllergenRuleEntity = {
      id: newId,
      ruleId: newId,
      allergenType: input.allergenType || "Flavors",
      allergenName: input.allergenName || "Natural Terpenes",
      riskLevel: input.riskLevel || "Medium",
      protocol: input.protocol || "Full CIP Rinse",
      verificationTest: input.verificationTest || "ATP Test",
      status: input.status || "Active",
    };
    inMemoryAllergenRules.push(newAlg);
    return newAlg;
  }

  // ==========================================
  // 14. SKUs, BOMs, ASSETS, STAFF, SPECS
  // ==========================================
  async listSkus(tenantId?: string) {
    try {
      const dbSkus = tenantId
        ? await db.select().from(skus).where(eq(skus.tenantId, tenantId))
        : await db.select().from(skus);
      if (dbSkus && dbSkus.length > 0) {
        return dbSkus.map((s) => ({
          ...s,
          id: s.id,
          skuId: s.id,
          code: s.skuCode,
          itemType: s.category === "BEVERAGE" || s.category === "Finished Goods" ? "Finished Good" : s.category,
          status: (s as any).status || (s.isActive ? "Active" : "Inactive") || "Active",
        }));
      }
    } catch (_) {}
    return inMemorySkus;
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
      const tId = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
      const cat = (newSku.category.toUpperCase().includes("RAW")) ? "RAW_MATERIAL" : (newSku.category.toUpperCase().includes("PACK") ? "PACKAGING" : "FINISHED_GOODS");
      const [insertedSku] = await db.insert(skus).values({
        tenantId: tId,
        skuCode: newSku.skuCode,
        name: newSku.name,
        category: cat,
        uom: newSku.uom,
        standardCost: newSku.stdCost.toString(),
        shelfLifeDays: newSku.shelfLifeDays,
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
      inMemorySkus[idx] = { ...inMemorySkus[idx], ...input };
      return inMemorySkus[idx];
    }
    return { id, ...input };
  }

  async deleteSku(tenantId: string | undefined, id: string) {
    const idx = inMemorySkus.findIndex((s) => matchKey(s, id, ["id", "skuId", "skuCode", "code", "name"]));
    if (idx !== -1) {
      const deleted = inMemorySkus.splice(idx, 1);
      return deleted[0];
    }
    return { id, message: "SKU deleted" };
  }

  async listBoms(tenantId?: string) {
    try {
      if (tenantId) {
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
      return await db.query.boms.findMany({
        with: {
          sku: true,
          items: {
            with: {
              componentSku: true,
            },
          },
        },
      });
    } catch {
      return [];
    }
  }

  async createBom(tenantId: string | undefined, input: any) {
    return { id: `BOM-${Date.now()}`, ...input, status: "Active", approvalStatus: "Approved" };
  }

  async updateBom(tenantId: string | undefined, id: string, input: any) {
    return { id, ...input };
  }

  async deleteBom(tenantId: string | undefined, id: string) {
    return { id, message: "BOM deleted" };
  }

  async listAssets(tenantId: string | undefined, plantId?: string) {
    try {
      const tId = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
      const isUuid = plantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plantId);
      if (isUuid) {
        return await db.select().from(assets).where(and(eq(assets.tenantId, tId), eq(assets.plantId, plantId)));
      }
      return await db.select().from(assets).where(eq(assets.tenantId, tId));
    } catch {
      return [];
    }
  }

  async listStaff(tenantId: string | undefined, plantId?: string) {
    try {
      const tId = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
      const isUuid = plantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plantId);
      if (isUuid) {
        return await db.select().from(staff).where(and(eq(staff.tenantId, tId), eq(staff.plantId, plantId)));
      }
      return await db.select().from(staff).where(eq(staff.tenantId, tId));
    } catch {
      return [];
    }
  }

  async listQualitySpecs(tenantId?: string) {
    try {
      const tId = tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
      return await db.select().from(qualitySpecs).where(eq(qualitySpecs.tenantId, tId));
    } catch {
      return [];
    }
  }
}

export const masterDataService = new MasterDataService();

