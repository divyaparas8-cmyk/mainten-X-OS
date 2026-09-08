import fs from "fs";
import path from "path";

function findInFiles(dir: string, regex: RegExp, extensions = [".js", ".jsx", ".ts", ".tsx"]): { file: string; line: number; text: string }[] {
  const results: { file: string; line: number; text: string }[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== ".git" && entry.name !== "dist") {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const lines = content.split("\n");
          lines.forEach((line, idx) => {
            if (regex.test(line)) {
              results.push({
                file: path.relative(path.resolve(".."), fullPath),
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
  const hardcodedUuids = findInFiles(
    path.resolve("../"),
    /(?:00000000-0000-0000-0000-000000000001|PLT-01|USR-001|default-plant)/i
  );
  console.log(`Found ${hardcodedUuids.length} occurrences of legacy dummy identifiers:`);
  hardcodedUuids.forEach(h => console.log(`  ${h.file}:${h.line} -> ${h.text}`));

  console.log("\n=== SCANNING FRONTEND SERVICES FOR RAW MOCK RETURNS ===");
  const serviceFiles = fs.readdirSync(path.resolve("../frontend/src/services")).filter(f => f.endsWith(".js"));
  console.log(`Auditing ${serviceFiles.length} frontend service files...`);

  for (const sf of serviceFiles) {
    const content = fs.readFileSync(path.resolve("../frontend/src/services", sf), "utf-8");
    const hasApiClient = content.includes("apiClient");
    const hasRawMocks = /return\s+\[\s*\{|return\s+MOCK_|return\s+INITIAL_/i.test(content);
    console.log(`  Service: ${sf.padEnd(25)} | Uses apiClient: ${hasApiClient ? "YES" : "NO "} | Has hardcoded return: ${hasRawMocks ? "DETECTED" : "CLEAN"}`);
  }

  console.log("\n=== SCANNING FRONTEND DATA DIRECTORY ===");
  const dataDir = path.resolve("../frontend/src/data");
  if (fs.existsSync(dataDir)) {
    const dataFiles = fs.readdirSync(dataDir);
    console.log(`Found ${dataFiles.length} files in frontend/src/data/:`);
    dataFiles.forEach(df => console.log(`  - ${df}`));
  }

  console.log("\n=== SCANNING CONTEXT PROVIDERS FOR MOCK DATA / PERSISTENCE ===");
  const contextDir = path.resolve("../frontend/src/context");
  if (fs.existsSync(contextDir)) {
    const contextFiles = fs.readdirSync(contextDir).filter(f => f.endsWith(".jsx") || f.endsWith(".js"));
    for (const cf of contextFiles) {
      const content = fs.readFileSync(path.resolve(contextDir, cf), "utf-8");
      const usesBackend = /Service\.(get|list|fetch|create|record)/i.test(content);
      const usesLocalStorage = /localStorage\.(getItem|setItem)/i.test(content);
      const importsMock = /from\s+["'].*mock.*["']/i.test(content);
      console.log(`  Context: ${cf.padEnd(25)} | Connects Backend: ${usesBackend ? "YES" : "NO "} | LocalStorage: ${usesLocalStorage ? "YES" : "NO "} | Imports Mock: ${importsMock ? "YES" : "NO "}`);
    }
  }
}

auditHardcodedAndMocks();
