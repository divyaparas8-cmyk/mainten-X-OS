const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../db/schema/masterData.ts');
let content = fs.readFileSync(filePath, 'utf8');

const spec2 = `export const qualitySpecs = pgTable("quality_specs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "cascade" }),
  specId: varchar("spec_id", { length: 50 }).unique(),
  specificationTitle: varchar("specification_title", { length: 255 }),
  skuCode: varchar("sku_code", { length: 50 }),
  skuName: varchar("sku_name", { length: 255 }),
  parameter: varchar("parameter", { length: 255 }),
  parameterName: varchar("parameter_name", { length: 150 }),
  target: varchar("target", { length: 50 }),
  targetValue: numeric("target_value", { precision: 10, scale: 3 }),
  min: varchar("min", { length: 50 }),
  minTolerance: numeric("min_tolerance", { precision: 10, scale: 3 }),
  max: varchar("max", { length: 50 }),
  maxTolerance: numeric("max_tolerance", { precision: 10, scale: 3 }),
  uom: varchar("uom", { length: 50 }).notNull(),
  criticality: varchar("criticality", { length: 100 }),
  isCCP: boolean("is_ccp").default(false),
  criticalLimit: varchar("critical_limit", { length: 255 }),
  testMethod: varchar("test_method", { length: 255 }),
  approvalStatus: varchar("approval_status", { length: 50 }).default("Draft"),
  revision: varchar("revision", { length: 50 }).default("Rev 1.0"),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});`;

const spec1Regex = /export const qualitySpecs = pgTable\("quality_specs", \{[\s\S]*?\}\);/;
content = content.replace(spec1Regex, spec2);

// Now find the second occurrence of `export const qualitySpecs` up to `export const ccpLimits`
const duplicateIdx = content.indexOf('export const qualitySpecs', 1000);
const ccpIdx = content.indexOf('export const ccpLimits');

if (duplicateIdx !== -1 && ccpIdx !== -1 && duplicateIdx < ccpIdx) {
  content = content.slice(0, duplicateIdx) + content.slice(ccpIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed masterData.ts successfully!');
} else {
  console.error('Could not find duplicate block boundaries:', { duplicateIdx, ccpIdx });
}
