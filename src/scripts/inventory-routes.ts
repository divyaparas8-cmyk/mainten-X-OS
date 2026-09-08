import fs from "fs";
import path from "path";

function scanRoutes() {
  const appPath = path.resolve("../frontend/src/App.jsx");
  const content = fs.readFileSync(appPath, "utf-8");

  // Match both direct element and RoleProtectedRoute wrapped element
  const routeRegex = /<Route\s+path=["']([^"']+)["']\s+element=\{([\s\S]*?)\}\s*\/>/g;
  const routes: { path: string; component: string }[] = [];

  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const routePath = match[1];
    const elementStr = match[2];
    let compMatch = elementStr.match(/<([A-Z][a-zA-Z0-9]+)/g);
    let comp = "Unknown";
    if (compMatch) {
      // If wrapped in RoleProtectedRoute, get the last component
      const validComps = compMatch.map(c => c.replace("<", "")).filter(c => c !== "RoleProtectedRoute" && c !== "Navigate");
      comp = validComps.length > 0 ? validComps[validComps.length - 1] : compMatch[0].replace("<", "");
    }
    routes.push({ path: routePath, component: comp });
  }

  console.log(`Total Routes Found in App.jsx: ${routes.length}`);
  
  // Categorize by top-level section
  const categories: Record<string, typeof routes> = {};
  for (const r of routes) {
    const parts = r.path.split("/").filter(Boolean);
    const cat = parts[0] || "root";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(r);
  }

  for (const [cat, items] of Object.entries(categories)) {
    console.log(`\n=== Section: /${cat} (${items.length} routes) ===`);
    items.forEach(i => console.log(`  ${i.path} ➔ <${i.component} />`));
  }

  fs.writeFileSync("src/scripts/routes-inventory.json", JSON.stringify(routes, null, 2));
  console.log("\nSaved routes inventory to src/scripts/routes-inventory.json");
}

scanRoutes();
