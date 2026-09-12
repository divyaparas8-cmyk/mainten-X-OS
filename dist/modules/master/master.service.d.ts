export interface ActorContext {
    userId?: string;
    email?: string;
    role?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class MasterAdminService {
    private writeAudit;
    getDashboard(): Promise<{
        kpis: {
            totalCompanies: number;
            activeCompanies: number;
            suspendedCompanies: number;
            totalUsers: number;
            totalAdmins: number;
            activeSubscriptions: number;
            expiringSubscriptions: number;
            pendingTickets: number;
            systemAlerts: number;
            companyGrowth: string;
            userGrowth: string;
        };
        planBreakdown: Record<string, number>;
        activityLogs: {
            id: string;
            action: string;
            details: string;
            date: string;
            actor: string;
            ip: string;
        }[];
    }>;
    getCompanies(query?: {
        search?: string;
        status?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        status: string;
        subscription: any;
        admin: string;
        adminEmail: string;
        adminPhone: any;
        usersCount: number;
        plants: number;
        createdAt: string;
        expiryDate: string;
        lastActivity: string;
        currency: any;
        modules: Record<string, boolean> | {
            plan: boolean;
            produce: boolean;
            verify: boolean;
            maintain: boolean;
            move: boolean;
            people: boolean;
            improve: boolean;
            intelligence: boolean;
        };
    }[]>;
    getCompanyById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        status: string;
        subscription: string;
        admin: string;
        adminEmail: string;
        usersCount: number;
        plants: number;
        createdAt: string;
        expiryDate: string;
        lastActivity: string;
        currency: any;
        modules: Record<string, boolean>;
        plantsList: {
            id: string;
            name: string;
            code: string;
            location: string;
            lines: number;
            capacity: string;
            status: string;
        }[];
        usersList: {
            id: string;
            name: string;
            email: string;
            status: string;
            lastLogin: string;
        }[];
        subscriptionsList: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            planId: string;
            planName: string;
            billingCycle: string;
            amount: string;
            currency: string;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            razorpaySubscriptionId: string | null;
            razorpayCustomerId: string | null;
        }[];
        activityList: {
            id: string;
            action: string;
            date: string;
            details: string;
        }[];
        settings: {};
    }>;
    createCompany(input: {
        name: string;
        admin: string;
        adminEmail: string;
        adminPhone?: string;
        subscription?: string;
        plantsCount?: number;
        currency?: string;
    }, actor?: ActorContext): Promise<{
        id: any;
        name: any;
        slug: any;
        status: string;
        subscription: string;
        admin: string;
        adminEmail: string;
        adminPhone: string;
        usersCount: number;
        plants: number;
        createdAt: any;
        expiryDate: string;
        currency: string;
    }>;
    updateCompanyStatus(id: string, newStatus: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
    }>;
    updateCompanyDetails(id: string, updates: {
        name?: string;
        subscription?: string;
    }, actor?: ActorContext): Promise<{
        name?: string;
        subscription?: string;
        id: string;
    }>;
    deleteCompany(id: string, actor?: ActorContext): Promise<{
        success: boolean;
        message: string;
    }>;
    getCompanyAdmins(query?: {
        search?: string;
        companyId?: string;
        status?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        company: string;
        tenantId: string;
        role: string;
        status: string;
        lastLogin: string;
        createdAt: string;
    }[]>;
    createCompanyAdmin(input: {
        name: string;
        email?: string;
        company?: string;
        companyId?: string;
    }, actor?: ActorContext): Promise<{
        id: any;
        name: string;
        email: any;
        company: any;
        tenantId: any;
        role: string;
        status: string;
        lastLogin: string;
        createdAt: any;
    }>;
    updateCompanyAdmin(id: string, updates: {
        name?: string;
    }, actor?: ActorContext): Promise<{
        name?: string;
        id: string;
    }>;
    updateAdminStatus(id: string, newStatus: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
    }>;
    resetAdminPassword(id: string, actor?: ActorContext): Promise<{
        success: boolean;
        message: string;
        tempPassword: string;
    }>;
    getPlans(): Promise<{
        id: string;
        name: string;
        subtitle: string | null;
        priceMonthly: number;
        priceAnnual: number;
        currency: string;
        duration: string;
        userLimit: number;
        accessLevel: string;
        status: string;
        isPopular: boolean;
        ctaText: string;
        modules: unknown;
        features: unknown;
    }[]>;
    createPlan(input: any, actor?: ActorContext): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        subtitle: string | null;
        priceMonthly: string;
        priceAnnual: string;
        duration: string;
        userLimit: number;
        accessLevel: string;
        isPopular: boolean;
        ctaText: string;
        modules: unknown;
        features: unknown;
    }>;
    updatePlan(id: string, updates: any, actor?: ActorContext): Promise<{
        id: string;
        name: string;
        subtitle: string | null;
        priceMonthly: string;
        priceAnnual: string;
        currency: string;
        duration: string;
        userLimit: number;
        accessLevel: string;
        status: string;
        isPopular: boolean;
        ctaText: string;
        modules: unknown;
        features: unknown;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePlanStatus(id: string, status: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
    }>;
    deletePlan(id: string, actor?: ActorContext): Promise<{
        success: boolean;
        message: string;
    }>;
    getSubscriptions(query?: {
        search?: string;
        plan?: string;
        status?: string;
    }): Promise<{
        id: string;
        tenantId: string;
        company: string;
        plan: string;
        planId: string;
        status: string;
        billingCycle: string;
        amount: number;
        currency: string;
        startDate: string;
        endDate: string;
        renewalDate: string;
        razorpaySubscriptionId: string;
    }[]>;
    extendSubscription(subscriptionIdOrCompanyId: string, actor?: ActorContext): Promise<{
        id: string;
        currentPeriodEnd: string;
    }>;
    cancelSubscription(subscriptionIdOrCompanyId: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
    }>;
    getPayments(query?: {
        search?: string;
        status?: string;
    }): Promise<{
        payments: {
            id: string;
            paymentUuid: string;
            company: string;
            tenantId: string;
            amount: number;
            currency: string;
            date: string;
            status: string;
            method: string;
            plan: string;
            orderId: string;
            paymentId: string | null;
        }[];
        totalRevenue: number;
        overdueAmount: number;
    }>;
    markPaymentPaid(paymentIdOrReceipt: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
    }>;
    getInvoiceData(paymentIdOrReceipt: string): Promise<{
        id: string;
        invoiceNumber: string;
        company: string;
        tenantId: string;
        plan: string;
        date: string;
        amount: number;
        currency: string;
        status: string;
        customer: {
            name: string;
            id: string;
        };
        paymentMethod: string;
        orderId: string;
        paymentId: string | null;
        razorpayPaymentId: string;
        issuer: {
            company: string;
            gstin: string;
            support: string;
        };
    }>;
    getCompanyModules(companyId: string): Promise<Record<string, boolean>>;
    toggleCompanyModule(companyId: string, moduleKey: string, isEnabled?: boolean, actor?: ActorContext): Promise<{
        companyId: string;
        moduleKey: string;
        isEnabled: boolean;
    }>;
    getPlatformUsers(query?: {
        search?: string;
        status?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        company: string;
        tenantId: string;
        role: string;
        status: string;
        lastLogin: string;
        createdAt: string;
    }[]>;
    updateUserStatus(userId: string, newStatus: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
    }>;
    deleteUser(userId: string, actor?: ActorContext): Promise<{
        success: boolean;
        message: string;
    }>;
    getPlatformAnalytics(): Promise<{
        totalCompanies: number;
        totalUsers: number;
        activeUsers: number;
        avgSession: string;
        apiRequests: string;
        subscriptionDistribution: Record<string, number>;
        moduleAdoption: Record<string, number>;
    }>;
    getAuditLogs(query?: {
        search?: string;
        event?: string;
    }): Promise<{
        id: string;
        user: string;
        event: string;
        target: string;
        date: string;
        ip: string;
    }[]>;
    deleteAuditLog(id: string, actor?: ActorContext): Promise<{
        success: boolean;
        message: string;
    }>;
    getSupportTickets(query?: {
        search?: string;
        status?: string;
    }): Promise<{
        id: string;
        company: string;
        tenantId: string | null;
        subject: string;
        description: string | null;
        status: string;
        priority: string;
        assignedTo: string | null;
        date: string;
        resolution: string | null;
    }[]>;
    createSupportTicket(input: {
        companyName: string;
        subject: string;
        description?: string;
        priority?: string;
        tenantId?: string;
    }, actor?: ActorContext): Promise<{
        status: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        priority: string;
        assignedTo: string | null;
        companyName: string;
        subject: string;
        resolution: string | null;
    }>;
    updateTicketStatus(id: string, status: string, resolution?: string, actor?: ActorContext): Promise<{
        id: string;
        status: string;
        resolution: string | undefined;
    }>;
    deleteSupportTicket(id: string, actor?: ActorContext): Promise<{
        success: boolean;
        message: string;
    }>;
    getPlatformSettings(): Promise<{
        id: string;
        updatedAt: Date;
        platformName: string;
        supportEmail: string;
        require2fa: boolean;
        enforceStrongPasswords: boolean;
        logAllIps: boolean;
        maintenanceMode: boolean;
        maintenanceMessage: string | null;
        defaultCurrency: string;
        smtpConfig: unknown;
        branding: unknown;
    }>;
    updatePlatformSettings(input: any, actor?: ActorContext): Promise<{
        id: string;
        platformName: string;
        supportEmail: string;
        require2fa: boolean;
        enforceStrongPasswords: boolean;
        logAllIps: boolean;
        maintenanceMode: boolean;
        maintenanceMessage: string | null;
        defaultCurrency: string;
        smtpConfig: unknown;
        branding: unknown;
        updatedAt: Date;
    }>;
}
export declare const masterAdminService: MasterAdminService;
//# sourceMappingURL=master.service.d.ts.map