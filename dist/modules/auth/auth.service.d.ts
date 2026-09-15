import { LoginInput } from "./auth.schema.js";
export declare class AuthService {
    validateUserCredentials(input: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            name: string;
            tenantId: string;
            plantId: string;
            role: string;
            roleName: string;
            isMasterAdmin: boolean;
            avatarUrl: string | null;
        };
        tenant: {
            status: string;
            id: string;
            name: string;
            slug: string;
            plan: string;
            settings: unknown;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyDigitalSignaturePin(userId: string, pin: string): Promise<boolean>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map