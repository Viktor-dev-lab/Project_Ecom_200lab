import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryStatus } from '../../model/model';

export class CategoryModel extends Model {
  declare id: string;
  declare name: string;
  declare status: CategoryStatus;
  declare image?: string;
  declare description?: string;
  declare parentId?: string;
  declare created_at: Date;
  declare updated_at: Date;
}

export const modelName = "Category";

export function init(sequelize: Sequelize) {
  CategoryModel.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      parentId: {
        type: DataTypes.STRING,
        field: "parent_id",
        allowNull: true,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive", "deleted"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "categories",
    }
  );
}