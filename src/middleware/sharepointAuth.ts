import { getDaprUrl } from "../dapr-helpers/getDaprUrl";

import { Request, Response, NextFunction } from "express";

export const sharepointAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["x-wr-key"] as string | undefined;
    const MSToken = req.headers["x-wr-ms-token"] as string | undefined;

    const daprUrl = getDaprUrl(
      "service-wr-auth",
      `/sharepoint-auth`
    );

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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
