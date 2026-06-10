import { body } from "express-validator";

export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be of lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters long"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};
export const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};
