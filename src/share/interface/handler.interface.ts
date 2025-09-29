export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>;
}

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>;
}
