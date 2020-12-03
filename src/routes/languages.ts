import debug from "debug";
import express, { NextFunction, Request, Response } from "express";
import { cache } from "../middleware/cache";
import { fetchLanguages } from "../utils/fetchUtils";

const logApp = debug("app");

const router = express.Router();
router.use(cache);

router.get("", (req: Request, res: Response, next: NextFunction) => {
  logApp(req.path);

  fetchLanguages()
    .then(languages => {
      res.send(languages);
    })
    .catch(error => next(error));
});

export default router;
