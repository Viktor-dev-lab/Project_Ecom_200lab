import { DataTypes, Model, Sequelize } from "sequelize";
import type { ModelStatus } from "../../../../share/model/base-model";

export class BrandModel extends Model {
  declare id: string;
  declare name: string;
  declare status: ModelStatus;
  declare image?: string | null;
  declare description?: string | null;
  declare tag_line?: string | null;
  declare createdAt: Date;  
  declare updatedAt: Date;
}

export const modelName = "Brand";

export function init(sequelize: Sequelize) {
  BrandModel.init(
    {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      tag_line: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: "tag_line",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "deleted"),
        allowNull: false,
        defaultValue: "active",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: modelName,
      tableName: "brands",
      timestamps: true,
    }
  );
}
