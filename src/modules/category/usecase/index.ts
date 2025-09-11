import {Category, CategoryStatus} from "../model/model"
import {CategoryUpdateDTO, CategoryCreateDTO, CategoryFilterDTO} from "../model/dto"
import {ICategoryUseCase} from "../interface/index";
import { v7 } from "uuid";
import { ErrorDataNotFound } from "../../../share/model/base-errors";
import type { PagingDTO } from "../../../share/model/paging";
import type { IRepository } from "../../../share/interface";

export class CategoryUseCase implements ICategoryUseCase{
  constructor(private readonly repository: IRepository<Category, CategoryFilterDTO, CategoryUpdateDTO>){}

  async createCategory(data: CategoryCreateDTO): Promise<string>{
    const newID = v7();
    const category: Category = {
      id: newID,
      name: data.name,
      image: data.image,
      description: data.description,
      position: 0,
      status: CategoryStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await this.repository.insert(category);
    return newID;
  }

  async getDetailCategory(id: string): Promise<Category | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === CategoryStatus.DELETED){
      throw ErrorDataNotFound;
    }

    return data;
  }

  async listCategory(filter: CategoryFilterDTO, paging: PagingDTO): Promise<Array<Category>>{
    const data = this.repository.list(filter, paging);
    return data;
  }

  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status === CategoryStatus.DELETED){
      throw ErrorDataNotFound;
    }
    return await this.repository.update(id, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status === CategoryStatus.DELETED){
      throw ErrorDataNotFound;
    }
    return await this.repository.delete(id);
  }
}