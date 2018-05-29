import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { fetchNavigationCategories } from "../utils/fetchUtils";
import { validateLanguageParam } from "../utils/validateParamsUtils";

const router = express.Router();

router.get(
  "",
  [
    /* Validate input */
    validateLanguageParam(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string | undefined = req.query.lang;

    fetchNavigationCategories(lang)
      .then((navigationCategories) => res.send(navigationCategories))
      .catch((err) => next(err));
  },
);

export default router;
