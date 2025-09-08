import express, { Express, Request, Response } from "express";
import { CategoryCreateSchema } from "../model/dto";
import { v7 } from "uuid";
import { z } from 'zod';
import { CategoryModel } from "./repository/dto";

export async function createCategoryApi(req: Request, res: Response): Promise<void> {
  const { success, data, error } = CategoryCreateSchema.safeParse(req.body);

  if (!success) {
    const tree = z.treeifyError(error);
    res.status(400).json({
      message: tree,
    });

    return;
  }

  const newId = v7();
  await CategoryModel.create({ id: newId, ...data });

  res.status(201).json({
    data: newId,
    code: 200,
  });
}