import { Router } from "express";
import { createCategoryApi } from "./infras/create-api";
import { deleteCategoryApi } from "./infras/delete-api";
import { getCategoryApi } from "./infras/get-api";
import { listCategoryApi } from "./infras/list-api";
import { updateCategoryApi } from "./infras/update-api";
import { Sequelize } from 'sequelize';
import { init } from './infras/repository/dto'

export const setupCategoryModule = (sequelize: Sequelize) => {
  init(sequelize);

  const router = Router();

  router.get('/categories', listCategoryApi);
  router.get('/categories/:id', getCategoryApi);
  router.post('/categories', createCategoryApi);
  router.patch('/categories/:id', updateCategoryApi);
  router.delete('/categories/:id', deleteCategoryApi);

  return router;
}