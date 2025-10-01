import { ITokenIntrospect } from "../interface/auth.interface";
import { MiddlewareFactory } from "../interface/middleware.interface";
import { authMiddleware } from "./auth";
import { allowRoles } from "./check-role";

export const setupMiddlewares = (
  introspector: ITokenIntrospect,
): MiddlewareFactory => {

  const auth = authMiddleware(introspector);

  return {
    auth,
    allowRoles,
  };
};