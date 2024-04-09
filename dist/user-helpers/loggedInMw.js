"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureLoggedIn = void 0;
const getDaprUrl_js_1 = require("../dapr-helpers/getDaprUrl.js");
const authSingleton_js_1 = require("./authSingleton.js");
const securityHeaderName = process.env.SECURITY_HEADER_NAME || "x-wr-key";
const ensureLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers[securityHeaderName];
        if (!token) {
            res.status(401).send("Unauthorized");
            return;
        }
        const daprUrl = (0, getDaprUrl_js_1.getDaprUrl)("service-wr-auth", `/verify`);
        const userQueryResponse = await fetch(daprUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: req.headers[securityHeaderName],
            }),
        });
        if (!userQueryResponse.ok) {
            res.status(userQueryResponse.status).send(await userQueryResponse.text());
            return;
        }
        const authData = await userQueryResponse.json();
        if (!authData) {
            res.status(401).send("Unauthorized");
            return;
        }
        authSingleton_js_1.authSingleton.run(authData, next);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.ensureLoggedIn = ensureLoggedIn;
