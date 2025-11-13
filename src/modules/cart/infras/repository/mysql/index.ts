import { UpdateCartItemDTO } from "../../../model/index";
import { CartItem } from "../../../model/index";
import { CartItemCondDTO } from "../../../model/index";
import { Sequelize } from "sequelize";

import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/sequelize";

export class MySQLCartRepository extends BaseRepositorySequelize<CartItem, CartItemCondDTO, UpdateCartItemDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLCartQueryRepository(sequelize, modelName),
      new MYSQLCartCommandRepository(sequelize, modelName),
    );
  }
  
  async listItems(userId: string): Promise<Array<CartItem> | null> {
    return (this.queryRepo as MYSQLCartQueryRepository).listItems(userId);
  }

  async updateMany(dtos: UpdateCartItemDTO[], requesterId: string): Promise<boolean> {
    return (this.cmdRepo as MYSQLCartCommandRepository).updateMany(dtos, requesterId);
  }
}

export class MYSQLCartQueryRepository extends BaseQueryRepositorySequelize<CartItem, CartItemCondDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

  async listItems(userId: string): Promise<Array<CartItem> | null> {
    const items = await this.sequelize.models[this.modelName].findAll({ where: { userId } });

    return items.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { created_at, updated_at, ...props } = persistenceData;

      return {
        ...props,
        createdAt: persistenceData.created_at,
        updatedAt: persistenceData.updated_at,
      } as CartItem;
    });
  }
}

export class MYSQLCartCommandRepository extends BaseCommandRepositorySequelize<CartItem, UpdateCartItemDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

   async updateMany(dtos: UpdateCartItemDTO[], requesterId: string): Promise<boolean> {
    await this.sequelize.transaction(async t => {
      for (let i = 0; i < dtos.length; i++){
        const {productId, attribute, quantity} = dtos[i];
        await this.sequelize.models[this.modelName].update(
          {quantity},
          {where: {productId, userId: requesterId, attribute}, transaction: t}
        )
      }
      return true;
    })
    return true;
  }
} 