import { db } from "../../config/database.js";
import { workOrders, pmSchedules, spareParts, spareConsumption, failureCodes, calibrations } from "../../db/schema/maintenance.js";
import { assets, productionLines } from "../../db/schema/masterData.js";
import { eq, and, sql } from "drizzle-orm";
import { CreateWorkOrderInput, UpdateWorkOrderStatusInput } from "./maintenance.schema.js";
import { NotFoundError } from "../../shared/errors/AppError.js";
import { calculateReliability } from "../../shared/engines/mtbfEngine.js";

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

    const [wo] = await db
      .insert(workOrders)
      .values({
        tenantId,
        plantId,
        woNumber,
        assetId: input.assetId,
        title: input.title,
        description: input.description,
        type: input.type,
        priority: input.priority,
        assignedTo: input.assignedTo,
        reportedBy: userId,
        failureCodeId: input.failureCodeId,
        estimatedHours: input.estimatedHours.toString(),
        scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : new Date(),
      })
      .returning();

    return wo;
  }

  async updateWorkOrderStatus(tenantId: string, id: string, input: UpdateWorkOrderStatusInput) {
    const [wo] = await db.select().from(workOrders).where(and(eq(workOrders.tenantId, tenantId), eq(workOrders.id, id)));
    if (!wo) throw new NotFoundError("Work Order");

    const [updated] = await db
      .update(workOrders)
      .set({
        status: input.status,
        ...(input.actualHours !== undefined ? { actualHours: input.actualHours.toString() } : {}),
        ...(input.status === "COMPLETED" || input.status === "CLOSED" ? { completedAt: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(workOrders.id, id))
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
