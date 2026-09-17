export declare const SUBSCRIPTION_PLANS: Record<string, {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
}>;
export declare class BillingService {
    listPlans(): Promise<{
        id: string;
        name: string;
        price: number;
        currency: string;
        interval: string;
    }[]>;
    createOrder(params: {
        planId: string;
        tenantId: string;
        currency?: string;
    }): Promise<{
        isFree: boolean;
        planId: string;
        planName: string;
        amount: number;
        currency: string;
        message: string;
        orderId?: undefined;
        keyId?: undefined;
        receipt?: undefined;
        paymentRecordId?: undefined;
    } | {
        isFree: boolean;
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        receipt: string;
        planId: string;
        planName: string;
        paymentRecordId: string;
        message?: undefined;
    }>;
    verifyPayment(params: {
        tenantId: string;
        orderId: string;
        paymentId: string;
        signature: string;
        planId: string;
    }): Promise<{
        success: boolean;
        message: string;
        subscriptionId: string;
        orderId: string;
        paymentId: string;
        status: string;
        currentPeriodEnd: string;
    }>;
    processWebhook(rawBody: string, signature: string, eventPayload: any): Promise<{
        success: boolean;
        message: string;
        eventId: any;
        status: string;
    } | {
        success: boolean;
        message: string;
        eventId: any;
        status?: undefined;
    }>;
    getSubscription(tenantId: string): Promise<{
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
    } | {
        planId: string;
        planName: string;
        status: string;
        billingCycle: string;
        amount: string;
        currency: string;
        currentPeriodStart: string;
        currentPeriodEnd: string;
    }>;
}
export declare const billingService: BillingService;
//# sourceMappingURL=billing.service.d.ts.map