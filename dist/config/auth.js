"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
const env_js_1 = require("./env.js");
exports.authConfig = {
    jwtSecret: env_js_1.env.JWT_SECRET,
    jwtRefreshSecret: env_js_1.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: env_js_1.env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: env_js_1.env.JWT_REFRESH_EXPIRES_IN,
    bcryptSaltRounds: 10,
};
//# sourceMappingURL=auth.js.map