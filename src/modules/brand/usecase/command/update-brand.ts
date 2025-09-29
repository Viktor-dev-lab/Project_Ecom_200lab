import type { ICommandHandler } from "@share/interface/handler.interface";
import { ErrorDataNotFound } from "@share/model/base-errors";
import { ModelStatus } from "@share/model/base-model";
import type { IBrandRepository, UpdateCommand} from "../../interface";

export class UpdateBrandCommandHandler implements ICommandHandler<UpdateCommand, boolean> {
  constructor(private readonly repository: IBrandRepository) { }

  async execute(cmd: UpdateCommand): Promise<boolean> {
    const category = await this.repository.get(cmd.id);
    if (!category || category.status === ModelStatus.DELETED) {
      throw ErrorDataNotFound;
    }
    return await this.repository.update(cmd.id, cmd.dto);
  }
}