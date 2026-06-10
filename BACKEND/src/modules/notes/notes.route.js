import { Router } from "express";

import {
  createNote,
  getWorkspaceNotes,
  updateNote,
  deleteNote,
  searchNotes,
} from "./note.controller.js";

import { validate } from "../../middleware/validator.middleware.js";
import { verifyJwt } from "../auth/auth.middleware.js";

import {
  createNoteValidator,
  updateNoteValidator,
} from "./notes.validators.js";

const noteRouter = Router();

noteRouter
  .route("/:workspaceId")
  .post(verifyJwt, createNoteValidator(), validate, createNote);

noteRouter.route("/:workspaceId").get(verifyJwt, getWorkspaceNotes);

noteRouter
  .route("/:noteId")
  .patch(verifyJwt, updateNoteValidator(), validate, updateNote);

noteRouter.route("/:noteId").delete(verifyJwt, deleteNote);

noteRouter.route("/:workspaceId/search").get(verifyJwt, searchNotes);

export default noteRouter;
