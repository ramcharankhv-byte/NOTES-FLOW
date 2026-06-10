import mongoose from "mongoose";
import { logger } from "../config/logger.js";

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("DATABASE CONNECTED SUCCESSFULLY ✅");
  } catch (err) {
    logger.error("Error Connecting Database ❌", err);
    process.exit(1);
  }
};

export default connectDB;
