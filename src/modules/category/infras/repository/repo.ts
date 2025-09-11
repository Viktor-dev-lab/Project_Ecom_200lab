import {CategoryUpdateDTO} from "../../model/dto";
import {Category} from "../../model/model";
import {CategoryFilterDTO} from "../../model/dto";
import {Sequelize } from "sequelize";
import { BaseRepositorySequelize } from "../../../../share/repository/sequelize";

export class MySQLCategoryRepository extends BaseRepositorySequelize<Category, CategoryFilterDTO, CategoryUpdateDTO> {
  constructor(sequelize: Sequelize) {
    super(sequelize, "Category");
   }
}
