import type { IQueryHandler, IQueryRepository } from "../../../../share/interface";
import type { GetDetailQuery} from "../../interface";
import type { BrandFilterDTO } from "../../model/dto";
import type { Brand } from "../../model/model";

export class GetBrandDetailQuery implements IQueryHandler<GetDetailQuery, Brand> {
  constructor(private readonly repository: IQueryRepository<Brand, BrandFilterDTO>) {}

  async query(query: GetDetailQuery): Promise<Brand> {
    const data = await this.repository.get(query.id);
    if (!data) {
      throw new Error('Brand not found');
    }
    return data;
  }
}