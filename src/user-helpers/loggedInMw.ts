import { Handler } from "express";
import { getDaprUrl } from "../dapr-helpers/getDaprUrl.js";
import { userSingleton } from "./userSingleton.js";

const securityHeaderName =
  process.env.SECURITY_HEADER_NAME || ("x-wr-key" as string);

export const ensureLoggedIn: Handler = async (req, res, next) => {
  try {
    const daprUrl = getDaprUrl(
      "service-wr-auth",
      `/account/${req.headers[securityHeaderName]}`
    );

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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
