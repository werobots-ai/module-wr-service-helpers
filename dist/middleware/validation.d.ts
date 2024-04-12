import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
declare const _default: (schema: ZodObject<any>, property?: "body" | "query" | "params") => (req: Request, _: Response, next: NextFunction) => void;
export default _default;
