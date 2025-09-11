import { Router } from "express";
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/dto'
import { MySQLBrandRepository } from '../brand/infras/repository/repo';

import { modelName } from './infras/repository/dto'
import { BrandUseCase } from "./usecase";
import { BrandHttpService } from "./infras/transport/http-service";

export const setupBrandHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLBrandRepository(sequelize, modelName);
  const useCase = new BrandUseCase(repository);
  const httpService = new BrandHttpService(useCase);

  const router = Router();

  router.post('/brands', httpService.createBrandAPI.bind(httpService));
  router.get('/brands/:id', httpService.getDetailBrandAPI.bind(httpService));
  router.get('/brands', httpService.listBrandAPI.bind(httpService));
  router.patch('/brands/:id', httpService.updateBrandAPI.bind(httpService));
  router.delete('/brands/:id', httpService.deleteBrandAPI.bind(httpService));

  return router;
}