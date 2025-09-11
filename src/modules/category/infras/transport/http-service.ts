import {Request, Response} from 'express'
import {CategoryCreateSchema, CategoryUpdateSchema, CategoryFilterDTOSchema} from "../../model/dto"
import {ICategoryUseCase} from "../../interface"
import {z} from 'zod'
import { PagingDTOSchema } from "../../../../share/model/paging";
import type { Category } from '../../model/model';

export class CategoryHttpService {
  constructor(private readonly useCase: ICategoryUseCase) {}

  async createCategoryAPI(req: Request, res: Response){
      const { success, data, error } = CategoryCreateSchema.safeParse(req.body);
    
      if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
    
        return;
      }

      const result = await this.useCase.createCategory(data);
      res.status(200).json({data: result});
  }

  async getDetailCategoryAPI(req: Request, res: Response){
    const { id } = req.params;
    const category = await this.useCase.getDetailCategory(id);  
    res.status(200).json({data: category});
  }

  
  async updateCategoryAPI(req: Request, res: Response) {
    const {id} = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);

    if (!success) {
        const tree = z.treeifyError(error);
        res.status(400).json({
          message: tree,
        });
    
        return;
      }

      const result = await this.useCase.updateCategory(id, data);
      res.status(200).json({data: result});

  }

  async deleteCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.useCase.deleteCategory(id);
    res.status(200).json({ data: result });
  }

  async listCategoryAPI(req: Request, res: Response) {
    const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);

    if (!success) {
      const tree = z.treeifyError(error);
      res.status(400).json({
        message: 'Invalid paging',
        error: tree,
      });

      return;
    }

    const cond = CategoryFilterDTOSchema.parse(req.query);
    const result = await this.useCase.listCategory(cond, paging);
    const categoriesTree = this.buildTree(result);

    res.status(200).json({ data: categoriesTree, paging, filter: cond });
  }

  private buildTree(categories: Category[]): Category[]{
    const categoriesTree: Category[] = [];
    const mapChildren = new Map<string, Category[]>();

    for (let i =0; i < categories.length; i++){
      const category = categories[i];

      if (!mapChildren.get(category.id)){
        mapChildren.set(category.id, []);
      }

      category.children = mapChildren.get(category.id);

      if (!category.parentId){
        categoriesTree.push(category);
      } else {
        const children = mapChildren.get(category.parentId);
        children ? children.push(category) : mapChildren.set(category.parentId, [category]);
      }
    }
    return categoriesTree;
  }
}