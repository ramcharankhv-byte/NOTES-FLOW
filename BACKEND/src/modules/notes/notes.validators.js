import { body } from "express-validator";

export const createNoteValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content required"),
  ];
};
export const updateNoteValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),

    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Content cannot be empty"),
  ];
};
