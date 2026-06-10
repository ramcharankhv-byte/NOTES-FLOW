import { Router } from "express";

import {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
  assignTask,
  deleteTask,
} from "./task.controller.js";

import {
  createTaskValidator,
  updateTaskStatusValidator,
  assignTaskValidator,
} from "./tasks.validator.js";

import { validate } from "../../middleware/validator.middleware.js";
import { verifyJwt } from "../auth/auth.middleware.js";

const taskRouter = Router();

taskRouter.use(verifyJwt);

taskRouter
  .route("/:workspaceId")
  .post(createTaskValidator(), validate, createTask)
  .get(getWorkspaceTasks);

taskRouter
  .route("/:taskId/status")
  .patch(updateTaskStatusValidator(), validate, updateTaskStatus);

taskRouter
  .route("/:taskId/assign")
  .patch(assignTaskValidator(), validate, assignTask);

taskRouter.route("/:taskId").delete(deleteTask);

export default taskRouter;
