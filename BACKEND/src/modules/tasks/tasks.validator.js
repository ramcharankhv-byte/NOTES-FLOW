import { body } from "express-validator";
export const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ min: 3 })
      .withMessage("Task title must be atleast 3 characters long"),

    body("assignedTo")
      .trim()
      .notEmpty()
      .withMessage("Assigned user is required")
      .isMongoId()
      .withMessage("Invalid user id"),
  ];
};

export const updateTaskStatusValidator = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Invalid task status"),
  ];
};

export const assignTaskValidator = () => {
  return [
    body("assignedTo")
      .trim()
      .notEmpty()
      .withMessage("Assigned user is required")
      .isMongoId()
      .withMessage("Invalid user id"),
  ];
};
