import express from 'express';
const { fetchAllGuideGroups, fetchProperties } = require('../utils/fetchUtils');

const router = express.Router();

router.get('', (req, res, next) => {
  //TODO add express-validator
  //const { lang } = req.query;
  const lang : string = req.query.lang;

  fetchAllGuideGroups(lang)
    .then(guideGroups => res.send(guideGroups))
    .catch(err => next(err));
});

router.get('/property/:id', (req, res, next) => {
  //TODO add express-validator
  const { id } = req.params;

  fetchProperties(id)
    .then(properties => res.send(properties))
    .catch(err => next(err));
});

module.exports = router;
