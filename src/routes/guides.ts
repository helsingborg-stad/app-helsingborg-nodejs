import express, { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator/check";
import { cache } from "../middleware/cache";
import { fetchAllGuides, fetchGuide } from "../utils/fetchUtils";
import {
  validateGuideGroupIdParam,
  validateIncludeParam,
  validateLanguageParam,
  validateUserGroupIdParam,
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
    const userGroupId: number | undefined = req.query["group-id"];
    const include: string[] | undefined = req.query.include;

    const guideGroupId: number | undefined = req.query.guideGroupId;

    fetchAllGuides(include, lang, userGroupId, guideGroupId)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  },
);

router.get(
  "/:id",
  [validateLanguageParam(), validateUserGroupIdParam(), param("id")],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string | undefined = req.query.lang;
    const userGroupId: number | undefined = req.query["group-id"];
    const id: string = req.params.id;

    fetchGuide(id, lang, userGroupId)
      .then((guide) => res.send(guide))
      .catch((err) => next(err));
  },
);

export default router;
