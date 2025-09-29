import { IUseCase } from "@/share/interface/usecase.interface";
import { IRepository } from "@/share/interface/repository.interface";
import { CategoryFilterDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/dto";
import { Category } from "../model/model";

export interface ICategoryUseCase extends IUseCase<CategoryCreateDTO, CategoryUpdateDTO, Category, CategoryFilterDTO> { }
export interface ICategoryRepository extends IRepository<Category, CategoryFilterDTO, CategoryUpdateDTO> { }