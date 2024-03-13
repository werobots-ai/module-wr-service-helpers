import { getDaprUrl } from "../dapr-helpers/getDaprUrl.js";
import { authSingleton } from "./authSingleton.js";
const securityHeaderName = process.env.SECURITY_HEADER_NAME || "x-wr-key";
export const ensureLoggedIn = async (req, res, next) => {
    try {
        const daprUrl = getDaprUrl("service-wr-auth", `/verify`);
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
        }
        const authData = await userQueryResponse.json();
        if (!authData) {
            res.status(401).send("Unauthorized");
            return;
        }
        authSingleton.run(authData, next);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
