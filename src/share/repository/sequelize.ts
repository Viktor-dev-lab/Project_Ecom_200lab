import { Op, Sequelize } from "sequelize";
import { IRepository } from "../interface";
import type { PagingDTO } from "../model/paging";
import { ModelStatus } from "../model/base-model";

export abstract class BaseRepositorySequelize<Entity, Filter, updateDTO> implements IRepository<Entity, Filter, updateDTO> {
  constructor(
    private readonly sequelize: Sequelize, 
    private readonly modelName: string
  ) { }

  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) {
      return null;
    }
    return data.get({ plain: true }) as Entity;
  }

  async list(filter: Filter, paging: PagingDTO): Promise<Array<Entity>> {
    const { page, limit } = paging;
    const condSQL = { ...filter, status: { [Op.ne]: ModelStatus.DELETED } };
    const total = await this.sequelize.models[this.modelName].count({ where: condSQL });

    paging.total = total;
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });
    console.log(rows);
    return rows.map((row) => row.get({ plain: true })) as Array<Entity>;
  }

  async insert(data: Entity): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: updateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(
      { ...data, updateAt: new Date() },
      { where: { id } }
    );
    return true;
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (!isHard) {
      await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }
    return true;
  }

  async findByCond(cond: Filter): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: cond as any});
    if (!data) {
      return null;
    }
    return data.get({ plain: true }) as Entity;
  }
}