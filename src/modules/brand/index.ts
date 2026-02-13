import { Router } from "express";
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/sequelize/dto'
import { MySQLBrandRepository } from './infras/repository/sequelize';
import { BrandHttpService } from "./infras/transport/http-service";
import { CreateNewBrandCmdHandler } from "./usecase/command/create-new-brand";
import { GetBrandDetailQuery } from "./usecase/query/get-brand-detail";
import { DeleteBrandCommandHandler } from "./usecase/command/delete-brand";
import { UpdateBrandCommandHandler } from "./usecase/command/update-brand";
import { ListBrandQueryHandler } from "./usecase/query/list-brand";
import { modelName } from "./infras/repository/sequelize/dto";
import { ApplicationContext } from "@share/interface/middleware.interface";
import { UserRole } from "@share/model/base-model";
import { validate } from "@share/middleware/validate";
import { BrandCreateSchema } from "./model/dto";
import { PrismaBrandRepository } from "./infras/repository/prisma";


export const setupBrandHexagon = (sequelize: Sequelize, appContext: ApplicationContext) => {
  init(sequelize);

  // const repository = new MySQLBrandRepository(sequelize, modelName);
  const repository = new PrismaBrandRepository();
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
  const mdlFactory = appContext.middlewareFactory;
  const auth = mdlFactory.auth;
  const adminRole = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/brands',validate(BrandCreateSchema), auth, adminRole, httpService.createBrandAPI.bind(httpService));
  router.get('/brands/:id', httpService.getDetailBrandAPI.bind(httpService));
  router.get('/brands', httpService.listBrandAPI.bind(httpService));
  router.patch('/brands/:id',auth, adminRole, httpService.updateBrandAPI.bind(httpService));
  router.delete('/brands/:id',auth, adminRole, httpService.deleteBrandAPI.bind(httpService));

  return router;
}