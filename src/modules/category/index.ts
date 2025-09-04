import { Router } from "express";
import { createCategoryApi } from "./infras/create-api";
import { deleteCategoryApi } from "./infras/delete-api";
import { getCategoryApi } from "./infras/get-api";
import { listCategoryApi } from "./infras/list-api";
import { updateCategoryApi } from "./infras/update-api";

export const setupCategoryModule = () => {
  const router = Router();

  router.get('/categories', listCategoryApi);
  router.get('/categories/:id', getCategoryApi);
  router.post('/categories', createCategoryApi);
  router.patch('/categories/:id', updateCategoryApi);
  router.delete('/categories/:id', deleteCategoryApi);

  return router;
}