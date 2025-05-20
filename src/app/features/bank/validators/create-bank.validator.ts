import { check } from "express-validator";
import { validate } from "../../../shared/middlewares/validate.middleware";

export const createBankValidator = [
  check("value")
    .not()
    .isEmpty()
    .withMessage("Bank value is required.")
    .isString()
    .withMessage("Bank value must be a string"),
  validate,
];
