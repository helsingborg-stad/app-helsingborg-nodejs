import debug from "debug";
import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import Cache from "../utils/cacheUtils";
import { fetchNavigationCategories } from "../utils/fetchUtils";
import { validateLanguageParam } from "../utils/validateParamsUtils";

const logApp = debug("app");

const router = express.Router();

router.get(
  "",
  [
    /* Validate input */
    validateLanguageParam(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    validationResult(req).throw();

    const getInfo = async () => {
      try {
        const url: string = req.baseUrl;

        let cachedData: any = null;
        try {
          cachedData = await Cache.get(url);
        } catch (error) {
          // cache miss
          logApp("Failed to get from cache: " + error);
        }

        if (cachedData) {
          res.send(cachedData);
        } else {
          const lang: string | undefined = req.query.lang;

          const navigationCategories = await fetchNavigationCategories(lang);
          Cache.set(url, navigationCategories);
          res.send(navigationCategories);
        }
      } catch (error) {
        next(error);
      }
    };

    getInfo();
  },
);

export default router;
