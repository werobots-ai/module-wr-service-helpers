import { getDaprUrl } from "../../dapr-helpers/getDaprUrl.js";
import { userSingleton } from "../../singletons/userSingleton.js";
const securityHeaderName = process.env.SECURITY_HEADER_NAME || "x-wr-key";
export const ensureLoggedIn = async (req, res, next) => {
    try {
        const daprUrl = getDaprUrl("service-wr-auth", `/account/${req.headers[securityHeaderName]}`);
        const userQueryResponse = await fetch(daprUrl);
        if (userQueryResponse.status === 404) {
            res.status(403).send("Unauthorized");
            return;
        }
        if (!userQueryResponse.ok) {
            res.status(500).send("Internal Server Error");
            return;
        }
        const user = await userQueryResponse.json();
        if (!user) {
            res.status(403).send("Unauthorized");
            return;
        }
        userSingleton.run({ user }, next);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
