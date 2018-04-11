const express = require('express');
const { fetchAllGuideGroups, fetchProperties } = require('../utils/fetchUtils');

const router = express.Router();

router.get('', (req, res, next) => {
  fetchAllGuideGroups()
    .then(guideGroups => res.send(guideGroups))
    .catch(err => next(err));
});

router.get('/property/:id', (req, res, next) => {
  const { id } = req.params;

  fetchProperties(id)
    .then(properties => res.send(properties))
    .catch(err => next(err));
});

module.exports = router;
