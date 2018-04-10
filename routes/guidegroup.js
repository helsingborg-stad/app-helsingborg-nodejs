var express = require("express");
const { fetchProperties } = require("../services/fetchServices");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/property", (req, res) => {
  //TODO make use of the ID param
  const { id } = req.params;

  fetchProperties(7986)
    .then(properties => res.send(properties))
    .catch(err => console.log("Error:", err));
});

module.exports = router;
