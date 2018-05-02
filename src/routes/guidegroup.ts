import express, { NextFunction, Request, Response } from "express";
import { check, query, validationResult } from "express-validator/check";
import { fetchAllGuideGroups, fetchProperties } from "../utils/fetchUtils";

const router = express.Router();

router.get(
  "",
  [
    /* Validate input */
    query("lang")
    .isString()
    .not().isInt(),
  ],
(req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const lang: string = req.query.lang;

    fetchAllGuideGroups(lang)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  };
)

router.get("/property/:id", (req, res, next) => {
  // TODO add express-validator
  const { id } = req.params;

  fetchProperties(id)
    .then((properties) => res.send(properties))
    .catch((err) => next(err));
});

export default router;
