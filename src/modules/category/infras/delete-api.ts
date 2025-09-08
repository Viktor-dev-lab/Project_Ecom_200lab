import express, { Express, Request, Response } from "express";
import { CategoryModel } from "./repository/dto";
import { CategoryStatus } from "../model/model";


export const deleteCategoryApi = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryModel.findByPk(id);
  if (!category || category.status == CategoryStatus.Deleted) {
    res.status(404).json({
      code: 404,
      message: "Category not found",
    });
    return;
  }

  await CategoryModel.update({
    status: CategoryStatus.Deleted,
  }, {
    where: {
      id,
    },
  });

  res.status(200).json({
    code: 200,
    data: true
  });
}