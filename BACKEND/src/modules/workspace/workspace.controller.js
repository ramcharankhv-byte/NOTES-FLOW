import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/api-response.js";

import {
  createWorkspaceService,
  getWorkspaceService,
  addMemberService,
  leaveWorkspaceService,
  removeMemberService,
  deleteWorkspaceService,
  getUserWorkspacesService,
  searchWorkspacesService,
} from "./workspace.service.js";

const createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await createWorkspaceService({
    name: req.body.name,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { workspace }, "workspace created successfully"),
    );
});

const getWorkSpace = asyncHandler(async (req, res) => {
  const workspace = await getWorkspaceService({
    workspaceId: req.params.workspaceId,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { workspace }, "workspace fetched"));
});

const addMember = asyncHandler(async (req, res) => {
  await addMemberService({
    workspaceId: req.params.workspaceId,
    email: req.body.memberId,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Member added to workspace"));
});

const leaveWorkspace = asyncHandler(async (req, res) => {
  await leaveWorkspaceService({
    workspaceId: req.params.workspaceId,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, {}, "workspace left"));
});

const removeMember = asyncHandler(async (req, res) => {
  await removeMemberService({
    workspaceId: req.params.workspaceId,
    memberId: req.body.member,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Member removed"));
});

const deleteWorkSpace = asyncHandler(async (req, res) => {
  await deleteWorkspaceService({
    workspaceId: req.params.workspaceId,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Workspace deleted"));
});

const getUserWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await getUserWorkspacesService({
    userId: req.user._id,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
});

const searchWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await searchWorkspacesService({
    userId: req.user._id,
    query: req.query.query || "",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
});

export {
  createWorkspace,
  getWorkSpace,
  addMember,
  leaveWorkspace,
  removeMember,
  deleteWorkSpace,
  getUserWorkspaces,
  searchWorkspaces,
};
