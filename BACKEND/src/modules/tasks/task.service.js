import { Task } from "./task.model.js";
import { Workspace } from "../workspace/workspace.model.js";
import { User } from "../auth/auth.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";

const createTaskService = async ({
  title,
  assignedTo,
  workspaceId,
  userId,
}) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the workspace owner can create tasks");
  }

  const assignedUser = await User.findById(assignedTo);

  if (!assignedUser) {
    throw new ApiError(404, "Assigned user not found");
  }

  const isMember = workspace.members.some(
    (member) => member.toString() === assignedTo.toString(),
  );

  if (!isMember) {
    throw new ApiError(400, "User is not part of workspace");
  }

  return await Task.create({
    title,
    status: "pending",
    workspace: workspaceId,
    assignedTo,
    assignedBy: userId,
  });
};

const getWorkspaceTasksService = async ({ workspaceId, userId }) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const isOwner = workspace.owner.toString() === userId.toString();

  const query = {
    workspace: workspaceId,
  };

  if (!isOwner) {
    query.assignedTo = userId;
  }

  return await Task.find(query)
    .sort({ createdAt: -1 })
    .populate("assignedTo", "username email");
};

const updateTaskStatusService = async ({ taskId, status, userId }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const allowedStatuses = ["pending", "in-progress", "completed"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const workspace = await Workspace.findById(task.workspace);

  const isOwner = workspace.owner.toString() === userId.toString();

  const isAssignee = task.assignedTo.toString() === userId.toString();

  if (!isOwner && !isAssignee) {
    throw new ApiError(
      403,
      "Only the workspace owner or assigned user can update this task",
    );
  }

  task.status = status;

  await task.save();

  return task;
};

const assignTaskService = async ({ taskId, assignedTo, userId }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const workspace = await Workspace.findById(task.workspace);

  if (workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Only workspace owner can assign tasks");
  }

  const user = await User.findById(assignedTo);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMember = workspace.members.some(
    (member) => member.toString() === assignedTo.toString(),
  );

  if (!isMember) {
    throw new ApiError(400, "User is not part of workspace");
  }

  task.assignedTo = assignedTo;

  await task.save();

  return task;
};

const deleteTaskService = async ({ taskId, userId }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const workspace = await Workspace.findById(task.workspace);

  if (workspace.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Only workspace owner can delete tasks");
  }

  await task.deleteOne();
};

export {
  createTaskService,
  getWorkspaceTasksService,
  updateTaskStatusService,
  assignTaskService,
  deleteTaskService,
};
