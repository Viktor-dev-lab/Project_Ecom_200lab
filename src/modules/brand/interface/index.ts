import {PagingDTO} from "../../../share/model/paging"
import {IRepository} from "../../../share/interface"
import {BrandUpdateDTO, BrandCreateDTO, BrandFilterDTO} from "../model/dto"
import {Brand} from "../model/model"

export interface IBrandUseCase {
  createBrand(data: BrandCreateDTO): Promise<string>;
  getDetailBrand(id: string): Promise<Brand | null>;
  listBrand(filter: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>>;
  updateBrand(id: string, data: BrandUpdateDTO): Promise<boolean>;
  deleteBrand(id: string): Promise<boolean>;
}

export interface IBrandRepository extends IRepository<Brand, BrandFilterDTO, BrandUpdateDTO> {}
