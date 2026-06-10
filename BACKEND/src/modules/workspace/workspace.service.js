import { Workspace } from "./workspace.model.js";
import { User } from "../auth/auth.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";

const createWorkspaceService = async ({ name, userId }) => {
  if (!name) {
    throw new ApiError(400, "Name not found");
  }

  const workspace = await Workspace.create({
    name,
    owner: userId,
    members: [userId],
  });

  const createdWorkspace = await Workspace.findById(workspace._id)
    .populate("owner", "username email")
    .populate("members", "username email");

  if (!createdWorkspace) {
    throw new ApiError(404, "Workspace Not Found");
  }

  return createdWorkspace;
};

const getWorkspaceService = async ({ workspaceId, userId }) => {
  const workspace = await Workspace.findById(workspaceId)
    .populate("owner", "username email")
    .populate("members", "username email");

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const isMember = workspace.members.some(
    (member) => member._id.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new ApiError(403, "Unauthorized");
  }

  return workspace;
};

const addMemberService = async ({ workspaceId, email, userId }) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const userToAdd = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!userToAdd) {
    throw new ApiError(404, "No user found with this email address");
  }

  const memberExists = workspace.members.some(
    (member) => member.toString() === userToAdd._id.toString(),
  );

  if (memberExists) {
    throw new ApiError(400, "Member already exists in this workspace");
  }

  workspace.members.push(userToAdd._id);

  await workspace.save();

  return workspace;
};

const leaveWorkspaceService = async ({ workspaceId, userId }) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const memberExists = workspace.members.some(
    (member) => member.toString() === userId.toString(),
  );

  if (!memberExists) {
    throw new ApiError(404, "Member not found in workspace");
  }

  if (workspace.owner.toString() === userId.toString()) {
    throw new ApiError(400, "Owner cannot leave workspace");
  }

  workspace.members.pull(userId);

  await workspace.save();
};

const removeMemberService = async ({ workspaceId, memberId, userId }) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const memberExists = workspace.members.some(
    (member) => member.toString() === memberId.toString(),
  );

  if (!memberExists) {
    throw new ApiError(404, "Member does not exist");
  }

  if (workspace.owner.toString() === memberId.toString()) {
    throw new ApiError(400, "Owner cannot be removed");
  }

  workspace.members.pull(memberId);

  await workspace.save();
};

const deleteWorkspaceService = async ({ workspaceId, userId }) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    owner: userId,
  });

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  await workspace.deleteOne();
};

const getUserWorkspacesService = async ({ userId, page, limit }) => {
  const skip = (page - 1) * limit;

  return await Workspace.find({
    members: userId,
  })
    .populate("owner", "username email")
    .populate("members", "username email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const searchWorkspacesService = async ({ userId, query }) => {
  return await Workspace.find({
    members: userId,
    name: {
      $regex: query,
      $options: "i",
    },
  })
    .populate("owner", "username email")
    .populate("members", "username email")
    .sort({ createdAt: -1 });
};

export {
  createWorkspaceService,
  getWorkspaceService,
  addMemberService,
  leaveWorkspaceService,
  removeMemberService,
  deleteWorkspaceService,
  getUserWorkspacesService,
  searchWorkspacesService,
};
