import express, { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { fetchAllGuideGroups, fetchProperties } from "../utils/fetchUtils";

const router = express.Router();

router.get(
  "",
  [
    /* Validate input */
    check("lang")
      .isString()
      .not()
      .isInt()
      .optional(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const lang: string = req.query.lang;

    fetchAllGuideGroups(lang)
      .then((guideGroups) => res.send(guideGroups))
      .catch((err) => next(err));
  },
);

router.get(
  "/property/:id",
  [
    /* Validate input */
    check("id").isInt(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const { id } = req.params;

    fetchProperties(id)
      .then((properties) => res.send(properties))
      .catch((err) => next(err));
  },
);

export default router;
