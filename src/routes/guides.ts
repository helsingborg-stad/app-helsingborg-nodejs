import express from "express";
import { fetchAllGuides } from "../utils/fetchUtils";
const logApp = require("debug")("app");

const router = express.Router();

router.get("", (req, res, next) => {
  //TODO add express-validator
  logApp("Router received request");
  const { lang } = req.query;

  fetchAllGuides(lang)
    .then(guideGroups => res.send(guideGroups))
    .catch(err => next(err));
});

export default router;
