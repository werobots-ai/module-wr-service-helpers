import { Request, Response, NextFunction } from "express";
import { invokeService } from "../utils/invokeService";

export const sharepointAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["x-wr-key"] as string | undefined;
    const MSToken = req.headers["x-wr-ms-token"] as string | undefined;

    const authResponse = await invokeService(
      "service-wr-auth",
      `/sharepoint-auth`,
      "POST",
      {
        token,
        MSToken,
        workspaceId: req.params.workspaceId,
        assistantId: req.params.assistantId,
      },
      { skipJsonParse: true }
    );

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
