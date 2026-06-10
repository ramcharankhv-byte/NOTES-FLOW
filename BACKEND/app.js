import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./src/modules/auth/auth.route.js";
import taskRouter from "./src/modules/tasks/task.route.js";
import noteRouter from "./src/modules/notes/notes.route.js";
import workSpaceRouter from "./src/modules/workspace/workspace.route.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";

import { secureHeaders } from "./src/config/security.js";
import { limiter } from "./src/middleware/rate-limiter.js";
import { httpLogger } from "./src/middleware/logger.middleware.js";

const app = express();

app.use(secureHeaders);
app.use(limiter);
app.use(httpLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Parse CORS_ORIGIN environment variable (comma-separated for multiple origins)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/workspaces", workSpaceRouter);

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
