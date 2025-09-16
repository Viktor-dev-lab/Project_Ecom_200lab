import {CategoryUpdateDTO} from "../../model/dto";
import {Category} from "../../model/model";
import {CategoryFilterDTO} from "../../model/dto";
import {Sequelize } from "sequelize";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/sequelize";

export class MySQLCategoryRepository extends BaseRepositorySequelize<Category, CategoryFilterDTO, CategoryUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(
      new MYSQLCategoryQueryRepository(sequelize, modelName),
      new MYSQLCategoryCommandRepository(sequelize, modelName),
    );
  }
}

export class MYSQLCategoryQueryRepository extends BaseQueryRepositorySequelize<Category, CategoryFilterDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(sequelize, modelName);
  }
}

export class MYSQLCategoryCommandRepository extends BaseCommandRepositorySequelize<Category, CategoryUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(sequelize, modelName);
  }
} 