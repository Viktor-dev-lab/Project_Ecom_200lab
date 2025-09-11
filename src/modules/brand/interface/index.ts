import {PagingDTO} from "../../../share/model/paging"
import {BrandUpdateDTO, BrandCreateDTO, BrandFilterDTO} from "../model/dto"
import {Brand} from "../model/model"

export interface IBrandUseCase {
  createBrand(data: BrandCreateDTO): Promise<string>;
  getDetailBrand(id: string): Promise<Brand | null>;
  listBrand(filter: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>>;
  updateBrand(id: string, data: BrandUpdateDTO): Promise<boolean>;
  deleteBrand(id: string): Promise<boolean>;
}

export interface IRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Brand | null>;
  list(filter: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>>;
}

export interface ICommandRepository {
  insert(data: Brand): Promise<boolean>;
  update(id: string, data: BrandUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}