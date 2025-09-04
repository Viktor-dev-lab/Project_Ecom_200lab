import express, { Express, Request, Response } from "express";

export const getCategoryApi = (req: Request, res: Response) => {
  // const category = categories.find((category) => category.id === req.params.id);
  // if (!category) {
  //   return res.status(404).json({
  //     message: "Category not found",
  //     code: 404
  //   });
  // }
  res.status(200).json({
    data: [],
    code: 200
  });
}