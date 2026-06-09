import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/api-response.js";

import {
  createNoteService,
  getWorkspaceNotesService,
  updateNoteService,
  deleteNoteService,
  searchNotesService,
} from "../services/notes.service.js";

const createNote = asyncHandler(async (req, res) => {
  const note = await createNoteService({
    workspaceId: req.params.workspaceId,
    title: req.body.title,
    content: req.body.content,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

const getWorkspaceNotes = asyncHandler(async (req, res) => {
  const notes = await getWorkspaceNotesService({
    workspaceId: req.params.workspaceId,
    userId: req.user._id,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await updateNoteService({
    noteId: req.params.noteId,
    title: req.body.title,
    content: req.body.content,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  await deleteNoteService({
    noteId: req.params.noteId,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

const searchNotes = asyncHandler(async (req, res) => {
  const notes = await searchNotesService({
    workspaceId: req.params.workspaceId,
    query: req.query.query || "",
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export { createNote, getWorkspaceNotes, updateNote, deleteNote, searchNotes };
