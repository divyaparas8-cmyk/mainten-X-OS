"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const AppError_js_1 = require("../shared/errors/AppError.js");
async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        throw new AppError_js_1.UnauthorizedError("Authentication required: Please provide a valid Bearer token");
    }
}
//# sourceMappingURL=authenticate.js.map