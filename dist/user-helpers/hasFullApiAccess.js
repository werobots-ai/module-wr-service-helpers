"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasFullApiAccess = void 0;
const authSingleton_js_1 = require("./authSingleton.js");
const invokeService_js_1 = require("../utils/invokeService.js");
const securityHeaderName = process.env.SECURITY_HEADER_NAME || "x-wr-key";
const hasFullApiAccess = async (req, res, next) => {
    try {
        const token = req.headers[securityHeaderName];
        if (!token) {
            res.status(401).send("Unauthorized");
            return;
        }
        const userQueryResponse = await (0, invokeService_js_1.invokeService)("service-wr-auth", `/verify`, "POST", {
            token: req.headers[securityHeaderName],
        }, { skipJsonParse: true });
        if (!userQueryResponse.ok) {
            res.status(userQueryResponse.status).send(await userQueryResponse.text());
            return;
        }
        const authData = await userQueryResponse.json();
        if (!authData) {
            res.status(401).send("Unauthorized");
            return;
        }
        if (!authData.user.roles.includes("full-api-access")) {
            res.status(403).send("Forbidden");
            return;
        }
        authSingleton_js_1.authSingleton.run(authData, next);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.hasFullApiAccess = hasFullApiAccess;
