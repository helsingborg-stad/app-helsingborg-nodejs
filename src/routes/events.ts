import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { cache } from "../middleware/cache";
import { fetchEvents } from "../utils/fetchUtils";
import {
  validateLanguageParam,
  validateUserGroupIdParam,
} from "../utils/validateParamsUtils";

const router = express.Router();
router.use(cache);

router.get(
  "",
  [
    validateLanguageParam(),
    validateUserGroupIdParam(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const userGroupId: number = req.query.userGroupId;
    const lang: string | undefined = req.query.lang;
    const dateStart: string | undefined = req.query.dateStart;
    const dateEnd: string | undefined = req.query.dateEnd;

    fetchEvents(userGroupId, lang, dateStart, dateEnd)
      .then((events) => res.send(events))
      .catch((err) => next(err));
  },
);

export default router;
