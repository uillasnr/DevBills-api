import express, { json } from "express";
import { routes } from "./routes";
import "dotenv/config";
import { setupMongo } from "./database/mongo";
import { errorHandler } from "./middleware/error-handler.middleware";
import cors from "cors";

setupMongo().then(() => {
  const app = express();
  
  //.env e dividir em um array
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use(json());
  app.use(routes);
  app.use(errorHandler);

  app.listen(3333, () => console.log("🚀 App is running at port 3333! 🚀"));
});
