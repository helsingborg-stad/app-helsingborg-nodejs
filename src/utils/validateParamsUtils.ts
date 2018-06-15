import { check, ValidationChain } from "express-validator/check";

export function validateLanguageParam(): ValidationChain {
  return check("lang", "lang should be a string")
    .isString()
    .not()
    .isInt()
    .optional();
}

export function validateIncludeParam(): ValidationChain {
  return check("include", "include param should be an array")
    .customSanitizer((value) => {
      return value.split(",");
    })
    .isArray()
    .optional();
}

export function validateGuideGroupIdParam(): ValidationChain {
  return check("guideGroupId", "guideGroupId should be an integer")
    .isNumeric()
    .optional();
}
