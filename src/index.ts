import 'module-alias/register';
import express, { Express, Request, Response, type NextFunction } from "express";
import { config } from "@share/component/config";
import { sequelize } from "@share/component/sequelize";
import morgan from "morgan";

import { setupCategoryHexagon } from "@modules/category/index";
import { setupBrandHexagon } from "@modules/brand/index";
import { setupProductHexagon } from '@modules/product/index';
import { setupUserHexagon } from '@modules/user/index';
import { TokenIntrospectRPCClient } from "@share/repository/verify-token.rpc";
import { setupMiddlewares } from './share/middleware';
import type { ApplicationContext } from './share/interface/middleware.interface';
import { responseErr } from './share/app-error';
import { setupCartHexagon } from './modules/cart';

// Initialize Express app
const app: Express = express();

// Middleware
app.use(express.json()); // xử lý JSON body
app.use(express.urlencoded({ extended: true })); // xử lý form-data
app.use(morgan('dev'));

const introspector = new TokenIntrospectRPCClient(config.verify_token_url);
const appContext: ApplicationContext = { middlewareFactory: setupMiddlewares(introspector),};

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello 200Lab!");
});

app.use("/v1", setupCategoryHexagon(sequelize, appContext));
app.use("/v1", setupBrandHexagon(sequelize, appContext));
app.use("/v1", setupProductHexagon(sequelize, appContext));
app.use("/v1", setupUserHexagon(sequelize, appContext));
app.use("/v1", setupCartHexagon(sequelize, appContext))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  responseErr(err, res);
  return next();
});

// database connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const port = parseInt(config.port);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:");
    process.exit(1);
  }
};

// Execute 
startServer();