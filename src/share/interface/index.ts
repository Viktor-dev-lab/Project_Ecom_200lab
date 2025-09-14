import type { PagingDTO } from "../model/paging";

export interface IRepository<Entity, Filter, updateDTO> extends IQueryRepository<Entity, Filter>, ICommandRepository<Entity, updateDTO> {}

export interface IQueryRepository<Entity, Filter> {
  get(id: string): Promise<Entity | null>;
  list(filter: Filter, paging: PagingDTO): Promise<Array<Entity>>;
  findByCond(cond: Filter): Promise<Entity | null>;
}

export interface ICommandRepository<Entity, updateDTO> {
  insert(data: Entity): Promise<boolean>;
  update(id: string, data: updateDTO): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>;
}

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>;
}