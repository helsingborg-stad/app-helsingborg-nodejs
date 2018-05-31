import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { cache } from "../middleware/cache";
import { fetchAllGuideGroups } from "../utils/fetchUtils";
import {
  validateIncludeParam,
  validateLanguageParam,
} from "../utils/validateParamsUtils";

const router = express.Router();
router.use(cache);

router.get(
  "",
  [
    /* Validate input */
    validateLanguageParam(),
    validateIncludeParam(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string | undefined = req.query.lang;
    const include: string[] | undefined = req.query.include;

    fetchAllGuideGroups(include, lang)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  },
);

export default router;
