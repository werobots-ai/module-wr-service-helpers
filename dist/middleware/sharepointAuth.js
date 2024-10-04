"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharepointAuth = void 0;
const invokeService_1 = require("../utils/invokeService");
const sharepointAuth = async (req, res, next) => {
    try {
        const token = req.headers["x-wr-key"];
        const MSToken = req.headers["x-wr-ms-token"];
        const authResponse = await (0, invokeService_1.invokeService)("service-wr-auth", `/sharepoint-auth`, "POST", {
            token,
            MSToken,
            workspaceId: req.params.workspaceId,
            assistantId: req.params.assistantId,
        }, { skipJsonParse: true });
        if (!authResponse.ok) {
            res.status(authResponse.status).send(await authResponse.json());
            return;
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.sharepointAuth = sharepointAuth;
