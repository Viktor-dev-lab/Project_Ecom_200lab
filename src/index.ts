import express, { Express, Request, Response } from "express";
import { config } from 'dotenv';
import { setupCategoryModule } from './modules/category/index';

config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json()); // xử lý JSON body
app.use(express.urlencoded({ extended: true })); // xử lý form-data

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript + Express!");
});

app.use('api/v1', setupCategoryModule());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


