import express, { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator/check";
import { cache } from "../middleware/cache";
import { fetchAllInteractiveGuides, fetchInteractiveGuide } from "../utils/fetchUtils";
import {
  validateGuideGroupIdParam,
  validateIncludeParam,
  validateLanguageParam,
} from "../utils/validateParamsUtils";

const router = express.Router();
router.use(cache);

router.get(
  "",
  [
    validateLanguageParam(),
    validateGuideGroupIdParam(),
    validateIncludeParam(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string | undefined = req.query.lang;
    const include: string[] | undefined = req.query.include;

    const guideGroupId: number | undefined = req.query.guideGroupId;

    fetchAllInteractiveGuides(include, lang, guideGroupId)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  },
);

router.get(
  "/:id",
  [validateLanguageParam(), param("id")],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string | undefined = req.query.lang;
    const id: string = req.params.id;

    fetchInteractiveGuide(id, lang)
      .then((guide) => res.send(guide))
      .catch((err) => next(err));
  },
);

export default router;
