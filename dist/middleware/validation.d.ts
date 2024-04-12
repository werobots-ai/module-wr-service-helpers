import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
export declare const validation: (schema: ZodObject<any>, property?: "body" | "query" | "params") => (req: Request, _: Response, next: NextFunction) => void;
