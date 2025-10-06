import { Op, Sequelize } from "sequelize";
import { ICommandRepository, IQueryRepository } from "@share/interface/repository.interface";
import { IRepository } from "@/share/interface/repository.interface"

import type { PagingDTO } from "@share/model/paging";
import { ModelStatus } from "@share/model/base-model";

export abstract class BaseRepositorySequelize<Entity, Cond, UpdateDTO> implements IRepository<Entity, Cond, UpdateDTO> {
  constructor(
    readonly queryRepo: IQueryRepository<Entity, Cond>,
    readonly cmdRepo: ICommandRepository<Entity, UpdateDTO>,
  ) { }

  async get(id: string): Promise<Entity | null> {
    return await this.queryRepo.get(id);
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    return await this.queryRepo.findByCond(cond);
  }

  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    return await this.queryRepo.list(cond, paging);
  }

  async insert(data: Entity): Promise<boolean> {
    return await this.cmdRepo.insert(data);
  }

  async update(id: string, data: UpdateDTO): Promise<boolean> {
    return await this.cmdRepo.update(id, data);
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    return await this.cmdRepo.delete(id, isHard);
  }

  async listByIds(ids: string[]): Promise<Array<Entity>> {
    return await this.queryRepo.listByIds(ids)
  }
}

export abstract class BaseQueryRepositorySequelize<Entity, Cond> implements IQueryRepository<Entity, Cond> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { }

  protected get model() {
    return this.sequelize.models[this.modelName];
  }

  async get(id: string): Promise<Entity | null> {
    const data = await this.model.findByPk(id);

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    const { created_at, updated_at, ...props } = persistenceData;

    return {
      ...props,
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    } as Entity;
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    const data = await this.model.findOne({ where: cond as any });

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    return persistenceData as Entity;
  }

  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    const { page, limit } = paging;

    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };

    const total = await this.model.count({ where: condSQL });
    paging.total = total;

    const rows = await this.model.findAll({ where: condSQL, limit, offset: (page - 1) * limit, order: [['id', 'DESC']] });

    return rows.map((row) => row.get({ plain: true }));
  }

  async listByIds(ids: string[]): Promise<Array<Entity>> {
    const model = this.model;
    const rows = await model.findAll(
      {
        where: { id: { [Op.in]: ids } }
      });

    return rows.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { created_at, updated_at, ...props } = persistenceData;

      return {
        ...props,
        createdAt: persistenceData.created_at,
        updatedAt: persistenceData.updated_at,
      } as Entity;
    })
  }
}

export abstract class BaseCommandRepositorySequelize<Entity, UpdateDTO> implements ICommandRepository<Entity, UpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { }
  
  protected get model() {
    return this.sequelize.models[this.modelName];
  }

  async insert(data: Entity): Promise<boolean> {
    await this.model.create(data as any);
    return true;
  }

  async update(id: string, data: UpdateDTO): Promise<boolean> {
    await this.model.update(data as any, { where: { id } });
    return true;
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (!isHard) {
      await this.model.update({ status: ModelStatus.DELETED }, { where: { id } });
    } else {
      await this.model.destroy({ where: { id } });
    }

    return true;
  }
}