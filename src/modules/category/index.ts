import { Router } from "express";
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/dto'
import { MySQLCategoryRepository } from '../category/infras/repository/repo';

import { CategoryUseCase } from "./usecase";
import { CategoryHttpService } from "./infras/transport/http-service";
import { modelName } from "./infras/repository/dto";
import { ApplicationContext } from "@share/interface/middleware.interface";
import { UserRole } from "@share/model/base-model";

export const setupCategoryHexagon = (sequelize: Sequelize, appContext: ApplicationContext) => {
  init(sequelize);

  const repository = new MySQLCategoryRepository(sequelize, modelName);
  const useCase = new CategoryUseCase(repository);
  const httpService = new CategoryHttpService(useCase);

  const router = Router();
  const mdlFactory = appContext.middlewareFactory;
  const auth = mdlFactory.auth;
  const adminRole = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/categories', auth, adminRole, httpService.createAPI.bind(httpService));
  router.get('/categories/:id', httpService.getDetailAPI.bind(httpService));
  router.get('/categories', httpService.listAPI.bind(httpService));
  router.patch('/categories/:id', auth, adminRole, httpService.updateAPI.bind(httpService));
  router.delete('/categories/:id', auth, adminRole, httpService.deleteAPI.bind(httpService));

  return router;
}