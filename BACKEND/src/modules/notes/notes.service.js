import { Note } from "../models/notes.model.js";
import { Workspace } from "../models/workspace.model.js";
import { ApiError } from "../utils/api-error.js";

const checkWorkspaceMembership = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const isMember = workspace.members.some(
    (m) => m.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new ApiError(403, "Unauthorized");
  }

  return workspace;
};

const createNoteService = async ({ workspaceId, title, content, userId }) => {
  await checkWorkspaceMembership(workspaceId, userId);

  return await Note.create({
    title,
    content,
    workspace: workspaceId,
    createdBy: userId,
  });
};

const getWorkspaceNotesService = async ({
  workspaceId,
  userId,
  page,
  limit,
}) => {
  await checkWorkspaceMembership(workspaceId, userId);

  const skip = (page - 1) * limit;

  return await Note.find({
    workspace: workspaceId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const updateNoteService = async ({ noteId, title, content, userId }) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const workspace = await Workspace.findById(note.workspace);

  const isMember = workspace?.members.some(
    (m) => m.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new ApiError(
      403,
      "Unauthorized: You must be a workspace member to update notes",
    );
  }

  if (title) note.title = title;
  if (content) note.content = content;

  await note.save();

  return note;
};

const deleteNoteService = async ({ noteId, userId }) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const workspace = await Workspace.findById(note.workspace);

  const isCreator = note.createdBy.toString() === userId.toString();

  const isOwner = workspace?.owner.toString() === userId.toString();

  if (!isCreator && !isOwner) {
    throw new ApiError(
      403,
      "Unauthorized: Only creator or workspace owner can delete notes",
    );
  }

  await note.deleteOne();
};

const searchNotesService = async ({ workspaceId, query, userId }) => {
  await checkWorkspaceMembership(workspaceId, userId);

  return await Note.find({
    workspace: workspaceId,
    title: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });
};

export {
  createNoteService,
  getWorkspaceNotesService,
  updateNoteService,
  deleteNoteService,
  searchNotesService,
};
