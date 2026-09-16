export declare class DashboardsService {
    getLineLeadDashboard(tenantId: string): Promise<{
        kpi: {
            currentHB: {
                actual: number;
                target: number;
                paceBPM: number;
                targetPaceBPM: number;
                remainingHours: number;
            };
            eodProjection: string;
            recoveryPaceBPM: number;
        };
        staffing: {
            present: number;
            total: number;
            status: string;
        };
        nextChangeover: {
            minutesAway: number;
            toSKU: string;
        };
        downtime: {
            totalMinutes: number;
            microStopsActive: boolean;
        };
        materialAlert: {
            lotId: string;
            lowStockItem: string;
            supplyStatus: string;
        };
        qualityHolds: {
            activeBatches: number;
            lastCheckTime: string;
            lastCheckResult: string;
        };
        maintenance: {
            openWorkOrders: number;
            escalatedP1: number;
        };
    }>;
    getMaterialLog(tenantId: string): Promise<{
        lotId: string;
        lowStockAlert: {
            item: string;
            remainingMinutes: number;
            paceBPM: number;
        };
        items: {
            name: string;
            lot: string;
            qty: string;
            status: string;
        }[];
    }>;
    getQualityLog(tenantId: string): Promise<{
        activeBatchesOnHold: number;
        overallStatus: string;
        checkpoints: {
            ccp: string;
            target: string;
            actual: string;
            time: string;
            result: string;
        }[];
    }>;
    logQaSampleCheck(tenantId: string, payload: {
        lineId?: string;
        notes?: string;
    }): Promise<{
        id: string;
        lineId: string;
        result: string;
        loggedAt: string;
        message: string;
    }>;
    acknowledgeMicroStop(tenantId: string, payload: {
        lineId?: string;
        reason?: string;
    }): Promise<{
        id: string;
        lineId: string;
        type: string;
        reason: string;
        acknowledgedAt: string;
        message: string;
    }>;
    requestStockReplenishment(tenantId: string, payload: {
        item: string;
        lotId: string;
        requestedBy?: string;
    }): Promise<{
        requestId: string;
        item: string;
        lotId: string;
        requestedAt: string;
        sentTo: string;
        status: string;
        message: string;
    }>;
    proposeLineSpeedUp(tenantId: string, payload: {
        proposedBPM: number;
        lineId?: string;
        requestedBy?: string;
    }): Promise<{
        proposalId: string;
        lineId: string;
        proposedBPM: number;
        currentBPM: number;
        submittedAt: string;
        status: string;
        message: string;
    }>;
    getHbLogs(tenantId: string): Promise<{
        shiftDate: string;
        lineId: string;
        logs: {
            id: string;
            hour: string;
            target: number;
            actual: number;
            variance: number;
            lossDriver: string;
            status: string;
            costImpact: string;
            notes: string;
            recordedAt: string;
        }[];
        summary: {
            totalTarget: number;
            totalActual: number;
            totalVariance: number;
            passedHours: number;
            failedHours: number;
        };
    }>;
    saveHbRecord(tenantId: string, payload: {
        hour: string;
        target: number;
        actual: number;
        lossDriver?: string;
        notes?: string;
    }): Promise<{
        id: string;
        hour: string;
        target: number;
        actual: number;
        variance: number;
        lossDriver: string;
        status: string;
        costImpact: string;
        notes: string;
        message: string;
    }>;
    updateHbRecord(tenantId: string, id: string, payload: {
        hour?: string;
        target?: number;
        actual?: number;
        lossDriver?: string;
        notes?: string;
    }): Promise<{
        id: string;
        hour: string | undefined;
        target: number;
        actual: number;
        variance: number;
        lossDriver: string;
        status: string;
        costImpact: string;
        notes: string;
        message: string;
    }>;
    deleteHbRecord(tenantId: string, id: string): Promise<{
        id: string;
        message: string;
    }>;
    recalculateCatchUp(tenantId: string, payload: {
        lineId?: string;
    }): Promise<{
        lineId: string;
        currentDeficit: number;
        recommendedHourlyTarget: number;
        remainingHours: number;
        message: string;
        calculatedAt: string;
    }>;
    bulkReconcileShift(tenantId: string, payload: {
        lineId?: string;
        submittedBy?: string;
    }): Promise<{
        reconcileId: string;
        lineId: string;
        submittedBy: string;
        totalHoursReconciled: number;
        totalTarget: number;
        totalActual: number;
        totalVariance: number;
        submittedAt: string;
        status: string;
        message: string;
    }>;
    getDowntimeLogs(tenantId: string): Promise<{
        logs: {
            id: string;
            assetId: string | null;
            assetDbId: string | null;
            assetName: string;
            failureCategory: string;
            startTime: string;
            symptom: string;
            durationMinutes: number;
            status: string;
            endTime: string | null;
        }[];
        summary: {
            activeCount: number;
            resolvedCount: number;
            totalDowntimeMinutes: number;
        };
    }>;
    logBreakdown(tenantId: string, payload: {
        assetName: string;
        assetId?: string;
        failureCategory: string;
        symptom: string;
    }): Promise<{
        id: string;
        assetId: string;
        assetDbId: string;
        assetName: string;
        failureCategory: string;
        startTime: string;
        symptom: string;
        durationMinutes: number;
        status: string;
        endTime: null;
        message: string;
    }>;
    acknowledgeDowntime(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        acknowledgedAt: string;
        message: string;
    }>;
    dispatchTech(tenantId: string, id: string, payload: {
        assetName?: string;
        failureCategory?: string;
        symptom?: string;
    }): Promise<{
        workOrderId: string;
        downtimeId: string;
        assetName: string;
        title: string;
        description: string | null;
        priority: string;
        status: string;
        assignedAt: string;
        message: string;
    }>;
    resolveDowntime(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    deleteDowntimeLog(tenantId: string, id: string): Promise<{
        id: string;
        message: string;
    }>;
    private changeoverSession;
    getChangeoverStatus(tenantId: string): Promise<any>;
    startChangeover(tenantId: string, payload: {
        lineId?: string;
    }): Promise<any>;
    completeChangeoverStep(tenantId: string, stepId: string): Promise<{
        stepId: string;
        stepName: any;
        activeStep: any;
        totalSteps: any;
        message: string;
    }>;
    finishChangeover(tenantId: string, payload: {
        lineId?: string;
    }): Promise<{
        changeoverSessionId: string;
        lineId: string;
        fromSKU: any;
        toSKU: any;
        startedAt: any;
        finishedAt: string;
        status: string;
        message: string;
    }>;
    logChangeoverDelay(tenantId: string, payload: {
        exceededMins: number;
        reason: string;
        stepName?: string;
    }): Promise<{
        delayId: string;
        exceededMins: number;
        reason: string;
        stepName: string;
        loggedAt: string;
        sentTo: string;
        message: string;
    }>;
    getPlantManagerCommandCenter(tenantId: string, plantId?: string): Promise<{
        plantCode: string;
        plantStatus: string;
        hbSummary: {
            processing: {
                target: number;
                actual: number;
                variance: number;
                recoveryPace: string;
                eodProjection: number;
                status: string;
            };
            packaging: {
                target: number;
                actual: number;
                variance: number;
                recoveryPace: string;
                eodProjection: number;
                status: string;
            };
            total: {
                target: number;
                actual: number;
                netVariance: number;
                shiftPacing: string;
                eodProjection: number;
                status: string;
            };
        };
        pillars: {
            hbPacing: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            oeeScore: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            productionOutput: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            qualityYield: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            labourStaffing: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            maintenanceMtbf: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            materialStockHealth: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            scheduleRecovery: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            riskRadar: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
        };
        hourlyLedger: any[];
    }>;
    getExecutiveKPIs(plantId?: string): Promise<{
        id: string;
        title: string;
        category: string;
        current: string;
        target: string;
        variance: string;
        status: string;
        isPositive: boolean;
    }[]>;
    getStaffingRoster(tenantId: string): Promise<{
        id: number;
        name: string;
        role: string;
        station: string;
        status: string;
        cert: string;
    }[]>;
    swapStaffingStations(tenantId: string, payload: {
        op1Id: number;
        op2Id: number;
    }): Promise<{
        message: string;
        op1Id: number;
        op2Id: number;
    }>;
    requestReliefOperator(tenantId: string, payload: {
        lineId?: string;
        reason?: string;
    }): Promise<{
        message: string;
        requestedAt: string;
        status: string;
    }>;
    reassignOperatorStation(tenantId: string, id: string | number, payload: {
        newStation: string;
    }): Promise<{
        message: string;
        operatorId: string | number;
        newStation: string;
    }>;
    requestOperatorReplacement(tenantId: string, id: string | number, payload: {
        reason?: string;
    }): Promise<{
        message: string;
        operatorId: string | number;
        status: string;
    }>;
    getProductionPerformance(tenantId: string): Promise<{
        orderNumber: string;
        productName: string;
        producedQuantity: number;
        targetQuantity: number;
        currentSpeedBPM: number;
        targetSpeedBPM: number;
        hoursLeft: number;
        unit: string;
    }>;
    simulateRecoverySpeed(tenantId: string, payload: {
        remainingHours: number;
        targetOutput: number;
        actualProduced: number;
    }): Promise<{
        remainingQuantity: number;
        simulatedHours: number;
        requiredBPM: number;
        message: string;
    }>;
    applyTargetOverride(tenantId: string, payload: {
        orderNumber?: string;
        overrideTarget: number;
        calculatedRecoveryBPM: number;
        reason?: string;
    }): Promise<{
        message: string;
        overrideTarget: number;
        calculatedRecoveryBPM: number;
        reason: string;
        appliedAt: string;
    }>;
    resetTargetOverride(tenantId: string, payload: {
        orderNumber?: string;
    }): Promise<{
        message: string;
        targetQuantity: number;
    }>;
    getRecoveryStatus(tenantId: string): Promise<{
        deficitUnits: number;
        reason: string;
        countermeasures: {
            id: number;
            name: string;
            type: string;
            expectedRecovery: string;
            active: boolean;
        }[];
        logs: {
            time: string;
            countermeasure: string;
            status: string;
        }[];
    }>;
    activateCountermeasure(tenantId: string, id: string | number, payload: {
        name?: string;
    }): Promise<{
        message: string;
        id: string | number;
        name: string | undefined;
        activatedAt: string;
    }>;
    submitRecoveryProposal(tenantId: string, payload: {
        lineId?: string;
        name?: string;
        type?: string;
        projectedRecoveryUnits?: number;
    }): Promise<{
        id: string;
        message: string;
        submittedAt: string;
        status: string;
    }>;
    getEscalations(tenantId: string): Promise<{
        id: string;
        severity: string;
        title: string;
        owner: string;
        details: string;
    }[]>;
    dispatchEscalation(tenantId: string, payload: {
        targetRole: string;
        subject: string;
        details: string;
    }): Promise<{
        id: string;
        severity: string;
        title: string;
        owner: string;
        details: string;
        message: string;
    }>;
    attachEscalationEvidence(tenantId: string, id: string, payload: {
        evidenceNote: string;
    }): Promise<{
        id: string;
        evidenceNote: string;
        message: string;
    }>;
    getNotifications(tenantId: string): Promise<{
        id: number;
        type: string;
        read: boolean;
        title: string;
        msg: string;
        time: string;
    }[]>;
    markNotificationRead(tenantId: string, id: string | number): Promise<{
        message: string;
        id: string | number;
        read: boolean;
    }>;
    deleteNotification(tenantId: string, id: string | number): Promise<{
        message: string;
        id: string | number;
    }>;
    markAllNotificationsRead(tenantId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    clearAllNotifications(tenantId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    getUserProfile(tenantId: string): Promise<{
        id: string;
        name: string;
        role: string;
        email: string;
        phone: string;
        plant: string;
        shift: string;
        certifications: {
            name: string;
            desc: string;
            level: string;
        }[];
    }>;
    updateUserProfile(tenantId: string, payload: any): Promise<{
        message: string;
        profile: any;
    }>;
    getOperatorDashboard(tenantId: string): Promise<{
        activeOrder: {
            id: string;
            orderNumber: string;
            productCode: string;
            productName: string;
            status: string;
            producedQuantity: number;
            targetQuantity: number;
            targetSpeedBPM: number;
            currentSpeedBPM: number;
            activeBatchId: string;
            unit: string;
        };
        scadaTelemetry: {
            hbTarget: number;
            actualAttainment: number;
            vibration: number;
            temperature: number;
        };
        qualityMaterial: {
            brix: string;
            ph: string;
            lotId: string;
        };
    }>;
    logOperatorMicroStop(tenantId: string, payload: {
        durationMins: number;
        reason: string;
    }): Promise<{
        message: string;
        loggedAt: string;
    }>;
    updateJobStatus(tenantId: string, jobId: string, payload: {
        status: string;
    }): Promise<{
        message: string;
        jobId: string;
        status: string;
    }>;
    getOperatorJobs(tenantId: string): Promise<{
        id: string;
        orderNumber: string;
        productName: string;
        productCode: string;
        status: string;
        line: string;
        lineName: string;
        activeBatchId: string;
        batchCode: string;
        producedQuantity: number;
        targetQuantity: number;
        currentSpeedBPM: number;
        targetSpeedBPM: number;
        unit: string;
        unitName: string;
    }[]>;
    startOperatorJob(tenantId: string, jobId: string, payload: {
        assetId?: string;
        operatorPin?: string;
    }): Promise<{
        message: string;
        jobId: string;
        status: string;
    }>;
    completeOperatorJob(tenantId: string, jobId: string): Promise<{
        message: string;
        jobId: string;
        status: string;
    }>;
    getWorkInstructions(tenantId: string): Promise<{
        activeOrderNumber: string;
        productName: string;
        workInstructions: string;
        acknowledged: boolean;
    }>;
    acknowledgeWorkInstructions(tenantId: string, payload: {
        sopId?: string;
    }): Promise<{
        message: string;
        acknowledgedAt: string;
    }>;
    getProductionEntryStatus(tenantId: string): Promise<{
        activeOrderNumber: string;
        productName: string;
        producedQuantity: number;
        targetQuantity: number;
        scrapQuantity: number;
        reworkQuantity: number;
        unit: string;
        recentLogs: {
            id: string;
            time: string;
            operator: string;
            goodUnits: number;
            scrapUnits: number;
            runningTotal: number;
            notes: string;
        }[];
    }>;
    submitProductionLog(tenantId: string, payload: {
        goodUnits: number;
        scrapUnits: number;
        reworkUnits: number;
        lineId?: string;
        shiftCode?: string;
    }): Promise<{
        goodUnits: number;
        scrapUnits: number;
        reworkUnits: number;
        message: string;
    }>;
    logScrapDefect(tenantId: string, payload: {
        defectCode: string;
        scrapAdd: number;
        notes?: string;
    }): Promise<{
        defectCode: string;
        scrapAdd: number;
        message: string;
    }>;
    getOperatorDowntime(tenantId: string): Promise<{
        id: string;
        assetId: string;
        assetName: string;
        failureCategory: string;
        startTime: string;
    }[]>;
    logOperatorDowntimeEvent(tenantId: string, payload: {
        assetId: string;
        category: string;
        duration: number;
        symptom: string;
    }): Promise<{
        id: string;
        assetId: string;
        category: string;
        duration: number;
        message: string;
    }>;
    logOperatorDowntimeMicroStop(tenantId: string, payload: {
        microMins: number;
        microReason: string;
    }): Promise<{
        message: string;
        loggedAt: string;
    }>;
    getOperatorQualityChecks(tenantId: string): Promise<{
        time: string;
        brix: string;
        ph: string;
        torque: string;
        seal: string;
    }[]>;
    submitQualityChecklist(tenantId: string, payload: {
        brix: string;
        ph: string;
        torque: string;
        sealPassed: boolean;
    }): Promise<{
        time: string;
        result: string;
        message: string;
    }>;
    triggerQualityHold(tenantId: string, payload: {
        ccpParameter: string;
        holdReason: string;
    }): Promise<{
        ticketId: string;
        ccpParameter: string;
        message: string;
    }>;
    getOperatorMaterialRequests(tenantId: string): Promise<{
        id: string;
        sku: string;
        qty: number;
        priority: string;
        status: string;
        time: string;
    }[]>;
    callWarehouseRunner(tenantId: string, payload: {
        lineId?: string;
    }): Promise<{
        message: string;
        calledAt: string;
    }>;
    submitMaterialRequisition(tenantId: string, payload: {
        sku: string;
        qty: number;
        priority: string;
    }): Promise<{
        id: string;
        sku: string;
        qty: number;
        priority: string;
        status: string;
        time: string;
        message: string;
    }>;
    confirmMaterialReceipt(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    getBarcodeScanStatus(tenantId: string): Promise<{
        status: string;
        supportedStandards: string[];
        cameraReady: boolean;
        lastScanAt: string;
    }>;
    parseBarcode(tenantId: string, payload: {
        code: string;
        type?: string;
    }): Promise<{
        type: string;
        id: string;
        item: string;
        supplier: string;
        expiryDate: string;
        qaStatus: string;
        allergenFree: string;
        producedDate?: undefined;
        quantity?: undefined;
        storageBin?: undefined;
        lastPMDate?: undefined;
        nextPMDueDate?: undefined;
        safetyTagStatus?: undefined;
        assetHealth?: undefined;
    } | {
        type: string;
        id: string;
        item: string;
        producedDate: string;
        quantity: string;
        qaStatus: string;
        storageBin: string;
        supplier?: undefined;
        expiryDate?: undefined;
        allergenFree?: undefined;
        lastPMDate?: undefined;
        nextPMDueDate?: undefined;
        safetyTagStatus?: undefined;
        assetHealth?: undefined;
    } | {
        type: string;
        id: string;
        item: string;
        lastPMDate: string;
        nextPMDueDate: string;
        safetyTagStatus: string;
        assetHealth: string;
        supplier?: undefined;
        expiryDate?: undefined;
        qaStatus?: undefined;
        allergenFree?: undefined;
        producedDate?: undefined;
        quantity?: undefined;
        storageBin?: undefined;
    }>;
    attachLotToBatch(tenantId: string, payload: {
        lotId: string;
        batchId: string;
    }): Promise<{
        lotId: string;
        batchId: string;
        message: string;
    }>;
    getReportIssueStatus(tenantId: string): Promise<{
        status: string;
        activeHazards: number;
        categories: string[];
        updatedAt: string;
    }>;
    submitReportIssue(tenantId: string, payload: {
        issueType: string;
        assetId: string;
        severity: string;
        description: string;
    }): Promise<{
        ticketId: string;
        severity: string;
        message: string;
    }>;
    triggerEmergencyCall(tenantId: string, payload: {
        hazardType: string;
    }): Promise<{
        hazardType: string;
        message: string;
    }>;
    getShiftHandoffs(tenantId: string): Promise<{
        id: string;
        shiftFrom: string;
        shiftTo: string;
        handedOverBy: string;
        receivedBy: string;
        notes: string;
        status: string;
        timestamp: string;
    }[]>;
    submitShiftHandoff(tenantId: string, payload: {
        shiftFrom: string;
        shiftTo: string;
        receivedBy: string;
        notes: string;
        pin?: string;
    }): Promise<{
        id: string;
        shiftFrom: string;
        shiftTo: string;
        handedOverBy: string;
        receivedBy: string;
        notes: string;
        status: string;
        timestamp: string;
        message: string;
    }>;
    getOperatorNotifications(tenantId: string): Promise<{
        id: number;
        type: string;
        read: boolean;
        title: string;
        msg: string;
        time: string;
        path: string;
    }[]>;
    markOperatorNotificationRead(tenantId: string, id: number): Promise<{
        id: number;
        read: boolean;
        message: string;
    }>;
    markAllOperatorNotificationsRead(tenantId: string): Promise<{
        message: string;
    }>;
    deleteOperatorNotification(tenantId: string, id: number): Promise<{
        id: number;
        message: string;
    }>;
    clearAllOperatorNotifications(tenantId: string): Promise<{
        message: string;
    }>;
    getOperatorProfile(tenantId: string): Promise<{
        name: string;
        title: string;
        employeeId: string;
        email: string;
        phone: string;
        plant: string;
        shift: string;
        certifications: {
            name: string;
            desc: string;
            level: string;
            variant: string;
        }[];
    }>;
    updateOperatorProfile(tenantId: string, payload: {
        email: string;
        phone: string;
        plant: string;
        shift: string;
    }): Promise<{
        message: string;
        email: string;
        phone: string;
        plant: string;
        shift: string;
    }>;
    getSupervisorDashboard(tenantId: string): Promise<{
        activeLines: number;
        totalLines: number;
        criticalAlarmsP1: number;
        activeHolds: number;
        pendingApprovals: number;
        shiftLead: string;
        handoffStatus: string;
        activeSchedules: {
            id: string;
            line: string;
            status: string;
            order: string;
        }[];
    }>;
    authorizeSupervisorShift(tenantId: string, payload: {
        shiftName: string;
    }): Promise<{
        shiftName: string;
        handoffStatus: string;
        message: string;
    }>;
    getSupervisorDeptSchedule(tenantId: string): Promise<any[]>;
    createSupervisorDeptSchedule(tenantId: string, input: any): Promise<{
        id: string;
        orderId: string;
        lineId: string;
        line: string;
        order: string;
        target: string;
        shift: any;
        status: string;
    }>;
    resequenceSupervisorDeptSchedule(tenantId: string): Promise<{
        message: string;
    }>;
    authorizeSupervisorDeptSchedule(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    pauseSupervisorDeptSchedule(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    resumeSupervisorDeptSchedule(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    getSupervisorWorkforce(tenantId: string): Promise<{
        id: string;
        employeeId: string;
        name: string;
        role: string;
        department: any;
        shift: string;
        skills: any;
        skillLevel: any;
        trainingStatus: any;
        qualificationStatus: any;
        status: any;
        currentStatus: any;
        productivityScore: any;
        unitsPerHour: any;
        efficiency: any;
        hoursWorkedMonth: any;
        plant: any;
        activeStation: any;
        shiftTiming: string;
        phone: string;
        avatar: string;
        notes: any;
    }[]>;
    addSupervisorWorkforceEmployee(tenantId: string, payload: any): Promise<{
        message: string;
        department: any;
        skills: any;
        skillLevel: any;
        trainingStatus: any;
        qualificationStatus: any;
        currentStatus: any;
        productivityScore: any;
        unitsPerHour: any;
        efficiency: any;
        hoursWorkedMonth: any;
        plant: any;
        activeStation: any;
        notes: any;
        id: string;
        employeeId: string;
        name: string;
        role: string;
        shift: string | null;
        status: any;
    }>;
    updateSupervisorWorkforceEmployee(tenantId: string, id: string, payload: any): Promise<any>;
    assignSupervisorWorkforceSkill(tenantId: string, id: string, payload: {
        skillName: string;
        skillCategory: string;
        skillLevel: string;
    }): Promise<{
        message: string;
        skillName: string;
        skillCategory: string;
        skillLevel: string;
        id: string;
    }>;
    assignSupervisorWorkforceTraining(tenantId: string, id: string, payload: {
        trainingProgram: string;
        trainingType: string;
        trainer: string;
        targetDate: string;
    }): Promise<{
        message: string;
        trainingProgram: string;
        trainingType: string;
        trainer: string;
        targetDate: string;
        id: string;
    }>;
    deleteSupervisorWorkforceEmployee(tenantId: string, id: string): Promise<{
        id: string;
        message: string;
    }>;
    getSupervisorLabourTime(tenantId: string): Promise<{
        plannedLabour: number;
        actualLabour: number;
        availableLabour: number;
        labourUtilization: number;
        labourProductivity: number;
        labourProductivityTrend: string;
        labourProductivityTarget: string;
        labourAllocationDirect: number;
        labourAllocationIndirect: number;
        lines: any[];
        shifts: {
            shift: string;
            planned: number;
            actual: number;
            available: number;
            utilization: string;
            productivity: number;
            status: string;
        }[];
    }>;
    authorizeSupervisorOvertime(tenantId: string, payload?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    rebalanceSupervisorCrew(tenantId: string, payload: {
        fromLine: string;
        toLine: string;
        operatorsCount: number;
    }): Promise<{
        message: string;
        fromLine: string;
        toLine: string;
        operatorsCount: number;
    }>;
    getSupervisorLiveHB(tenantId: string): Promise<any[]>;
    logSupervisorHB(tenantId: string, payload: any): Promise<any>;
    dispatchSupervisorHBBackup(tenantId: string, payload: {
        pool: string;
        assignedCount: number;
        targetLine: string;
        recordId?: string;
    }): Promise<{
        message: string;
        pool: string;
        assignedCount: number;
        targetLine: string;
        recordId?: string;
    }>;
    getSupervisorSkills(tenantId: string): Promise<any[]>;
    addSupervisorSkill(tenantId: string, payload: any): Promise<any>;
    updateSupervisorSkillLevel(tenantId: string, id: string, payload: any): Promise<any>;
    getSupervisorTraining(tenantId: string): Promise<{
        id: string;
        staffId: string;
        trainingProgram: any;
        employee: string;
        employeeId: string;
        trainingType: string;
        completionDate: any;
        expiryDate: any;
        trainer: string;
        status: any;
        certification: any;
    }[]>;
    addSupervisorTraining(tenantId: string, payload: any): Promise<any>;
    completeSupervisorTraining(tenantId: string, id: string, payload: any): Promise<any>;
    getSupervisorProductivity(tenantId: string): Promise<{
        overallUnitsPerHour: number;
        targetUnitsPerHour: number;
        averageProductivity: string;
        labourUtilization: string;
        hoursWorkedMTD: number;
        totalHoursWorked: number;
        grossFactoryOutput: number;
        totalOutputUnits: number;
        byLine: {
            line: string;
            unitsPerHr: number;
            variance: string;
        }[];
        byShift: {
            shift: string;
            output: number;
            outputUnits: number;
            hoursWorked: number;
            efficiency: string;
            targetVsActual: string;
            pacingVsTarget: string;
        }[];
        trend: {
            week: string;
            unitsPerHour: number;
            utilization: number;
        }[];
        employees: {
            id: string;
            employeeCode: string;
            name: string;
            role: string;
            department: any;
            shift: string;
            productivityScore: number;
            unitsPerHour: number;
            hoursWorkedMonth: number;
            monthlyOutput: number;
            efficiency: any;
            status: string;
        }[];
    }>;
    getSupervisorStaffing(tenantId: string): Promise<any[]>;
    addSupervisorStaffing(tenantId: string, payload: any): Promise<any>;
    updateSupervisorStaffing(tenantId: string, id: string, payload: any): Promise<any>;
    assignSupervisorStaffingPersonnel(tenantId: string, id: string, payload: {
        employeeName: string;
    }): Promise<{
        message: string;
        employeeName: string;
        id: string;
    }>;
    assignSupervisorStaffingStation(tenantId: string, id: string, payload: {
        operator: string;
        station: string;
    }): Promise<{
        message: string;
        operator: string;
        station: string;
        id: string;
    }>;
    closeSupervisorStaffingShift(tenantId: string, id: string, payload: {
        notes?: string;
    }): Promise<{
        shiftStatus: string;
        message: string;
        notes?: string;
        id: string;
    }>;
    deleteSupervisorStaffing(tenantId: string, id: string): Promise<{
        id: string;
        message: string;
    }>;
    setSupervisorProductionSpeedLimit(tenantId: string, payload: {
        speedLimit: number;
        line?: string;
    }): Promise<{
        message: string;
        speedLimit: number;
        line?: string;
    }>;
    getSupervisorDowntimePareto(tenantId: string): Promise<{
        rank: number;
        driver: string;
        minutes: number;
        lossPercentage: string;
    }[]>;
    updateSupervisorProductionRun(tenantId: string, payload: {
        status: string;
        producedQuantity: number;
        scrapQuantity: number;
        speedBPM?: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getSupervisorHolds(tenantId: string): Promise<{
        id: string;
        holdCode: string;
        batch: string;
        reason: string;
        severity: string;
        status: string;
        holdAt: Date;
        releasedAt: Date | null;
    }[]>;
    createSupervisorHold(tenantId: string, payload: {
        batchNumber: string;
        reason: string;
        severity?: string;
    }): Promise<{
        success: boolean;
        data: {
            status: string;
            date: string | null;
            id: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            tenantId: string | null;
            plantId: string | null;
            notes: string | null;
            reason: string;
            batchId: string | null;
            releasedAt: Date | null;
            holdId: string | null;
            batch: string | null;
            lotNumber: string;
            severity: string | null;
            holdBy: string | null;
            heldByName: string | null;
            holdAt: Date;
        };
        message: string;
    }>;
    addSupervisorHoldNote(tenantId: string, id: string, payload: {
        noteText: string;
    }): Promise<{
        message: string;
        noteText: string;
        id: string;
    } | {
        id: string;
        message: string;
    }>;
    requestSupervisorHoldRework(tenantId: string, id: string, payload: {
        pin: string;
        batch?: string;
    }): Promise<{
        message: string;
        pin: string;
        batch?: string;
        id: string;
    } | {
        id: string;
        message: string;
    }>;
    authorizeSupervisorHoldRelease(tenantId: string, id: string, payload: {
        pin: string;
        batch?: string;
    }): Promise<{
        message: string;
        pin: string;
        batch?: string;
        id: string;
    } | {
        id: string;
        message: string;
    }>;
    scrapSupervisorHoldBatch(tenantId: string, id: string): Promise<{
        id: string;
        message: string;
    }>;
    getSupervisorRecoveryCountermeasures(tenantId: string): Promise<{
        id: string;
        name: string;
        type: string;
        impact: string;
        active: boolean;
        status: string;
        createdAt: Date | null;
        appliedAt: Date | null;
    }[]>;
    authorizeSupervisorRecoveryCountermeasure(tenantId: string, id: string | number): Promise<{
        id: string | number;
        active: boolean;
        message: string;
    }>;
    authorizeAllSupervisorRecoveryCountermeasures(tenantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createSupervisorRecoveryCountermeasure(tenantId: string, payload: {
        name: string;
        type?: string;
        projectedRecoveryUnits?: number;
        speedBoostPercent?: number;
        overtimeHours?: number;
    }): Promise<{
        success: boolean;
        data: {
            type: string | null;
            status: string | null;
            id: string;
            createdAt: Date | null;
            tenantId: string | null;
            plantId: string;
            scenarioName: string;
            speedBoostPercent: string | null;
            overtimeHours: string | null;
            projectedRecoveryUnits: number | null;
            feasibilityPercent: string | null;
            estimatedCostUsd: string | null;
            appliedAt: Date | null;
        };
        message: string;
    }>;
    deleteSupervisorRecoveryCountermeasure(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSupervisorApprovals(tenantId: string): Promise<{
        id: string;
        approvalCode: string;
        type: string;
        details: string;
        status: string;
        requestedBy: string | null;
        proposedSpeed: number | null;
        supervisorComment: string | null;
        createdAt: Date;
        approvedAt: Date | null;
    }[]>;
    createSupervisorApproval(tenantId: string, payload: {
        type: string;
        details: string;
        requestedBy?: string;
        proposedSpeed?: number;
    }): Promise<{
        success: boolean;
        data: {
            type: string;
            status: string;
            details: string;
            id: string;
            createdAt: Date;
            tenantId: string;
            plantId: string | null;
            approvalCode: string;
            requestedBy: string | null;
            proposedSpeed: number | null;
            supervisorComment: string | null;
            approvedAt: Date | null;
        };
        message: string;
    }>;
    approveSupervisorApproval(tenantId: string, id: string, payload?: any): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    rejectSupervisorApproval(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    clarifySupervisorApproval(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        message: string;
    }>;
    bulkApproveSupervisorApprovals(tenantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteSupervisorApproval(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSupervisorReportsList(tenantId: string): Promise<{
        id: string;
        dbId: string;
        docCode: string;
        name: string;
        category: string;
        date: string;
        cadence: string;
        format: string;
        status: string;
        version: string;
        summary: string | null;
        effectiveDate: Date;
    }[]>;
    createSupervisorReport(tenantId: string, authorId: string, payload: {
        title: string;
        category?: string;
        docCode?: string;
        cadence?: string;
        format?: string;
        summary?: string;
    }): Promise<{
        message: string;
        report: {
            id: string;
            dbId: string;
            docCode: string;
            name: string;
            category: string;
            date: string;
            cadence: string;
            format: string;
            status: string;
            summary: string | null;
        };
    }>;
    printSupervisorReport(tenantId: string, id: string): Promise<{
        id: string;
        printedAt: string;
        message: string;
    }>;
    getSupervisorNotificationsList(tenantId: string): Promise<{
        id: string;
        type: string;
        read: boolean;
        title: string;
        msg: string;
        category: string;
        severity: string;
        time: string;
        path: string;
        createdAt: Date;
    }[]>;
    markSupervisorNotificationRead(tenantId: string, id: string | number): Promise<{
        id: string | number;
        read: boolean;
        message: string;
    }>;
    deleteSupervisorNotification(tenantId: string, id: string | number): Promise<{
        id: string | number;
        message: string;
    }>;
    markAllSupervisorNotificationsRead(tenantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearAllSupervisorNotifications(tenantId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createSupervisorNotification(tenantId: string, payload: {
        title: string;
        message: string;
        category?: string;
        severity?: string;
        linkUrl?: string;
    }): Promise<{
        message: string;
        notification: {
            id: string;
            type: string;
            read: boolean;
            title: string;
            msg: string;
            category: string;
            severity: string;
            time: string;
            path: string | null;
        };
    }>;
    getSupervisorProfile(tenantId: string, userId?: string): Promise<{
        id: string | undefined;
        name: string;
        title: string;
        employeeId: string;
        email: string;
        phone: string;
        plant: any;
        shift: string;
        certifications: any;
    } | {
        name: string;
        title: string;
        employeeId: string;
        email: string;
        phone: string;
        plant: string;
        shift: string;
        certifications: {
            name: string;
            desc: string;
            level: string;
            variant: string;
        }[];
        id?: undefined;
    }>;
    updateSupervisorProfile(tenantId: string, userId: string | undefined, payload: {
        name?: string;
        email?: string;
        phone?: string;
        plant?: string;
        shift?: string;
        certifications?: any[];
    }): Promise<{
        message: string;
        name?: string;
        email?: string;
        phone?: string;
        plant?: string;
        shift?: string;
        certifications?: any[];
    }>;
}
export declare const dashboardsService: DashboardsService;
//# sourceMappingURL=dashboards.service.d.ts.map