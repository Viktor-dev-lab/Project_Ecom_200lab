import type { IQueryHandler} from "../../../../share/interface/handler.interface";
import type { IQueryRepository } from "@share/interface/repository.interface"
import type { ListQuery} from "../../interface";
import type { BrandFilterDTO } from "../../model/dto";
import type { Brand } from "../../model/model";

export class ListBrandQueryHandler implements IQueryHandler<ListQuery, Brand[]> {
  constructor(private readonly repository: IQueryRepository<Brand, BrandFilterDTO>) {}

  async query(query: ListQuery): Promise<Brand[]> {
    return await this.repository.list(query.filter, query.paging);
  }
}