import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validation = (schema: ZodObject<any>, property: "body" | "query" | "params" = "body") =>
  (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);
    if (result.success) {
      req[property] = result.data;
      return next();
    }

    const {
      error: { issues },
    } = result;

    switch (issues[0].message) {
      case "Required":
        return next({
          status: 422,
          message: "Validation error",
          field: issues[0]?.path[0] || "unknown field",
        });
      default:
        return next({
          status: 422,
          message: "Validation error",
          issues,
        });
    }
  };
