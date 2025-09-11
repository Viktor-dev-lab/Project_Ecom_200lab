import {PagingDTO} from "../../../share/model/paging"
import {CategoryUpdateDTO, CategoryCreateDTO, CategoryFilterDTO} from "../model/dto"
import {Category} from "../model/model"
import {IRepository} from "../../../share/interface"

export interface ICategoryUseCase {
  createCategory(data: CategoryCreateDTO): Promise<string>;
  getDetailCategory(id: string): Promise<Category | null>;
  listCategory(filter: CategoryFilterDTO, paging: PagingDTO): Promise<Array<Category>>;
  updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;
}

export interface ICategoryRepository extends IRepository<Category, CategoryFilterDTO, CategoryUpdateDTO> {}