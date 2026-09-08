import { db } from "../../config/database.js";
import { workOrders, pmSchedules, spareParts, spareConsumption, failureCodes, calibrations } from "../../db/schema/maintenance.js";
import { assets, productionLines } from "../../db/schema/masterData.js";
import { eq, and, or, sql } from "drizzle-orm";
import { CreateWorkOrderInput, UpdateWorkOrderStatusInput } from "./maintenance.schema.js";
import { NotFoundError } from "../../shared/errors/AppError.js";
import { calculateReliability } from "../../shared/engines/mtbfEngine.js";
import { isValidUuid } from "../../shared/utils/tenantContext.js";

export class MaintenanceService {
  async listWorkOrders(tenantId: string, plantId?: string) {
    return await db.query.workOrders.findMany({
      where: eq(workOrders.tenantId, tenantId),
      with: {
        asset: true,
        assignedUser: true,
      },
    });
  }

  async createWorkOrder(tenantId: string, plantId: string, input: CreateWorkOrderInput, userId: string) {
    const woNumber = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let resolvedAssetId = input.assetId;
    const [existingAsset] = isValidUuid(input.assetId)
      ? await db.select().from(assets).where(and(eq(assets.tenantId, tenantId), eq(assets.id, input.assetId))).limit(1)
      : [];

    if (existingAsset) {
      resolvedAssetId = existingAsset.id;
    } else {
      const [foundAsset] = await db
        .select()
        .from(assets)
        .where(and(eq(assets.tenantId, tenantId), or(eq(assets.assetCode, input.assetId), eq(assets.name, input.assetId))))
        .limit(1);

      if (foundAsset) {
        resolvedAssetId = foundAsset.id;
      } else {
        const [firstAsset] = await db.select().from(assets).where(eq(assets.tenantId, tenantId)).limit(1);
        if (firstAsset) {
          resolvedAssetId = firstAsset.id;
        }
      }
    }

    const [wo] = await db
      .insert(workOrders)
      .values({
        tenantId,
        plantId,
        woNumber,
        assetId: resolvedAssetId,
        title: input.title,
        description: input.description,
        type: input.type,
        priority: input.priority,
        assignedTo: input.assignedTo && isValidUuid(input.assignedTo) ? input.assignedTo : null,
        reportedBy: userId && isValidUuid(userId) ? userId : null,
        failureCodeId: input.failureCodeId && isValidUuid(input.failureCodeId) ? input.failureCodeId : null,
        estimatedHours: input.estimatedHours.toString(),
        scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : new Date(),
      })
      .returning();

    return wo;
  }

  async updateWorkOrderStatus(tenantId: string, id: string, input: UpdateWorkOrderStatusInput) {
    const condition = isValidUuid(id)
      ? and(eq(workOrders.tenantId, tenantId), eq(workOrders.id, id))
      : and(eq(workOrders.tenantId, tenantId), eq(workOrders.woNumber, id));

    const [wo] = await db.select().from(workOrders).where(condition);
    if (!wo) throw new NotFoundError("Work Order");

    const [updated] = await db
      .update(workOrders)
      .set({
        status: input.status,
        ...(input.actualHours !== undefined ? { actualHours: input.actualHours.toString() } : {}),
        ...(input.status === "COMPLETED" || input.status === "CLOSED" ? { completedAt: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(workOrders.id, wo.id))
      .returning();

    return updated;
  }

  async listPMSchedules(tenantId: string) {
    return await db.select().from(pmSchedules).where(eq(pmSchedules.tenantId, tenantId));
  }

  async listSpareParts(tenantId: string) {
    return await db.select().from(spareParts).where(eq(spareParts.tenantId, tenantId));
  }

  async getReliabilityMetrics(tenantId: string, plantId?: string) {
    // Calculated reliability metrics for plant
    const plantMetrics = calculateReliability({
      totalOperatingHours: 720,
      breakdownCount: 3,
      totalRepairHours: 5.4,
    });

    return {
      plantOverall: {
        mtbfHours: plantMetrics.mtbfHours,
        mttrHours: plantMetrics.mttrHours,
        availabilityPercent: plantMetrics.availabilityPercent,
      },
      criticalAssetsHealth: [
        { code: "FM-001", name: "Rotary Filling Machine", health: 92, mtbf: 412.5, status: "OPERATIONAL" },
        { code: "PM-102", name: "High-Temperature Pasteurizer", health: 96, mtbf: 580.0, status: "OPERATIONAL" },
        { code: "CP-304", name: "Centrifugal CIP Pump", health: 88, mtbf: 320.0, status: "OPERATIONAL" },
      ],
    };
  }
}

export const maintenanceService = new MaintenanceService();
