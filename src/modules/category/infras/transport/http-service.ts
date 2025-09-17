import {Request, Response} from 'express'
import {CategoryCreateSchema, CategoryUpdateSchema, CategoryFilterDTOSchema, CategoryCreateDTO, CategoryUpdateDTO, CategoryFilterDTO} from "../../model/dto"
import {ICategoryUseCase} from "../../interface"
import {z} from 'zod'
import { PagingDTOSchema } from "../../../../share/model/paging";
import { Category } from '../../model/model';
import { BaseHttpService } from '@share/transport/http-server';

export class CategoryHttpService extends BaseHttpService<CategoryCreateDTO, CategoryUpdateDTO, Category, CategoryFilterDTO>{
  constructor(useCase: ICategoryUseCase) {
    super(useCase, CategoryCreateSchema, CategoryUpdateSchema, CategoryFilterDTOSchema);
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
    const result = await this.useCase.list(cond, paging);
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