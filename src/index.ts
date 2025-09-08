import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import { setupCategoryModule } from "./modules/category/index";
import { sequelize } from "./share/component/sequelize";

// Load environment variables
config();

// Constants
const DEFAULT_PORT = 3000;

// Initialize Express app
const app: Express = express();

// Middleware
app.use(express.json()); // xử lý JSON body
app.use(express.urlencoded({ extended: true })); // xử lý form-data

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello 200Lab!");
});

app.use("/v1", setupCategoryModule(sequelize));

// database connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const port = parseInt(process.env.PORT || `${DEFAULT_PORT}`, 10);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Execute 
startServer();