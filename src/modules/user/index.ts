import { Router } from "express";
import { Sequelize } from "sequelize";
import { MySQLUserRepository } from "./infras/repository/mysql";
import { init, modelName } from "./infras/repository/mysql/dto";
import { UserHTTPService } from "./infras/transport";
import { UserUseCase } from "./usecase";
import { ApplicationContext } from "@share/interface/middleware.interface";
import { UserRole } from "@share/model/base-model";

import { validate } from "@share/middleware/validate";
import { UserLoginDTOSchema } from "./model";

export const setupUserHexagon = (sequelize: Sequelize, appContext: ApplicationContext) => {
  init(sequelize);

  const repository = new MySQLUserRepository(sequelize, modelName);
  const useCase = new UserUseCase(repository);
  const httpService = new UserHTTPService(useCase);

  const router = Router();
  const mdlFactory = appContext.middlewareFactory;
  const auth = mdlFactory.auth;
  const adminRole = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/register', httpService.registerAPI.bind(httpService));
  router.post('/login', validate(UserLoginDTOSchema), httpService.loginAPI.bind(httpService));
  router.get('/profile', httpService.profileAPI.bind(httpService));

  router.get('/users/:id', auth, adminRole, httpService.getDetailAPI.bind(httpService));
  router.get('/users', auth, adminRole, httpService.listAPI.bind(httpService));
  router.patch('/users/:id', auth, adminRole, httpService.updateAPI.bind(httpService));
  router.delete('/users/:id', auth, adminRole, httpService.deleteAPI.bind(httpService));

  // RPC API (use internally)
  router.post('/rpc/introspect', httpService.introspectAPI.bind(httpService));

  return router;
};