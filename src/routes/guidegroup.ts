import express, { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { fetchAllGuideGroups, fetchProperties } from "../utils/fetchUtils";
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

    fetchAllGuideGroups(lang)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  },
);

export default router;
