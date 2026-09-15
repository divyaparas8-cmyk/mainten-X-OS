const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '..', 'src', 'modules', 'master-data', 'masterData.service.ts');
const lines = fs.readFileSync(targetFile, 'utf8').split('\n');

// Keep lines 0 to 5048 (up to line 5049 which is the end of deleteLabourStandard)
const keptLines = lines.slice(0, 5049);

const additionalMethods = `
  // ==========================================
  // ASSET TYPES & CATEGORIES
  // ==========================================
  async listAssetTypes(tenantId?: string) {
    try {
      const res = await db.execute(sql\`
        SELECT id, name, code, description, created_at 
        FROM public.asset_types 
        ORDER BY name ASC
      \`);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      return rows.map((r: any) => ({
        id: String(r.id),
        name: r.name,
        code: r.code || "",
        description: r.description || "",
        createdAt: r.created_at
      }));
    } catch (e: any) {
      console.warn("DB listAssetTypes error:", e.message);
      return [];
    }
  }

  async createAssetType(tenantId: string | undefined, input: any) {
    try {
      const name = String(input.name || "").trim();
      if (!name) {
        throw new Error("Asset type name is required");
      }
      const code = (input.code || name.replace(/[^A-Z0-9]/gi, "").substring(0, 8)).toUpperCase();
      const description = input.description || "";
      const res = await db.execute(sql\`
        INSERT INTO public.asset_types (name, code, description, created_at, updated_at)
        VALUES (\${name}, \${code}, \${description}, NOW(), NOW())
        ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW()
        RETURNING *
      \`);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      return {
        id: String(row?.id || ""),
        name: row?.name || name,
        code: row?.code || code,
        description: row?.description || description,
        createdAt: row?.created_at || new Date().toISOString()
      };
    } catch (err: any) {
      console.warn("DB createAssetType error:", err.message);
      throw err;
    }
  }

  async deleteAssetType(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql\`DELETE FROM public.asset_types WHERE id::text = \${id} OR code = \${id} OR name = \${id}\`);
      return { id, message: "Asset type deleted successfully" };
    } catch (err: any) {
      console.warn("DB deleteAssetType error:", err.message);
      throw err;
    }
  }

  // ==========================================
  // CRITICALITY RATINGS
  // ==========================================
  async listCriticalityLevels(tenantId?: string) {
    try {
      const res = await db.execute(sql\`
        SELECT id, name, code, description, created_at 
        FROM public.criticality_levels 
        ORDER BY name ASC
      \`);
      const rows = (res as any)?.rows || (Array.isArray(res) ? res : []);
      return rows.map((r: any) => ({
        id: String(r.id),
        name: r.name,
        code: r.code || "",
        description: r.description || "",
        createdAt: r.created_at
      }));
    } catch (e: any) {
      console.warn("DB listCriticalityLevels error:", e.message);
      return [];
    }
  }

  async createCriticalityLevel(tenantId: string | undefined, input: any) {
    try {
      const name = String(input.name || "").trim();
      if (!name) {
        throw new Error("Criticality name is required");
      }
      const code = (input.code || name.replace(/[^A-Z0-9]/gi, "").substring(0, 8)).toUpperCase();
      const description = input.description || "";
      const res = await db.execute(sql\`
        INSERT INTO public.criticality_levels (name, code, description, created_at, updated_at)
        VALUES (\${name}, \${code}, \${description}, NOW(), NOW())
        ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW()
        RETURNING *
      \`);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      return {
        id: String(row?.id || ""),
        name: row?.name || name,
        code: row?.code || code,
        description: row?.description || description,
        createdAt: row?.created_at || new Date().toISOString()
      };
    } catch (err: any) {
      console.warn("DB createCriticalityLevel error:", err.message);
      throw err;
    }
  }

  async deleteCriticalityLevel(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql\`DELETE FROM public.criticality_levels WHERE id::text = \${id} OR code = \${id} OR name = \${id}\`);
      return { id, message: "Criticality level deleted successfully" };
    } catch (err: any) {
      console.warn("DB deleteCriticalityLevel error:", err.message);
      throw err;
    }
  }

  // ==========================================
  // STAFF & OPERATOR MANAGEMENT
  // ==========================================
  async createStaff(tenantId: string | undefined, input: any) {
    try {
      let resolvedTenantId = tenantId;
      if (!resolvedTenantId) {
        const [t] = await db.select({ id: tenants.id }).from(tenants).limit(1);
        resolvedTenantId = t?.id;
      }

      let code = input.employeeCode || input.employeeId;
      const isAutoFormat = !code || code.startsWith("EMP-00") || code.startsWith("EMP-");
      if (isAutoFormat) {
        const existingRes = await db.execute(sql\`SELECT employee_code FROM public.staff\`);
        const rows = ((existingRes as any)?.rows || (Array.isArray(existingRes) ? existingRes : []));
        let maxNum = 0;
        for (const r of rows) {
          const match = String(r.employee_code || "").match(/^EMP-(\\d+)$/i);
          if (match) {
            const n = parseInt(match[1], 10);
            if (n > maxNum) maxNum = n;
          }
        }
        code = \`EMP-\${String(maxNum + 1).padStart(3, '0')}\`;
      } else {
        code = String(code).trim().toUpperCase();
      }

      const name = String(input.name || "Staff Member").trim();
      const designation = input.designation || input.role || "Shift Supervisor";
      const role = input.role || designation;
      const department = input.department || "Production";
      const skillLevel = input.skillLevel || "Level 2 (Autonomous Operator)";
      const email = input.email || \`\${name.toLowerCase().replace(/\\s+/g, ".")}@flowstate.io\`;
      const phone = input.phone || "";
      let plantId = (input.plantId && input.plantId.length === 36 && input.plantId.includes("-")) ? input.plantId : null;
      if (!plantId) {
        const [p] = await db.select({ id: plants.id }).from(plants).limit(1);
        plantId = p?.id || null;
      }

      const res = await db.execute(sql\`
        INSERT INTO public.staff (
          tenant_id, plant_id, employee_code, name, designation, role,
          department, skill_level, email, phone, status, certifications, assigned_lines, created_at, updated_at
        ) VALUES (
          \${resolvedTenantId || null}, \${plantId}, \${code}, \${name}, \${designation}, \${role},
          \${department}, \${skillLevel}, \${email}, \${phone}, \${input.status || "ACTIVE"},
          \${JSON.stringify(input.certifications || [])}, \${JSON.stringify(input.assignedLines || [])},
          NOW(), NOW()
        )
        RETURNING *
      \`);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      return {
        id: String(row?.id || ""),
        employeeCode: row?.employee_code || code,
        name: row?.name || name,
        designation: row?.designation || designation,
        role: row?.role || role,
        department: row?.department || department,
        skillLevel: row?.skill_level || skillLevel,
        email: row?.email || email,
        phone: row?.phone || phone,
        status: row?.status || "ACTIVE",
        createdAt: row?.created_at || new Date().toISOString()
      };
    } catch (err: any) {
      console.warn("DB createStaff error:", err.message);
      throw err;
    }
  }

  async updateStaff(tenantId: string | undefined, id: string, input: any) {
    try {
      const name = input.name !== undefined ? String(input.name).trim() : null;
      const designation = input.designation !== undefined ? String(input.designation).trim() : null;
      const role = input.role !== undefined ? String(input.role).trim() : null;
      const department = input.department !== undefined ? String(input.department).trim() : null;
      const skillLevel = input.skillLevel !== undefined ? String(input.skillLevel).trim() : null;
      const email = input.email !== undefined ? String(input.email).trim() : null;
      const phone = input.phone !== undefined ? String(input.phone).trim() : null;
      const status = input.status !== undefined ? String(input.status).trim() : null;
      const employeeCode = input.employeeCode !== undefined ? String(input.employeeCode).trim() : null;

      const res = await db.execute(sql\`
        UPDATE public.staff
        SET
          name = COALESCE(\${name}, name),
          employee_code = COALESCE(\${employeeCode}, employee_code),
          designation = COALESCE(\${designation}, designation),
          role = COALESCE(\${role}, role),
          department = COALESCE(\${department}, department),
          skill_level = COALESCE(\${skillLevel}, skill_level),
          email = COALESCE(\${email}, email),
          phone = COALESCE(\${phone}, phone),
          status = COALESCE(\${status}, status),
          updated_at = NOW()
        WHERE id::text = \${id} OR employee_code = \${id}
        RETURNING *
      \`);
      const row = (res as any)?.rows?.[0] || (Array.isArray(res) ? res[0] : null);
      return {
        id: String(row?.id || id),
        name: row?.name || input.name,
        employeeCode: row?.employee_code || input.employeeCode,
        designation: row?.designation || input.designation,
        role: row?.role || input.role,
        department: row?.department || input.department,
        skillLevel: row?.skill_level || input.skillLevel,
        email: row?.email || input.email,
        phone: row?.phone || input.phone,
        status: row?.status || input.status,
        updatedAt: row?.updated_at || new Date().toISOString()
      };
    } catch (err: any) {
      console.warn("DB updateStaff error:", err.message);
      throw err;
    }
  }

  async deleteStaff(tenantId: string | undefined, id: string) {
    try {
      await db.execute(sql\`DELETE FROM public.staff WHERE id::text = \${id} OR employee_code = \${id}\`);
      return { id, message: "Staff member removed successfully" };
    } catch (err: any) {
      console.warn("DB deleteStaff error:", err.message);
      throw err;
    }
  }
}

export const masterDataService = new MasterDataService();
`;

const finalContent = keptLines.join('\n') + '\n' + additionalMethods;
fs.writeFileSync(targetFile, finalContent);
console.log('Cleaned masterData.service.ts successfully! Total lines:', finalContent.split('\n').length);
