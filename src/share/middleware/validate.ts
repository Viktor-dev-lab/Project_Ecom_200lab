import type { Request, Response, NextFunction } from "express";
import { responseErr } from "../app-error";

export function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { success, data, error } = schema.safeParse(req.body);
    if (!success) {
      return responseErr(error as Error, res);
    }
    req.body = data; 
    next();
  };
}
