import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { cache } from "../middleware/cache";
import { fetchNavigationCategories } from "../utils/fetchUtils";
import { validateLanguageParam, validateUserGroupIdParam } from "../utils/validateParamsUtils";

const router = express.Router();

router.use(cache);

router.get(
  "",
  [
    /* Validate input */
    validateLanguageParam(),
    validateUserGroupIdParam(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string | undefined = req.query.lang;
    const userGroupId: number | undefined = req.query["group-id"];

    fetchNavigationCategories(lang, userGroupId)
      .then((navigationCategories) => {
        res.send(navigationCategories);
      })
      .catch((error) => next(error));
  },
);

export default router;
