import { Handler } from "express";
import { UserRole } from "../model/base-model";

export interface MiddlewareFactory {
  auth: Handler;
  allowRoles: (roles: UserRole[]) => Handler;
}

export type ApplicationContext = {
  middlewareFactory: MiddlewareFactory;
}
