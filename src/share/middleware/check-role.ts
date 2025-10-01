import { Handler, NextFunction, Request, Response } from "express";
import { Requester} from "../interface/auth.interface";
import { UserRole } from "../model/base-model"

export function allowRoles(roles: UserRole[]): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.requester) {
      res.status(401).json({error: 'Unauthoried'});
      return;
    }

    const requester = res.locals.requester as Requester; 

    if (roles.indexOf(requester.role) === -1) {
      res.status(401).json({error: 'No Permission'});
      return;
    }

    next();
  };
}