import {Brand, BrandStatus} from "../model/model"
import {BrandUpdateDTO, BrandCreateDTO, BrandFilterDTO, BrandCreateSchema} from "../model/dto"
import {IBrandUseCase, IBrandRepository} from "../interface/index";
import { v7 } from "uuid";
import { ErrorDataNotFound } from "../../../share/model/base-errors";
import type { PagingDTO } from "../../../share/model/paging";

export class BrandUseCase implements IBrandUseCase{
  constructor(private readonly repository: IBrandRepository){}

  async createBrand(data: BrandCreateDTO): Promise<string>{
    const isExist = await this.repository.findByCond({name: data.name});
    if (isExist){
      throw new Error('Brand name already exists');
    }

    const newID = v7();
    const Brand: Brand = {
      id: newID,
      name: data.name,
      image: data.image,
      tag_line: data.tag_line,
      description: data.description,
      status: BrandStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await this.repository.insert(Brand);
    return newID;
  }

  async getDetailBrand(id: string): Promise<Brand | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === BrandStatus.DELETED){
      throw ErrorDataNotFound;
    }

    return data;
  }

  async listBrand(filter: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>>{
    const data = this.repository.list(filter, paging);
    return data;
  }

  async updateBrand(id: string, data: BrandUpdateDTO): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status === BrandStatus.DELETED){
      throw ErrorDataNotFound;
    }
    return await this.repository.update(id, data);
  }

  async deleteBrand(id: string): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status === BrandStatus.DELETED){
      throw ErrorDataNotFound;
    }
    return await this.repository.delete(id);
  }
}