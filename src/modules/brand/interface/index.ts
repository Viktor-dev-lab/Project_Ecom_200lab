import {PagingDTO} from "../../../share/model/paging"
import {IRepository} from "../../../share/interface/repository.interface"
import {BrandUpdateDTO, BrandCreateDTO, BrandFilterDTO} from "../model/dto"
import {Brand} from "../model/model"

export interface IBrandUseCase {
  createBrand(data: BrandCreateDTO): Promise<string>;
  getDetailBrand(id: string): Promise<Brand | null>;
  listBrand(filter: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>>;
  updateBrand(id: string, data: BrandUpdateDTO): Promise<boolean>;
  deleteBrand(id: string): Promise<boolean>;
}

export interface CreateCommand {
  cmd: BrandCreateDTO;
}

export interface GetDetailQuery {
  id: string;
}

export interface ListQuery{
  filter: BrandFilterDTO;
  paging: PagingDTO;
}

export interface UpdateCommand {
  id: string;
  dto: BrandUpdateDTO;
}

export interface DeleteCommand {
  id: string;
  isHardDelete: boolean;
}

export interface IBrandRepository extends IRepository<Brand, BrandFilterDTO, BrandUpdateDTO> {}
