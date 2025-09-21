import { config } from "@share/component/config";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelName } from "./insfra/repository/mysql/dto";
import { MySQLProductRepository } from "./insfra/repository/mysql/mysql-repo";
import { ProxyProductBrandRepository, ProxyProductCategoryRepository, RPCProductBrandRepository, RPCProductCategoryRepository } from "./insfra/repository/rpc";
import { ProductHTTPService } from "./insfra/transport/http-service";
import { ProductUseCase } from "./usecase";

export function setupProductHexagon(sequelize: Sequelize): Router {
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
    productUseCase, cachedProductBrandRepository, cachedProductCategoryRepository
  );

  const router = Router();

  router.post('/products', productHttpService.createAPI.bind(productHttpService));
  router.get('/products/:id', productHttpService.getDetailAPI.bind(productHttpService));
  router.get('/products', productHttpService.listAPI.bind(productHttpService));
  router.patch('/products/:id', productHttpService.updateAPI.bind(productHttpService));
  router.delete('/products/:id', productHttpService.deleteAPI.bind(productHttpService));

  return router;
}