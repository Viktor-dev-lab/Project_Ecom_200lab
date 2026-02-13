import {Sequelize } from "sequelize";
import { type Brand } from "../../../model/model";
import type { BrandFilterDTO, BrandUpdateDTO } from "../../../model/dto";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/sequelize";

export class MySQLBrandRepository extends BaseRepositorySequelize<Brand, BrandFilterDTO, BrandUpdateDTO> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(
      new MySQLQueryRepository(sequelize, modelName),
      new MySQLCommandRepository(sequelize, modelName)
    );
  }
}

export class MySQLQueryRepository extends BaseQueryRepositorySequelize<Brand, BrandFilterDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
export class MySQLCommandRepository extends BaseCommandRepositorySequelize<Brand, BrandUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
