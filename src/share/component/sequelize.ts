import { config } from "@share/component/config";
import { Sequelize } from "sequelize";



export const sequelize = new Sequelize(config.mysql);

