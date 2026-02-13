import { v7 } from "uuid";
import type { CreateCommand, IBrandRepository} from "../../interface";
import type { Brand } from "../../model/model";
import type { ICommandHandler } from "../../../../share/interface/handler.interface";
import { ModelStatus } from "../../../../share/model/base-model";

export class CreateNewBrandCmdHandler implements ICommandHandler<CreateCommand, string> {
  constructor(private readonly repository: IBrandRepository) {}

  async execute(command: CreateCommand): Promise<string> {
    
    const data = command.cmd;
    const isExist = await this.repository.findByCond({ name: data.name });
    if (isExist) {
      throw new Error('Brand name already exists');
    }

    const newID = v7();
    const Brand: Brand = {
      id: newID,
      name: data.name,
      image: data.image,
      tagline: data.tagline,
      description: data.description,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await this.repository.insert(Brand);
    return newID;
  }
}