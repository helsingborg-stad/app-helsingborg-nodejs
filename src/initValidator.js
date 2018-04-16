const tv4 = require('tv4');
const schemaGuideGroup = require('./json-schemas/guideGroup');
const locationSchema = require('./json-schemas/location');

module.exports = function init() {
  tv4.addSchema('guideGroup', schemaGuideGroup);
  tv4.addSchema('location', locationSchema);
};
