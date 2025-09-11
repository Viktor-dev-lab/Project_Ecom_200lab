import {PagingDTO} from "../../../share/model/paging"
import {CategoryUpdateDTO, CategoryCreateDTO, CategoryFilterDTO} from "../model/dto"
import {Category} from "../model/model"

export interface ICategoryUseCase {
  createCategory(data: CategoryCreateDTO): Promise<string>;
  getDetailCategory(id: string): Promise<Category | null>;
  listCategory(filter: CategoryFilterDTO, paging: PagingDTO): Promise<Array<Category>>;
  updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;
}

export interface IRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Category | null>;
  list(filter: CategoryFilterDTO, paging: PagingDTO): Promise<Array<Category>>;
}

export interface ICommandRepository {
  insert(data: Category): Promise<boolean>;
  update(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}