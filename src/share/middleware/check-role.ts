import { Handler, NextFunction, Request, Response } from "express";
import { Requester} from "../interface/auth.interface";
import { UserRole } from "../model/base-model"
import { ErrForbidden, responseErr, ErrUnauthorized} from "../app-error";

export function allowRoles(roles: UserRole[]): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.requester) {
      responseErr(ErrUnauthorized.withLog("User not logged in"), res);
      return;
    }
    const requester = res.locals.requester as Requester; 

    if (roles.indexOf(requester.role) === -1) {
      responseErr(ErrForbidden.withLog("User tried to access admin area"), res);
      return;
    }

    next();
  };
}