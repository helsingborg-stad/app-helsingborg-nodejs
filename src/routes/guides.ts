import express from 'express';
const { fetchAllGuides } = require('../utils/fetchUtils');
const logApp = require('debug')('app');

const router = express.Router();

router.get('', (req, res, next) => {
  logApp('Router received request');
  const { lang } = req.query;

  fetchAllGuides(lang)
    .then(guideGroups => res.send(guideGroups))
    .catch(err => next(err));
});

module.exports = router;
