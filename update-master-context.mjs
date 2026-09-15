import { readFileSync, writeFileSync } from 'fs';

const filePath = 'd:/kiaan/MaintenX-OS/frontend/src/context/MasterDataContext.jsx';
let content = readFileSync(filePath, 'utf8');

// 1. Replace from export const INITIAL_COMPANIES = [ down to the end of INITIAL_AUDIT_LOGS before export const INITIAL_ROLE_PERMISSIONS
const startIndex = content.indexOf('export const INITIAL_COMPANIES = [');
const endIndex = content.indexOf('export const INITIAL_ROLE_PERMISSIONS = {');

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find delimiters for INITIAL mock data!");
  process.exit(1);
}

const emptyInitialData = `export const INITIAL_COMPANIES = [];
export const INITIAL_PLANTS = [];
export const INITIAL_DEPARTMENTS = [];
export const INITIAL_WORK_CENTERS = [];
export const INITIAL_PRODUCT_FAMILIES = [];
export const INITIAL_UOMS = [];
export const INITIAL_SKUS = [];
export const INITIAL_PACK_CONFIGS = [];
export const INITIAL_SHELF_LIFE = [];
export const INITIAL_CUSTOMERS = [];
export const INITIAL_CUSTOMER_SKU_MAPPINGS = [];
export const INITIAL_BOMS = [];
export const INITIAL_OPERATIONS = [];
export const INITIAL_ROUTINGS = [];
export const INITIAL_LINES = [];
export const INITIAL_LINE_TARGETS = [];
export const INITIAL_CHANGEOVER_MATRIX = [];
export const INITIAL_SANITATION_CLASSES = [];
export const INITIAL_ALLERGEN_RULES = [];
export const INITIAL_LABOUR_STANDARDS = [];
export const INITIAL_ASSETS = [];
export const INITIAL_EMPLOYEES = [];
export const INITIAL_TRAINING_RECORDS = [];
export const INITIAL_QUALITY_SPECS = [];
export const INITIAL_STORAGE_RESOURCES = [];
export const INITIAL_USERS = [];
export const INITIAL_USER_INVITATIONS = [];
export const INITIAL_AUDIT_LOGS = [];\n\n`;

content = content.substring(0, startIndex) + emptyInitialData + content.substring(endIndex);

// 2. Fix compArr check: if (compArr && compArr.length > 0) setCompanies(compArr);
content = content.replace(
  'if (compArr && compArr.length > 0) setCompanies(compArr);',
  'if (compArr) setCompanies(compArr);'
);

// 3. Fix skuArr check: if (skuArr && skuArr.length > 0) setSkus(skuArr);
content = content.replace(
  'if (skuArr && skuArr.length > 0) setSkus(skuArr);',
  'if (skuArr) setSkus(skuArr);'
);

// 4. Add one-time cache cleaner inside MasterDataProvider
const providerAnchor = 'export function MasterDataProvider({ children }) {';
const cleanerCode = `export function MasterDataProvider({ children }) {
  // Purge old cached mock/dummy data once so DB truth is displayed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cleaned = localStorage.getItem("mx_db_live_v3");
      if (!cleaned) {
        const dummyKeys = [
          "mx_master_companies", "mx_master_plants", "mx_master_departments",
          "mx_master_workcenters", "mx_master_families", "mx_master_uoms",
          "mx_master_skus", "mx_master_pack_configs", "mx_master_shelflife",
          "mx_master_csm", "mx_master_boms", "mx_master_operations",
          "mx_master_routings", "mx_master_lines", "mx_master_line_targets",
          "mx_master_changeovers", "mx_master_sanitation", "mx_master_allergens",
          "mx_master_labour_standards", "mx_master_assets", "mx_master_employees",
          "mx_master_training", "mx_master_quality_specs", "mx_master_storage"
        ];
        dummyKeys.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem("mx_db_live_v3", "true");
      }
    }
  }, []);`;

content = content.replace(providerAnchor, cleanerCode);

writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated MasterDataContext.jsx!");
