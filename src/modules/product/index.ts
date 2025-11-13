import { config } from "@share/component/config";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelName } from "./insfra/repository/mysql/dto";
import { MySQLProductRepository } from "./insfra/repository/mysql/mysql-repo";
import { ProxyProductBrandRepository, ProxyProductCategoryRepository, RPCProductBrandRepository, RPCProductCategoryRepository } from "./insfra/repository/rpc";
import { ProductHTTPService } from "./insfra/transport/http-service";
import { ProductUseCase } from "./usecase";
import { ApplicationContext } from "@share/interface/middleware.interface";
import { UserRole } from "@share/model/base-model";

export function setupProductHexagon(sequelize: Sequelize, appContext: ApplicationContext): Router {
  init(sequelize);

  const productRepository = new MySQLProductRepository(sequelize, modelName);

  const productBrandRepository = new RPCProductBrandRepository(config.rpc.productBrand);
  const productCategoryRepository = new RPCProductCategoryRepository(config.rpc.productCategory);
  const cachedProductBrandRepository = new ProxyProductBrandRepository(productBrandRepository);
  const cachedProductCategoryRepository = new ProxyProductCategoryRepository(productCategoryRepository);

  const productUseCase = new ProductUseCase(
    productRepository, cachedProductBrandRepository, cachedProductCategoryRepository
  );

  const productHttpService = new ProductHTTPService(
    productUseCase, cachedProductBrandRepository, cachedProductCategoryRepository, productRepository
  );

  const router = Router();
  const mdlFactory = appContext.middlewareFactory;
  const auth = mdlFactory.auth;
  const adminRole = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/products', auth, adminRole, productHttpService.createAPI.bind(productHttpService));
  router.get('/products/:id', productHttpService.getDetailAPI.bind(productHttpService));
  router.get('/products', productHttpService.listAPI.bind(productHttpService));
  router.patch('/products/:id', auth, adminRole, productHttpService.updateAPI.bind(productHttpService));
  router.delete('/products/:id', auth, adminRole, productHttpService.deleteAPI.bind(productHttpService));

  // RPC
  router.post('/rpc/products/by-ids', productHttpService.listProductByIdsAPI.bind(productHttpService));
  return router;
}