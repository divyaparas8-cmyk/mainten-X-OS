"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = exports.pool = exports.db = void 0;
__exportStar(require("./schema/index.js"), exports);
__exportStar(require("./relations.js"), exports);
var database_js_1 = require("../config/database.js");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return database_js_1.db; } });
Object.defineProperty(exports, "pool", { enumerable: true, get: function () { return database_js_1.pool; } });
Object.defineProperty(exports, "checkDatabaseConnection", { enumerable: true, get: function () { return database_js_1.checkDatabaseConnection; } });
//# sourceMappingURL=index.js.map