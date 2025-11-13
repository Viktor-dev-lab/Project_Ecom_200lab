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
} 