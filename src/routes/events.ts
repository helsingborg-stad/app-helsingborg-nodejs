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
  [validateLanguageParam(), validateUserGroupIdParam()],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const userGroupId: number = req.query.userGroupId;
    // Right now the API doesn't support anything other than 'sv'
    // const lang: string | undefined = req.query.lang;
    const lang = "sv";
    const dateStart: string | undefined = req.query.dateStart;
    const dateEnd: string | undefined = req.query.dateEnd;
    const page: string | undefined = req.query.page;
    const perPage: string | undefined = req.query.perPage || "100";

    fetchEvents(userGroupId, lang, dateStart, dateEnd, page, perPage)
      .then(events => res.send(events))
      .catch(err => next(err));
  }
);

export default router;
