import { Handler } from "express";
import { authSingleton } from "./authSingleton.js";
import { AuthData } from "../types/AuthData.js";
import { invokeService } from "../utils/invokeService.js";

const securityHeaderName =
  process.env.SECURITY_HEADER_NAME || ("x-wr-key" as string);

export const hasFullApiAccess: Handler = async (req, res, next) => {
  try {
    const token = req.headers[securityHeaderName];
    if (!token) {
      res.status(401).send("Unauthorized");
      return;
    }

    const userQueryResponse = await invokeService(
      "service-wr-auth",
      `/verify`,
      "POST",
      {
        token: req.headers[securityHeaderName],
      },
      { skipJsonParse: true }
    );

    if (!userQueryResponse.ok) {
      res.status(userQueryResponse.status).send(await userQueryResponse.text());
      return;
    }

    const authData: AuthData = await userQueryResponse.json();

    if (!authData) {
      res.status(401).send("Unauthorized");
      return;
    }

    if (!authData.user.roles.includes("full-api-access")) {
      res.status(403).send("Forbidden");
      return;
    }

    authSingleton.run(authData, next);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
