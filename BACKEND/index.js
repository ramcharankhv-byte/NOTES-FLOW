import dotenv from "dotenv";
import { logger } from "./src/config/logger.js";
dotenv.config();

import connectDB from "./src/db/index.js";

import app from "./app.js";

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`server running at  http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("error occured ", err);
  });
