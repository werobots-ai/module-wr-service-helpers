"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (schema, property = "body") => (req, _, next) => {
    const result = schema.safeParse(req[property]);
    if (result.success) {
        req[property] = result.data;
        return next();
    }
    const { error: { issues }, } = result;
    switch (issues[0].message) {
        case "Required":
            return next({
                status: 422,
                message: "Validation error",
                field: issues[0]?.path[0] || "unknown field",
            });
        default:
            return next({
                status: 422,
                message: "Validation error",
                issues,
            });
    }
};
