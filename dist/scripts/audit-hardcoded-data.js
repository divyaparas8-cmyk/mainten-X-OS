"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findInFiles(dir, regex, extensions = [".js", ".jsx", ".ts", ".tsx"]) {
    const results = [];
    function walk(currentDir) {
        const entries = fs_1.default.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path_1.default.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name !== "node_modules" && entry.name !== ".git" && entry.name !== "dist") {
                    walk(fullPath);
                }
            }
            else if (entry.isFile()) {
                const ext = path_1.default.extname(entry.name);
                if (extensions.includes(ext)) {
                    const content = fs_1.default.readFileSync(fullPath, "utf-8");
                    const lines = content.split("\n");
                    lines.forEach((line, idx) => {
                        if (regex.test(line)) {
                            results.push({
                                file: path_1.default.relative(path_1.default.resolve(".."), fullPath),
                                line: idx + 1,
                                text: line.trim(),
                            });
                        }
                    });
                }
            }
        }
    }
    walk(dir);
    return results;
}
async function auditHardcodedAndMocks() {
    console.log("=== SCANNING FOR HARDCODED TENANT/PLANT/USER IDENTIFIERS ===");
    const hardcodedUuids = findInFiles(path_1.default.resolve("../"), /(?:00000000-0000-0000-0000-000000000001|PLT-01|USR-001|default-plant)/i);
    console.log(`Found ${hardcodedUuids.length} occurrences of legacy dummy identifiers:`);
    hardcodedUuids.forEach(h => console.log(`  ${h.file}:${h.line} -> ${h.text}`));
    console.log("\n=== SCANNING FRONTEND SERVICES FOR RAW MOCK RETURNS ===");
    const serviceFiles = fs_1.default.readdirSync(path_1.default.resolve("../frontend/src/services")).filter(f => f.endsWith(".js"));
    console.log(`Auditing ${serviceFiles.length} frontend service files...`);
    for (const sf of serviceFiles) {
        const content = fs_1.default.readFileSync(path_1.default.resolve("../frontend/src/services", sf), "utf-8");
        const hasApiClient = content.includes("apiClient");
        const hasRawMocks = /return\s+\[\s*\{|return\s+MOCK_|return\s+INITIAL_/i.test(content);
        console.log(`  Service: ${sf.padEnd(25)} | Uses apiClient: ${hasApiClient ? "YES" : "NO "} | Has hardcoded return: ${hasRawMocks ? "DETECTED" : "CLEAN"}`);
    }
    console.log("\n=== SCANNING FRONTEND DATA DIRECTORY ===");
    const dataDir = path_1.default.resolve("../frontend/src/data");
    if (fs_1.default.existsSync(dataDir)) {
        const dataFiles = fs_1.default.readdirSync(dataDir);
        console.log(`Found ${dataFiles.length} files in frontend/src/data/:`);
        dataFiles.forEach(df => console.log(`  - ${df}`));
    }
    console.log("\n=== SCANNING CONTEXT PROVIDERS FOR MOCK DATA / PERSISTENCE ===");
    const contextDir = path_1.default.resolve("../frontend/src/context");
    if (fs_1.default.existsSync(contextDir)) {
        const contextFiles = fs_1.default.readdirSync(contextDir).filter(f => f.endsWith(".jsx") || f.endsWith(".js"));
        for (const cf of contextFiles) {
            const content = fs_1.default.readFileSync(path_1.default.resolve(contextDir, cf), "utf-8");
            const usesBackend = /Service\.(get|list|fetch|create|record)/i.test(content);
            const usesLocalStorage = /localStorage\.(getItem|setItem)/i.test(content);
            const importsMock = /from\s+["'].*mock.*["']/i.test(content);
            console.log(`  Context: ${cf.padEnd(25)} | Connects Backend: ${usesBackend ? "YES" : "NO "} | LocalStorage: ${usesLocalStorage ? "YES" : "NO "} | Imports Mock: ${importsMock ? "YES" : "NO "}`);
        }
    }
}
auditHardcodedAndMocks();
//# sourceMappingURL=audit-hardcoded-data.js.map