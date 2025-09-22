import { Request, Response } from "express";
import { IUseCase } from "../interface";
import { PagingDTOSchema } from "../model/paging";
import z from "zod";

export abstract class BaseHttpService<CreateDTO, UpdateDTO, Entity, Filter> {
  constructor(
    public readonly useCase: IUseCase<CreateDTO, UpdateDTO, Entity, Filter>,
    private readonly CreateDTOSchema: z.ZodType<CreateDTO>,
    private readonly UpdateDTOSchema: z.ZodType<UpdateDTO>,
    private readonly FilterDTOSchema: z.ZodType<Filter>
  ) { }

  async createAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = this.CreateDTOSchema.safeParse(req.body);

      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
        return;
      }

      const result = await this.useCase.create(data);
      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.useCase.getDetail(id);
      res.status(200).json({ data: category });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }


  async updateAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { success, data, error } = this.UpdateDTOSchema.safeParse(req.body);

      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });

        return;
      }

      const result = await this.useCase.update(id, data);
      res.status(200).json({ data: result });

    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.useCase.delete(id);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async listAPI(req: Request, res: Response) {
    try {
      const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);

      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: 'Invalid paging',
          error: tree,
        });

        return;
      }

      const cond = this.FilterDTOSchema.parse(req.query);
      const result = await this.useCase.list(cond, paging);

      res.status(200).json({ data: result, paging, filter: cond });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}