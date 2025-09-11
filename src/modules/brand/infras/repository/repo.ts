import { Op, Sequelize } from "sequelize";
import { IRepository } from "../../interface";
import { BrandStatus, type Brand } from "../../model/model";
import type { BrandFilterDTO, BrandUpdateDTO } from "../../model/dto";
import type { PagingDTO } from "../../../../share/model/paging";

export class MySQLBrandRepository implements IRepository {
  constructor(private readonly sequelize: Sequelize, private readonly modelName: string) { }

  async get(id: string): Promise<Brand | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) {
      return null;
    }
    return data.get({ plain: true })
  }

  async list(filter: BrandFilterDTO, paging: PagingDTO): Promise<Array<Brand>> {
    const { page, limit } = paging;
    const condSQL = { ...filter, status: { [Op.ne]: BrandStatus.DELETED } };
    const total = await this.sequelize.models[this.modelName].count({ where: condSQL });

    paging.total = total;
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });
    console.log(rows);
    return rows.map((row) => row.get({ plain: true }));
  }

  async insert(data: Brand): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }

  async update(id: string, data: BrandUpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(
      { ...data, updateAt: new Date() },
      { where: { id } }
    );
    return true;
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (!isHard) {
      await this.sequelize.models[this.modelName].update({ status: BrandStatus.DELETED }, { where: { id } });
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }

    return true;
  }
}