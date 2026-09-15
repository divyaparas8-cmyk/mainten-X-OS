const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '..', 'src', 'modules', 'master-data', 'masterData.service.ts');
let raw = fs.readFileSync(targetFile, 'utf8');

const lines = raw.split(/\r?\n/);
let cutIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const newStandard: any = {')) {
    cutIndex = i;
  }
}

console.log('Found last newStandard at line:', cutIndex);

const keptLines = lines.slice(0, cutIndex);

const correctEnding = `    const newStandard: any = {
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
      costStr = raw.startsWith("$") ? raw : \`$\${raw}\`;
    }

    try {
      await db.execute(sql\`
        UPDATE public.labour_standards
        SET
          line_id = COALESCE(\${input.lineId || null}, line_id),
          line_name = COALESCE(\${input.lineName || null}, line_name),
          standard_crew = COALESCE(\${input.standardCrew !== undefined ? Number(input.standardCrew) : null}, standard_crew),
          std_labor_hours_per_1k_units = COALESCE(\${input.stdLaborHoursPer1kUnits !== undefined ? Number(input.stdLaborHoursPer1kUnits) : null}, std_labor_hours_per_1k_units),
          direct_cost_per_hour = COALESCE(\${costStr || null}, direct_cost_per_hour),
          status = COALESCE(\${input.status || null}, status),
          updated_at = NOW()
        WHERE id::text = \${id} OR standard_id = \${id} OR lower(standard_id) = lower(\${id})
      \`);
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
      await db.execute(sql\`DELETE FROM public.labour_standards WHERE id::text = \${id} OR standard_id = \${id} OR lower(standard_id) = lower(\${id})\`);
    } catch (err: any) {
      console.warn("DB deleteLabourStandard error:", err.message);
    }
    const sidx = inMemoryLabourStandards.findIndex(s => s.id === id || s.standardId === id);
    if (sidx !== -1) {
      inMemoryLabourStandards.splice(sidx, 1);
    }
    return { success: true };
  }
}

export const masterDataService = new MasterDataService();
`;

keptLines.push(correctEnding);
fs.writeFileSync(targetFile, keptLines.join('\n'));
console.log('Successfully written complete ending');
