export interface CreateOrderParams {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
}
export interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
    keyId: string;
}
export declare class RazorpayAdapter {
    private keyId;
    private keySecret;
    private webhookSecret;
    constructor();
    private isLiveCredentials;
    createOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
    verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean;
}
export declare const razorpayAdapter: RazorpayAdapter;
//# sourceMappingURL=razorpay.adapter.d.ts.map