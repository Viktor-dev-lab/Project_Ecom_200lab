import { Request, Response } from 'express'
import { BrandCreateSchema, BrandUpdateSchema, BrandFilterDTOSchema, BrandFilterDTO, BrandUpdateDTO } from "../../model/dto"
import { CreateCommand, GetDetailQuery, type DeleteCommand, type UpdateCommand } from "../../interface"
import { z } from 'zod'
import { PagingDTOSchema, type PagingDTO } from "../../../../share/model/paging";
import type { Brand } from '../../model/model';
import type { ICommandHandler, IQueryHandler } from '../../../../share/interface/handler.interface';
import { responseErr } from '@share/app-error';

export class BrandHttpService {

  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly getDetailQueryHandler: IQueryHandler<GetDetailQuery, Brand | null>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteCommand, boolean>,
    private readonly updateCmdHandler: ICommandHandler<UpdateCommand, boolean>,
    private readonly listQueryHandler: IQueryHandler<{ filter: BrandFilterDTO, paging: PagingDTO }, Brand[]>,
  ) { }

  async createBrandAPI(req: Request, res: Response) {
    try {
      const command: CreateCommand = { cmd: req.body };
      const result = await this.createCmdHandler.execute(command);
      res.status(200).json({ data: result });
    } catch (error) {
      responseErr(error as Error, res);
    }
  }


  async getDetailBrandAPI(req: Request, res: Response) {
    try{
      const { id } = req.params as { id: string };
      const brand = await this.getDetailQueryHandler.query({ id });
      res.status(200).json({ data: brand });
    } catch (error){
      responseErr(error as Error, res);
    }
  }


  async updateBrandAPI(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { success, data, error } = BrandUpdateSchema.safeParse(req.body);

    if (!success) {
      const tree = z.treeifyError(error);
      res.status(400).json({
        message: tree,
      });

      return;
    }

    const result = await this.updateCmdHandler.execute({ id, dto: data });
    res.status(200).json({ data: result });

  }

  async deleteBrandAPI(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const result = await this.deleteCmdHandler.execute({ id, isHardDelete: false });
    res.status(200).json({ data: result });
  }

  async listBrandAPI(req: Request, res: Response) {
    const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);

    if (!success) {
      const tree = z.treeifyError(error);
      res.status(400).json({
        message: 'Invalid paging',
        error: tree,
      });

      return;
    }

    const cond = BrandFilterDTOSchema.parse(req.query);
    const result = await this.listQueryHandler.query({ filter: cond, paging });
    res.status(200).json({ data: result, paging, filter: cond });
  }
}