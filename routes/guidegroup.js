var express = require("express");
const { fetchProperties } = require("../services/fetchServices");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/property/:id", (req, res, next) => {
  const { id } = req.params;

  fetchProperties(id)
    .then(properties => res.send(properties))
    .catch(err => next(err));
});

module.exports = router;
