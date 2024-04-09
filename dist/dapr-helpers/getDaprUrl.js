"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaprUrl = void 0;
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || 3500;
const getDaprUrl = (serviceName, path) => {
    return `http://localhost:${DAPR_HTTP_PORT}/v1.0/invoke/${serviceName}/method${path[0] === "/" ? "" : "/"}${path}`;
};
exports.getDaprUrl = getDaprUrl;
