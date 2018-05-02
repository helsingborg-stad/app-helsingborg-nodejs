import { check, ValidationChain } from "express-validator/check";

export function validateLanguageParam(): ValidationChain {
  return check("lang")
    .isString()
    .not()
    .isInt()
    .optional();
}
