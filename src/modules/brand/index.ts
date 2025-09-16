import { Router } from "express";
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/dto'
import { MySQLBrandRepository } from '../brand/infras/repository/repo';
import { BrandHttpService } from "./infras/transport/http-service";
import { CreateNewBrandCmdHandler } from "./usecase/command/create-new-brand";
import { GetBrandDetailQuery } from "./usecase/query/get-brand-detail";
import { DeleteBrandCommandHandler } from "./usecase/command/delete-brand";
import { UpdateBrandCommandHandler } from "./usecase/command/update-brand";
import { ListBrandQueryHandler } from "./usecase/query/list-brand";
import {modelName} from "./infras/repository/dto";

export const setupBrandHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLBrandRepository(sequelize, modelName);

  const createCmdHandler = new CreateNewBrandCmdHandler(repository);
  const getDetailQueryHandler = new GetBrandDetailQuery(repository);
  const deleteCmdHandler = new DeleteBrandCommandHandler(repository);
  const updateCmdHandler = new UpdateBrandCommandHandler(repository);
  const listQueryHandler = new ListBrandQueryHandler(repository);

  const httpService = new BrandHttpService(
    createCmdHandler, 
    getDetailQueryHandler, 
    deleteCmdHandler, 
    updateCmdHandler, 
    listQueryHandler
  );

  const router = Router();

  router.post('/brands', httpService.createBrandAPI.bind(httpService));
  router.get('/brands/:id', httpService.getDetailBrandAPI.bind(httpService));
  router.get('/brands', httpService.listBrandAPI.bind(httpService));
  router.patch('/brands/:id', httpService.updateBrandAPI.bind(httpService));
  router.delete('/brands/:id', httpService.deleteBrandAPI.bind(httpService));

  return router;
}