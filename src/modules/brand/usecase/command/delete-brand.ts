import type { ICommandHandler} from "../../../../share/interface";
import { ErrorDataNotFound } from "../../../../share/model/base-errors";
import { ModelStatus } from "../../../../share/model/base-model";
import type { DeleteCommand, IBrandRepository } from "../../interface";


export class DeleteBrandCommandHandler implements ICommandHandler<DeleteCommand, boolean> {
  constructor(private readonly repository: IBrandRepository) { }

  async execute(cmd: DeleteCommand): Promise<boolean> {
    const category = await this.repository.get(cmd.id);
    if (!category || category.status === ModelStatus.DELETED) {
      throw ErrorDataNotFound;
    }
    return await this.repository.delete(cmd.id, cmd.isHardDelete);
  }
}