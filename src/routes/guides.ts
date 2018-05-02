import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { fetchAllGuides } from "../utils/fetchUtils";
import { validateLanguageParam } from "../utils/validateParamsUtils";

const router = express.Router();

router.get(
  "",
  [validateLanguageParam()],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const { lang } = req.query;

    fetchAllGuides(lang)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  },
);

export default router;
