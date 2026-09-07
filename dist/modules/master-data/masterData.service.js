"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataService = exports.MasterDataService = void 0;
const database_js_1 = require("../../config/database.js");
const masterData_js_1 = require("../../db/schema/masterData.js");
const tenants_js_1 = require("../../db/schema/tenants.js");
const drizzle_orm_1 = require("drizzle-orm");
let inMemoryCompanies = [
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
let inMemoryPlants = [
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
let inMemoryDepartments = [
    { id: "DEP-01", departmentId: "DEP-01", plantId: "PLT-01", code: "PROD", name: "Production & Bottling", deptHead: "Robert Thorne", managerName: "Robert Thorne", costCenter: "CC-101", operatingShifts: "3 Shifts (24/7 Continuous)", status: "Active" },
    { id: "DEP-02", departmentId: "DEP-02", plantId: "PLT-01", code: "MAINT", name: "Maintenance & Reliability", deptHead: "Marcus Vance", managerName: "Marcus Vance", costCenter: "CC-102", operatingShifts: "3 Shifts (24/7 Continuous)", status: "Active" },
    { id: "DEP-03", departmentId: "DEP-03", plantId: "PLT-01", code: "QAQC", name: "Quality Assurance & Lab", deptHead: "Sarah Jenkins", managerName: "Sarah Jenkins", costCenter: "CC-103", operatingShifts: "2 Shifts (Day & Night)", status: "Active" },
    { id: "DEP-04", departmentId: "DEP-04", plantId: "PLT-01", code: "WHSE", name: "Warehouse & Materials", deptHead: "David Kim", managerName: "David Kim", costCenter: "CC-104", operatingShifts: "3 Shifts (24/7 Continuous)", status: "Active" },
    { id: "DEP-05", departmentId: "DEP-05", plantId: "PLT-01", code: "CI-ENG", name: "Continuous Improvement & Engineering", deptHead: "Alexander Vance", managerName: "Alexander Vance", costCenter: "CC-105", operatingShifts: "1 Shift (General)", status: "Active" },
];
let inMemoryLines = [
    { lineId: "LIN-01", id: "LIN-01", lineCode: "LINE-1", code: "LINE-1", name: "High-Speed Bottling Line 1", plantId: "PLT-01", plantName: "Indore Plant", type: "Continuous Flow", lineType: "BOTTLING", ratedSpeed: "38,000 BPH", ratedSpeedBPH: 38000, status: "Active", healthScore: 96 },
    { lineId: "LIN-02", id: "LIN-02", lineCode: "LINE-2", code: "LINE-2", name: "Medium-Speed Glass Bottling Line 2", plantId: "PLT-01", plantName: "Indore Plant", type: "Continuous Flow", lineType: "BOTTLING", ratedSpeed: "38,000 BPH", ratedSpeedBPH: 38000, status: "Active", healthScore: 92 },
    { lineId: "LIN-03", id: "LIN-03", lineCode: "LINE-3", code: "LINE-3", name: "Automated Sleek Canning Line 3", plantId: "PLT-02", plantName: "Austin Facility", type: "Continuous Flow", lineType: "CANNING", ratedSpeed: "38,000 BPH", ratedSpeedBPH: 38000, status: "Active", healthScore: 94 },
];
let inMemoryWorkCenters = [
    { id: "WC-101", workCenterId: "WC-101", code: "FILL-01", name: "Rotary Isobaric Filler", lineId: "LIN-01", lineName: "Line 1 — Aseptic Bottling", plantId: "PLT-01", capacity: "38,000 BPH", category: "PACKAGING", status: "Active" },
    { id: "WC-102", workCenterId: "WC-102", code: "CAPP-01", name: "Induction Cap Sealer", lineId: "LIN-01", lineName: "Line 1 — Aseptic Bottling", plantId: "PLT-01", capacity: "38,000 BPH", category: "PACKAGING", status: "Active" },
    { id: "WC-103", workCenterId: "WC-103", code: "LABL-01", name: "Sleeve Rotary Labeler", lineId: "LIN-01", lineName: "Line 1 — Aseptic Bottling", plantId: "PLT-01", capacity: "40,000 BPH", category: "PACKAGING", status: "Active" },
    { id: "WC-201", workCenterId: "WC-201", code: "PAST-02", name: "HTST Flash Pasteurizer", lineId: "LIN-02", lineName: "Line 2 — Formulation & Pasteurizer", plantId: "PLT-01", capacity: "30,000 L/hr", category: "PROCESSING", status: "Active" },
    { id: "WC-301", workCenterId: "WC-301", code: "SEAM-03", name: "Can Seamer Station", lineId: "LIN-03", lineName: "Line 3 — Canning Line", plantId: "PLT-02", capacity: "45,000 CPH", category: "PACKAGING", status: "Active" },
];
let inMemoryOperations = [
    { id: "OP-01", operationId: "OP-01", operationCode: "OP-DEPAL", code: "OP-DEPAL", name: "Bulk Depalletization", sequence: 10, department: "Packaging", stdDurationMin: 30, setupDurationMin: 15, status: "Active" },
    { id: "OP-02", operationId: "OP-02", operationCode: "OP-RINSE", code: "OP-RINSE", name: "Ionized Air & Water Rinse", sequence: 20, department: "Packaging", stdDurationMin: 45, setupDurationMin: 15, status: "Active" },
    { id: "OP-03", operationId: "OP-03", operationCode: "OP-FILL", code: "OP-FILL", name: "Isobaric Filling & Purge", sequence: 30, department: "Packaging", stdDurationMin: 60, setupDurationMin: 20, status: "Active" },
    { id: "OP-04", operationId: "OP-04", operationCode: "OP-CAP", code: "OP-CAP", name: "Aseptic Induction Capping", sequence: 40, department: "Packaging", stdDurationMin: 30, setupDurationMin: 10, status: "Active" },
    { id: "OP-05", operationId: "OP-05", operationCode: "OP-LABEL", code: "OP-LABEL", name: "Rotary Hot-Melt Labeling", sequence: 50, department: "Packaging", stdDurationMin: 45, setupDurationMin: 15, status: "Active" },
    { id: "OP-06", operationId: "OP-06", operationCode: "OP-CASE", code: "OP-CASE", name: "Wrap-Around Case Packing", sequence: 60, department: "Packaging", stdDurationMin: 40, setupDurationMin: 15, status: "Active" },
    { id: "OP-07", operationId: "OP-07", operationCode: "OP-PALLET", code: "OP-PALLET", name: "Robotic High-Level Palletizing", sequence: 70, department: "Packaging", stdDurationMin: 30, setupDurationMin: 10, status: "Active" },
];
let inMemoryRoutings = [
    { id: "RTG-001", routingId: "RTG-001", routingCode: "RTG-SKU5001-L1", skuId: "SKU-001", skuCode: "SKU-5001", skuName: "Citrus Burst Soda 500ml PET", lineId: "LIN-01", lineCode: "LINE-1", lineName: "High-Speed Bottling Line 1", revision: "R1", approvalStatus: "Approved", status: "Active", stdRunRateBPH: 38000, setupDurationMin: 30, expectedYieldPct: 99.2, effectiveFrom: "2024-01-01", effectiveTo: "2030-12-31" },
    { id: "RTG-002", routingId: "RTG-002", routingCode: "RTG-SKU5002-L2", skuId: "SKU-002", skuCode: "SKU-5002", skuName: "Wild Berry Sparkling Water 330ml Can", lineId: "LIN-02", lineCode: "LINE-2", lineName: "Medium-Speed Glass Bottling Line 2", revision: "R1", approvalStatus: "Approved", status: "Active", stdRunRateBPH: 32000, setupDurationMin: 25, expectedYieldPct: 98.8, effectiveFrom: "2024-01-01", effectiveTo: "2030-12-31" },
];
let inMemoryProductFamilies = [
    { id: "PF-01", familyId: "PF-01", code: "CSD-CARBONATED", name: "Carbonated Soft Drinks", category: "BEVERAGE", description: "High carbonation CSD beverages in PET and cans", status: "Active", skusCount: 12 },
    { id: "PF-02", familyId: "PF-02", code: "SPARK-WATER", name: "Flavored Sparkling Waters", category: "BEVERAGE", description: "Zero-sugar naturally flavored mineral waters", status: "Active", skusCount: 8 },
    { id: "PF-03", familyId: "PF-03", code: "JUICE-ASEPTIC", name: "Aseptic Juices & Nectars", category: "BEVERAGE", description: "100% fruit pulp juices in aseptic cartons & PET", status: "Active", skusCount: 6 },
];
let inMemoryUoms = [
    { id: "UOM-01", uomId: "UOM-01", code: "EA", name: "Each / Unit", category: "Count", baseUnit: "EA", conversionFactor: 1, status: "Active" },
    { id: "UOM-02", uomId: "UOM-02", code: "CS-24", name: "Case of 24", category: "Packaging", baseUnit: "EA", conversionFactor: 24, status: "Active" },
    { id: "UOM-03", uomId: "UOM-03", code: "PLT-72", name: "Pallet of 72 Cases", category: "Logistics", baseUnit: "CS-24", conversionFactor: 72, status: "Active" },
    { id: "UOM-04", uomId: "UOM-04", code: "LTR", name: "Liter", category: "Volume", baseUnit: "LTR", conversionFactor: 1, status: "Active" },
    { id: "UOM-05", uomId: "UOM-05", code: "KG", name: "Kilogram", category: "Weight", baseUnit: "KG", conversionFactor: 1, status: "Active" },
];
let inMemoryPackConfigs = [
    { id: "PC-01", configId: "PC-01", code: "PC-PET500-24", name: "500ml PET 24-Pack Shrink Tray", packagingType: "Tray + Poly Film", primaryUnitCount: 24, secondaryUnitCount: 1, palletCount: 72, grossWeightKg: 12.8, status: "Active" },
    { id: "PC-02", configId: "PC-02", code: "PC-CAN330-24", name: "330ml Sleek Can 24-Pack Corrugated Box", packagingType: "RSC Cardboard Box", primaryUnitCount: 24, secondaryUnitCount: 1, palletCount: 80, grossWeightKg: 8.4, status: "Active" },
];
let inMemoryLineTargets = [
    { id: "TGT-01", targetId: "TGT-01", plantId: "PLT-01", lineId: "LIN-01", lineName: "High-Speed Bottling Line 1", skuId: "SKU-001", skuCode: "SKU-5001", skuName: "Citrus Burst Soda", shift: "Morning Shift (A)", plannedOEE: 88.0, plannedUnitsPerHour: 36000, plannedYieldPct: 99.2, changeoverTimeMin: 20, status: "Active" },
    { id: "TGT-02", targetId: "TGT-02", plantId: "PLT-01", lineId: "LIN-02", lineName: "Medium-Speed Glass Line 2", skuId: "SKU-002", skuCode: "SKU-5002", skuName: "Wild Berry Sparkling Water", shift: "Morning Shift (A)", plannedOEE: 85.0, plannedUnitsPerHour: 30000, plannedYieldPct: 98.8, changeoverTimeMin: 25, status: "Active" },
];
let inMemoryChangeoverRules = [
    { id: "CO-01", ruleId: "CO-01", fromSkuFamily: "CSD-CARBONATED", toSkuFamily: "SPARK-WATER", matrixType: "Flavor & Color Clear", requiredCleaningMin: 35, allergenCleaningRequired: false, allergenType: "", mechanicalChangeoverMin: 15, totalDurationMin: 50, status: "Active" },
    { id: "CO-02", ruleId: "CO-02", fromSkuFamily: "JUICE-ASEPTIC", toSkuFamily: "CSD-CARBONATED", matrixType: "Full CIP Sterilization", requiredCleaningMin: 60, allergenCleaningRequired: true, allergenType: "Fruit Pulp", mechanicalChangeoverMin: 30, totalDurationMin: 90, status: "Active" },
];
let inMemorySanitationClasses = [
    { id: "SAN-01", classId: "SAN-01", code: "SAN-CIP-HOT", name: "Hot Caustic CIP (3-Phase)", cleaningLevel: "Comprehensive", washDurationMin: 45, chemicalAgent: "2.0% NaOH @ 80°C", validationMethod: "Conductivity & Swab Test", frequency: "Daily / Major Changeover", status: "Active" },
    { id: "SAN-02", classId: "SAN-02", code: "SAN-RINSE-COLD", name: "Treated Water Flush & PAA Sanitize", cleaningLevel: "Intermediate", washDurationMin: 20, chemicalAgent: "0.2% Peracetic Acid", validationMethod: "Visual & ATP Swab", frequency: "Minor Flavor Shift", status: "Active" },
];
let inMemoryAllergenRules = [
    { id: "ALG-01", ruleId: "ALG-01", allergenType: "Soy & Lecithin", allergenName: "Soy-Derived Emulsifiers", riskLevel: "High", protocol: "Hot Caustic CIP + Strip Inspection", verificationTest: "ELISA Specific Strip Test", status: "Active" },
    { id: "ALG-02", ruleId: "ALG-02", allergenType: "Dairy & Whey", allergenName: "Hydrolyzed Whey Protein", riskLevel: "Critical", protocol: "Full Alkaline CIP + Acid Rinse + Heat Sanitize", verificationTest: "Lateral Flow Strip + QA Signoff", status: "Active" },
];
class MasterDataService {
    // ==========================================
    // 1. COMPANIES / LEGAL ENTITIES
    // ==========================================
    async listCompanies(tenantId) {
        return inMemoryCompanies;
    }
    async createCompany(tenantId, input) {
        const newId = `CMP-0${inMemoryCompanies.length + 1}`;
        const newCompany = {
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
    async updateCompany(tenantId, id, input) {
        const idx = inMemoryCompanies.findIndex((c) => c.id === id || c.companyId === id || c.code === id);
        if (idx === -1) {
            const fallback = {
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
    async deleteCompany(tenantId, id) {
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
    async listPlants(tenantId) {
        try {
            const dbPlants = await database_js_1.db.select().from(tenants_js_1.plants);
            if (dbPlants && dbPlants.length > 0) {
                // Merge with memory
                const dbMapped = dbPlants.map((p) => ({
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
        }
        catch (err) {
            // fallback to memory
        }
        return inMemoryPlants;
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
        inMemoryPlants.push(newPlant);
        return newPlant;
    }
    async updatePlant(tenantId, id, input) {
        const idx = inMemoryPlants.findIndex((p) => p.id === id || p.plantId === id || p.code === id);
        if (idx === -1) {
            const fallback = {
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
    async deletePlant(tenantId, id) {
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
    async listDepartments(tenantId, plantId) {
        if (plantId && plantId !== "ALL") {
            return inMemoryDepartments.filter((d) => d.plantId === plantId);
        }
        return inMemoryDepartments;
    }
    async createDepartment(tenantId, input) {
        const newId = `DEP-0${inMemoryDepartments.length + 1}`;
        const newDept = {
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
    async updateDepartment(tenantId, id, input) {
        const idx = inMemoryDepartments.findIndex((d) => d.id === id || d.departmentId === id || d.code === id);
        if (idx === -1) {
            const fallback = {
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
    async deleteDepartment(tenantId, id) {
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
    async listLines(tenantId, plantId) {
        if (plantId && plantId !== "ALL") {
            return inMemoryLines.filter((l) => l.plantId === plantId);
        }
        return inMemoryLines;
    }
    async createLine(tenantId, input) {
        const newId = `LIN-0${inMemoryLines.length + 1}`;
        const newLine = {
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
    async updateLine(tenantId, id, input) {
        const idx = inMemoryLines.findIndex((l) => l.lineId === id || l.id === id || l.lineCode === id || l.code === id);
        if (idx === -1) {
            const fallback = {
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
    async deleteLine(tenantId, id) {
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
    async listWorkCenters(tenantId, plantId) {
        if (plantId && plantId !== "ALL") {
            return inMemoryWorkCenters.filter((w) => w.plantId === plantId || !w.plantId);
        }
        return inMemoryWorkCenters;
    }
    async createWorkCenter(tenantId, input) {
        const newId = `WC-${Math.floor(400 + Math.random() * 99)}`;
        const lineObj = inMemoryLines.find((l) => l.lineId === input.lineId || l.id === input.lineId);
        const newWC = {
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
    async updateWorkCenter(tenantId, id, input) {
        const idx = inMemoryWorkCenters.findIndex((w) => w.id === id || w.workCenterId === id || w.code === id);
        const lineObj = input.lineId ? inMemoryLines.find((l) => l.lineId === input.lineId || l.id === input.lineId) : undefined;
        if (idx === -1) {
            const fallback = {
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
    async deleteWorkCenter(tenantId, id) {
        const idx = inMemoryWorkCenters.findIndex((w) => w.id === id || w.workCenterId === id);
        if (idx !== -1) {
            const deleted = inMemoryWorkCenters.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Work Center deleted" };
    }
    // ==========================================
    // 6. STANDARD OPERATIONS
    // ==========================================
    async listOperations(tenantId, department) {
        if (department && department !== "ALL") {
            return inMemoryOperations.filter((o) => o.department === department);
        }
        return inMemoryOperations;
    }
    async createOperation(tenantId, input) {
        const newId = `OP-0${inMemoryOperations.length + 1}`;
        const newOp = {
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
    async updateOperation(tenantId, id, input) {
        const idx = inMemoryOperations.findIndex((o) => o.id === id || o.operationId === id || o.operationCode === id);
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
        const idx = inMemoryOperations.findIndex((o) => o.id === id || o.operationId === id || o.operationCode === id);
        if (idx !== -1) {
            const deleted = inMemoryOperations.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Operation deleted" };
    }
    // ==========================================
    // 7. ROUTINGS MASTER
    // ==========================================
    async listRoutings(tenantId) {
        return inMemoryRoutings;
    }
    async createRouting(tenantId, input) {
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
            stdRunRateBPH: Number(input.stdRunRateBPH) || 38000,
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
        const idx = inMemoryRoutings.findIndex((r) => r.id === id || r.routingId === id || r.routingCode === id);
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
    async deleteRouting(tenantId, id) {
        const idx = inMemoryRoutings.findIndex((r) => r.id === id || r.routingId === id || r.routingCode === id);
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
        return inMemoryProductFamilies;
    }
    async createProductFamily(tenantId, input) {
        const newId = `PF-0${inMemoryProductFamilies.length + 1}`;
        const newFamily = {
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
    async updateProductFamily(tenantId, id, input) {
        const idx = inMemoryProductFamilies.findIndex((f) => f.id === id || f.familyId === id || f.code === id);
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
        const idx = inMemoryProductFamilies.findIndex((f) => f.id === id || f.familyId === id || f.code === id);
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
        return inMemoryUoms;
    }
    async createUom(tenantId, input) {
        const newId = `UOM-0${inMemoryUoms.length + 1}`;
        const newUom = {
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
    async updateUom(tenantId, id, input) {
        const idx = inMemoryUoms.findIndex((u) => u.id === id || u.uomId === id || u.code === id);
        if (idx !== -1) {
            inMemoryUoms[idx] = { ...inMemoryUoms[idx], ...input };
            return inMemoryUoms[idx];
        }
        return { id, ...input };
    }
    async deleteUom(tenantId, id) {
        const idx = inMemoryUoms.findIndex((u) => u.id === id || u.uomId === id || u.code === id);
        if (idx !== -1) {
            const deleted = inMemoryUoms.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "UOM deleted" };
    }
    // ==========================================
    // 10. PACK CONFIGS
    // ==========================================
    async listPackConfigs(tenantId) {
        return inMemoryPackConfigs;
    }
    async createPackConfig(tenantId, input) {
        const newId = `PC-0${inMemoryPackConfigs.length + 1}`;
        const newConfig = {
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
    async updatePackConfig(tenantId, id, input) {
        const idx = inMemoryPackConfigs.findIndex((p) => p.id === id || p.configId === id || p.code === id);
        if (idx !== -1) {
            inMemoryPackConfigs[idx] = { ...inMemoryPackConfigs[idx], ...input };
            return inMemoryPackConfigs[idx];
        }
        return { id, ...input };
    }
    async deletePackConfig(tenantId, id) {
        const idx = inMemoryPackConfigs.findIndex((p) => p.id === id || p.configId === id || p.code === id);
        if (idx !== -1) {
            const deleted = inMemoryPackConfigs.splice(idx, 1);
            return deleted[0];
        }
        return { id, message: "Pack config deleted" };
    }
    // ==========================================
    // 11. LINE TARGETS
    // ==========================================
    async listLineTargets(tenantId) {
        return inMemoryLineTargets;
    }
    async createLineTarget(tenantId, input) {
        const newId = `TGT-0${inMemoryLineTargets.length + 1}`;
        const newTarget = {
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
    async updateLineTarget(tenantId, id, input) {
        const idx = inMemoryLineTargets.findIndex((t) => t.id === id || t.targetId === id);
        if (idx !== -1) {
            inMemoryLineTargets[idx] = { ...inMemoryLineTargets[idx], ...input };
            return inMemoryLineTargets[idx];
        }
        return { id, ...input };
    }
    async deleteLineTarget(tenantId, id) {
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
        return inMemoryChangeoverRules;
    }
    async createChangeoverRule(tenantId, input) {
        const newId = `CO-0${inMemoryChangeoverRules.length + 1}`;
        const newRule = {
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
    async updateChangeoverRule(tenantId, id, input) {
        const idx = inMemoryChangeoverRules.findIndex((r) => r.id === id || r.ruleId === id);
        if (idx !== -1) {
            inMemoryChangeoverRules[idx] = { ...inMemoryChangeoverRules[idx], ...input };
            return inMemoryChangeoverRules[idx];
        }
        return { id, ...input };
    }
    async deleteChangeoverRule(tenantId, id) {
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
    async listSanitationClasses(tenantId) {
        return inMemorySanitationClasses;
    }
    async createSanitationClass(tenantId, input) {
        const newId = `SAN-0${inMemorySanitationClasses.length + 1}`;
        const newSan = {
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
    async listAllergenRules(tenantId) {
        return inMemoryAllergenRules;
    }
    async createAllergenRule(tenantId, input) {
        const newId = `ALG-0${inMemoryAllergenRules.length + 1}`;
        const newAlg = {
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
    async listSkus(tenantId) {
        try {
            if (tenantId) {
                return await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId));
            }
            return await database_js_1.db.select().from(masterData_js_1.skus);
        }
        catch {
            return [];
        }
    }
    async createSku(tenantId, input) {
        const tId = tenantId || "00000000-0000-0000-0000-000000000001";
        try {
            const [newSku] = await database_js_1.db
                .insert(masterData_js_1.skus)
                .values({
                tenantId: tId,
                skuCode: input.skuCode || input.code,
                name: input.name,
                category: input.category || "BEVERAGE",
                familyId: input.familyId,
                uom: input.uom || "EA",
                barcode: input.barcode,
                standardCost: (input.standardCost || 0).toString(),
                shelfLifeDays: Number(input.shelfLifeDays) || 365,
                minStockLevel: (input.minStockLevel || 100).toString(),
                maxStockLevel: (input.maxStockLevel || 10000).toString(),
            })
                .returning();
            return newSku;
        }
        catch (err) {
            return { id: `SKU-${Date.now()}`, ...input };
        }
    }
    async listBoms(tenantId) {
        try {
            if (tenantId) {
                return await database_js_1.db.query.boms.findMany({
                    where: (0, drizzle_orm_1.eq)(masterData_js_1.boms.tenantId, tenantId),
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
            return await database_js_1.db.query.boms.findMany({
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
        catch {
            return [];
        }
    }
    async createBom(tenantId, input) {
        return { id: `BOM-${Date.now()}`, ...input, status: "Active", approvalStatus: "Approved" };
    }
    async updateBom(tenantId, id, input) {
        return { id, ...input };
    }
    async deleteBom(tenantId, id) {
        return { id, message: "BOM deleted" };
    }
    async listAssets(tenantId, plantId) {
        try {
            const tId = tenantId || "00000000-0000-0000-0000-000000000001";
            if (plantId && plantId !== "ALL") {
                return await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.assets.tenantId, tId), (0, drizzle_orm_1.eq)(masterData_js_1.assets.plantId, plantId)));
            }
            return await database_js_1.db.select().from(masterData_js_1.assets).where((0, drizzle_orm_1.eq)(masterData_js_1.assets.tenantId, tId));
        }
        catch {
            return [];
        }
    }
    async listStaff(tenantId, plantId) {
        try {
            const tId = tenantId || "00000000-0000-0000-0000-000000000001";
            if (plantId && plantId !== "ALL") {
                return await database_js_1.db.select().from(masterData_js_1.staff).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.staff.tenantId, tId), (0, drizzle_orm_1.eq)(masterData_js_1.staff.plantId, plantId)));
            }
            return await database_js_1.db.select().from(masterData_js_1.staff).where((0, drizzle_orm_1.eq)(masterData_js_1.staff.tenantId, tId));
        }
        catch {
            return [];
        }
    }
    async listQualitySpecs(tenantId) {
        try {
            const tId = tenantId || "00000000-0000-0000-0000-000000000001";
            return await database_js_1.db.select().from(masterData_js_1.qualitySpecs).where((0, drizzle_orm_1.eq)(masterData_js_1.qualitySpecs.tenantId, tId));
        }
        catch {
            return [];
        }
    }
}
exports.MasterDataService = MasterDataService;
exports.masterDataService = new MasterDataService();
//# sourceMappingURL=masterData.service.js.map