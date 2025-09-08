import express, { Express, Request, Response } from "express";
import { CategoryUpdateSchema } from '../model/dto';
import { z } from 'zod';
import { CategoryModel } from "./repository/dto";
import { CategoryStatus } from "../model/model";

export const updateCategoryApi = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);

  if (!success) {
    const tree = z.treeifyError(error);
    res.status(404).json({
      code: 404,
      message: tree,
    });
    return;
  }

  const category = await CategoryModel.findByPk(id);
  if (!category || category.status === CategoryStatus.Deleted) {
    res.status(404).json({
      code: 404,
      message: 'Category not found',
    });

    return;
  }

  await CategoryModel.update(data, {
    where: {
      id,
    },
  });

  return res.status(200).json({
    code: 200,
    data: true,
  });
}