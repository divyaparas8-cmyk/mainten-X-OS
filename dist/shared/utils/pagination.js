"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = void 0;
exports.getPaginationOffset = getPaginationOffset;
exports.buildPaginationMeta = buildPaginationMeta;
const zod_1 = require("zod");
const constants_js_1 = require("../../config/constants.js");
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(constants_js_1.MAX_PAGE_LIMIT).default(constants_js_1.DEFAULT_PAGE_LIMIT),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    plantId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.string().optional(),
});
function getPaginationOffset(page, limit) {
    return (page - 1) * limit;
}
function buildPaginationMeta(total, page, limit) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
//# sourceMappingURL=pagination.js.map