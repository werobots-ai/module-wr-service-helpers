"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharepointAuth = void 0;
const getDaprUrl_1 = require("../dapr-helpers/getDaprUrl");
const sharepointAuth = async (req, res, next) => {
    try {
        const token = req.headers["x-wr-key"];
        const MSToken = req.headers["x-wr-ms-token"];
        const daprUrl = (0, getDaprUrl_1.getDaprUrl)("service-wr-auth", `/sharepoint-auth`);
        const authResponse = await fetch(daprUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                MSToken,
                workspaceId: req.params.workspaceId,
                assistantId: req.params.assistantId,
            }),
        });
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
