import { IUseCase } from "@/share/interface";
import { IRepository } from "@/share/interface";
import { CategoryFilterDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/dto";
import { Category } from "../model/model";

export interface ICategoryUseCase extends IUseCase<CategoryCreateDTO, CategoryUpdateDTO, Category, CategoryFilterDTO> { }
export interface ICategoryRepository extends IRepository<Category, CategoryFilterDTO, CategoryUpdateDTO> { }