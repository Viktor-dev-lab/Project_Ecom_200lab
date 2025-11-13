import { config } from "@share/component/config";
import { ApplicationContext } from "@share/interface/middleware.interface";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, OrderCommandRepository } from "./infras/repository/mysql";
import { CartQueryRepository } from "./infras/repository/rpc";
import { OrderHttpService } from "./infras/tranport/http-sevice";
import { OrderUseCase } from "./usecase";

export function setupOrderHexagon(sequelize: Sequelize, appContext: ApplicationContext): Router {
  init(sequelize);

  const orderCommandRepository = new OrderCommandRepository(sequelize);
  const cartQueryRepository = new CartQueryRepository(config.rpc.cart);
  // const orderQueryRepository = new OrderQueryRepository(sequelize);

  const orderUseCase = new OrderUseCase(orderCommandRepository, cartQueryRepository);
  const orderHTTPService = new OrderHttpService(orderUseCase)

  return orderHTTPService.getRoute(appContext);
}