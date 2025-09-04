import express, { Express, Request, Response } from "express";

export const createCategoryApi = (req: Request, res: Response) => {
  // const parseResult = CategoryCreateSchema.safeParse(req.body);

  // if (!parseResult.success) {
  //   const tree = z.treeifyError(parseResult.error);

  //   return res.status(400).json({
  //     code: 400,
  //     message: "Validation error",
  //     errors: tree,
  //   });
  // }

  // const { name, image, description, parentId } = parseResult.data;

  // // Tạo id mới
  // const maxId = categories.length > 0
  //   ? Math.max(...categories.map(category => Number(category.id)))
  //   : 0;

  // const newId = maxId + 1;

  // const category: Category = {
  //   id: String(newId),
  //   name,
  //   image,
  //   description,
  //   parentId,
  //   position: categories.length + 1,
  //   status: CategoryStatus.Active,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

  // categories.push(category);

  res.status(201).json({
    data: [],
    code: 200,
  });
}