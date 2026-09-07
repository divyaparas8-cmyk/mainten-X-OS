import { db } from "../../config/database.js";
import { skus, boms, bomItems, productionLines, workCenters, assets, staff, qualitySpecs } from "../../db/schema/masterData.js";
import { eq, and, sql } from "drizzle-orm";
import { CreateSkuInput, CreateBomInput } from "./masterData.schema.js";
import { NotFoundError } from "../../shared/errors/AppError.js";

export class MasterDataService {
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

  async listLines(tenantId: string, plantId?: string) {
    if (plantId) {
      return await db.select().from(productionLines).where(and(eq(productionLines.tenantId, tenantId), eq(productionLines.plantId, plantId)));
    }
    return await db.select().from(productionLines).where(eq(productionLines.tenantId, tenantId));
  }

  async listWorkCenters(tenantId: string, plantId?: string) {
    if (plantId) {
      return await db.select().from(workCenters).where(and(eq(workCenters.tenantId, tenantId), eq(workCenters.plantId, plantId)));
    }
    return await db.select().from(workCenters).where(eq(workCenters.tenantId, tenantId));
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
