import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || "",
  username: process.env.DB_USERNAME || "",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "",
  port: parseInt(process.env.DB_PORT as string),
  dialect: "mysql",
  pool: {
    max: 20,       // Số lượng kết nối tối đa trong pool
    min: 2,        // Số lượng kết nối tối thiểu trong pool
    acquire: 30000, // Thời gian tối đa (miligiây) để cố gắng mở một kết nối trước khi báo lỗi
    idle: 60000,   // Thời gian tối đa (miligiây) giữ một kết nối trước khi bị đóng
  },
  logging: true,
});

