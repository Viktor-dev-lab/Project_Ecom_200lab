import {Sequelize } from "sequelize";
import { type Brand } from "../../model/model";
import type { BrandFilterDTO, BrandUpdateDTO } from "../../model/dto";
import { BaseRepositorySequelize } from "../../../../share/repository/sequelize";

export class MySQLBrandRepository extends BaseRepositorySequelize<Brand, BrandFilterDTO, BrandUpdateDTO> {
  constructor(sequelize: Sequelize) {
    super(sequelize, "Brand");
   }
}