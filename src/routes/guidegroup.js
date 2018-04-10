const express = require('express');
const { fetchProperties } = require('../utils/fetchUtils');

const router = express.Router();

router.get('/property/:id', (req, res, next) => {
  const { id } = req.params;

  fetchProperties(id)
    .then(properties => res.send(properties))
    .catch(err => next(err));
});

module.exports = router;
