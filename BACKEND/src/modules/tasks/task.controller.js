import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/api-response.js";

import {
  createTaskService,
  getWorkspaceTasksService,
  updateTaskStatusService,
  assignTaskService,
  deleteTaskService,
} from "./task.service.js";

const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService({
    title: req.body.title,
    assignedTo: req.body.assignedTo,
    workspaceId: req.params.workspaceId,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task assigned successfully"));
});

const getWorkspaceTasks = asyncHandler(async (req, res) => {
  const tasks = await getWorkspaceTasksService({
    workspaceId: req.params.workspaceId,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task fetched successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await updateTaskStatusService({
    taskId: req.params.taskId,
    status: req.body.status,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

const assignTask = asyncHandler(async (req, res) => {
  const task = await assignTaskService({
    taskId: req.params.taskId,
    assignedTo: req.body.assignedTo,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task assigned successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  await deleteTaskService({
    taskId: req.params.taskId,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
