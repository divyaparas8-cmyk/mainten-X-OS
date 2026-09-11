"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const auth_js_1 = require("../config/auth.js");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(jwt_1.default, {
        secret: auth_js_1.authConfig.jwtSecret,
        sign: {
            expiresIn: auth_js_1.authConfig.jwtExpiresIn,
        },
    });
});
//# sourceMappingURL=jwt.js.map