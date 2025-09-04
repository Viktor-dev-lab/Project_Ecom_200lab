import express, { Express, Request, Response } from "express";


export const deleteCategoryApi = (req: Request, res: Response) => {
  // const { id } = req.params;
  // categories = categories.filter((category) => category.id !== id);
  // const categoryFound = categories.find((category) => category.id === req.params.id);

  // if (!categoryFound) {
  //   return res.status(404).json({
  //     message: "Category not found",
  //     code: 404
  //   });
  // }

  res.status(200).json({
    code: 200,
    data: true
  });
}