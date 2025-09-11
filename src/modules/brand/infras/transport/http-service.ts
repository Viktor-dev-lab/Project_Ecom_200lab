import {Request, Response} from 'express'
import {BrandCreateSchema, BrandUpdateSchema, BrandFilterDTOSchema} from "../../model/dto"
import {IBrandUseCase} from "../../interface"
import {z} from 'zod'
import { PagingDTOSchema } from "../../../../share/model/paging";
import type { Brand } from '../../model/model';

export class BrandHttpService {
  constructor(private readonly useCase: IBrandUseCase) {}

  async createBrandAPI(req: Request, res: Response){
      const { success, data, error } = BrandCreateSchema.safeParse(req.body);
    
      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
    
        return;
      }

      const result = await this.useCase.createBrand(data);
      res.status(200).json({data: result});
  }

  async getDetailBrandAPI(req: Request, res: Response){
    const { id } = req.params;
    const brand = await this.useCase.getDetailBrand(id);  
    res.status(200).json({data: brand});
  }

  
  async updateBrandAPI(req: Request, res: Response) {
    const {id} = req.params;
    const { success, data, error } = BrandUpdateSchema.safeParse(req.body);

    if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
    
        return;
      }

      const result = await this.useCase.updateBrand(id, data);
      res.status(200).json({data: result});

  }

  async deleteBrandAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.useCase.deleteBrand(id);
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
    const result = await this.useCase.listBrand(cond, paging);
    console.log(result);

    res.status(200).json({ data: result, paging, filter: cond });
  }
}