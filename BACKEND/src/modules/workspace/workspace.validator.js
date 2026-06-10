import { body } from "express-validator";
export const createWorkspaceValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Workspace name is required")
      .isLength({ min: 3 })
      .withMessage("Workspace name must be atleast 3 characters long"),
  ];
};

export const addMemberValidator = () => {
  return [
    body("memberId")
      .trim()
      .notEmpty()
      .withMessage("Member email is required")
      .isEmail()
      .withMessage("Invalid member email"),
  ];
};

export const removeMemberValidator = () => {
  return [
    body("member")
      .trim()
      .notEmpty()
      .withMessage("Member id is required")
      .isMongoId()
      .withMessage("Invalid member id"),
  ];
};
