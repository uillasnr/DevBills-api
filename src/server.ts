import express, { json } from "express";
import { routes } from "./routes";
import "dotenv/config";
import { setupMongo } from "./database/mongo";
import { errorHandler } from "./middleware/error-handler.middleware";
import cors from "cors";

setupMongo().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  
  app.use(json());
  app.use(routes);
  app.use(errorHandler);

  app.listen(3333, () => console.log("🚀 App is running at port 3333! 🚀"));
});
