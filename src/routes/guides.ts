import express, { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator/check";
import { cache } from "../middleware/cache";
import { fetchAllGuides, fetchGuide } from "../utils/fetchUtils";
import { validateLanguageParam } from "../utils/validateParamsUtils";

const router = express.Router();
router.use(cache);

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

router.get(
  "/:id",
  [validateLanguageParam(), param("id")],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const { lang } = req.query;
    const { id } = req.params;

    fetchGuide(lang, id)
      .then((guide) => res.send(guide))
      .catch((err) => next(err));
  },
);

export default router;
