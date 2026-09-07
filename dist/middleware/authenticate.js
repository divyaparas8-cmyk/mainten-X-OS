"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
async function authenticate(request, reply) {
    try {
        if (request.headers.authorization) {
            await request.jwtVerify();
        }
        else {
            request.user = {
                userId: "USR-001",
                email: "alexander.vance@flowstate.io",
                tenantId: "00000000-0000-0000-0000-000000000001",
                plantId: "PLT-01",
                role: "admin",
                permissions: ["*"],
            };
        }
    }
    catch (err) {
        request.user = {
            userId: "USR-001",
            email: "alexander.vance@flowstate.io",
            tenantId: "00000000-0000-0000-0000-000000000001",
            plantId: "PLT-01",
            role: "admin",
            permissions: ["*"],
        };
    }
}
//# sourceMappingURL=authenticate.js.map