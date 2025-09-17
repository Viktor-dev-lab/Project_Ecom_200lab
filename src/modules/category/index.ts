import { Router } from "express";
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/dto'
import { MySQLCategoryRepository } from '../category/infras/repository/repo';

import { CategoryUseCase } from "./usecase";
import { CategoryHttpService } from "./infras/transport/http-service";
import { modelName } from "./infras/repository/dto";

export const setupCategoryHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLCategoryRepository(sequelize, modelName);
  const useCase = new CategoryUseCase(repository);
  const httpService = new CategoryHttpService(useCase);

  const router = Router();

  router.post('/categories', httpService.createAPI.bind(httpService));
  router.get('/categories/:id', httpService.getDetailAPI.bind(httpService));
  router.get('/categories', httpService.listAPI.bind(httpService));
  router.patch('/categories/:id', httpService.updateAPI.bind(httpService));
  router.delete('/categories/:id', httpService.deleteAPI.bind(httpService));

  return router;
}