import express, { Express, Request, Response } from "express";
import { CategoryUpdateDTO } from '../model/dto';

export const updateCategoryApi = (req: Request, res: Response) => {
  // const { name, image, description, parentId, status } = req.body as CategoryUpdateDTO;
  // const category = categories.find((c) => c.id === req.params.id);

  // if (!category) {
  //   return res.status(404).json({
  //     code: 404,
  //     message: "Category not found",
  //   });
  // }

  // const errors: string[] = [];

  // if (!name || typeof name !== "string" || name.trim() === "") {
  //   errors.push("name is required and must be a non-empty string");
  // }

  // if (!image || typeof image !== "string" || image.trim() === "") {
  //   errors.push("image is required and must be a non-empty string");
  // }

  // if (!description || typeof description !== "string" || description.trim() === "") {
  //   errors.push("description is required and must be a non-empty string");
  // }

  // if (!parentId || typeof parentId !== "string" || parentId.trim() === "") {
  //   errors.push("parentId is required and must be a non-empty string");
  // }

  // if (
  //   !status ||
  //   ![CategoryStatus.Active, CategoryStatus.Inactive].includes(status)
  // ) {
  //   errors.push("status is required and must be either 'Active' or 'Inactive'");
  // }

  // if (errors.length > 0) {
  //   return res.status(400).json({
  //     code: 400,
  //     errors,
  //   });
  // }

  // category.name = name;
  // category.image = image;
  // category.description = description;
  // category.parentId = parentId;
  // category.status = status;
  // category.updatedAt = new Date();

  return res.status(200).json({
    code: 200,
    message: "Category updated successfully",
    data: [],
  });
}