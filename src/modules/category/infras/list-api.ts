import express, { Express, Request, Response } from "express";
import { CategoryModel } from "./repository/dto";
import { z } from 'zod';
import { CategoryStatus } from "../model/model";
import { Op } from "sequelize";

const PagingDTOSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  total: z.coerce.number().int().min(0).default(0).optional(),
});

export const listCategoryApi = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = PagingDTOSchema.safeParse(req.query);

    if (!success) {
      const tree = z.treeifyError(error);
      res.status(400).json({
        message: 'Invalid paging',
        error: tree,
      });

      return;
    }

    const { page, limit } = data;

    const cond = { status: { [Op.ne]: CategoryStatus.Deleted } };

    const total = await CategoryModel.count({ where: cond });
    data.total = total;

    const rows = await CategoryModel.findAll({ where: cond, limit, offset: (page - 1) * limit, order: [['id', 'DESC']] });

    res.status(200).json({
      data: rows,
      paging: data,
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      code: 500
    });
  }
};