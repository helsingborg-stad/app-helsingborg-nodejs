const { Validator } = require('jsonschema');

const v = new Validator();

const guideGroup = require('../json-schemas/guideGroup');
const location = require('../json-schemas/location');
const images = require('../json-schemas/images');
const openingHour = require('../json-schemas/openingHour');

v.addSchema(guideGroup, '/guideGroup');
v.addSchema(location, '/location');
v.addSchema(images, '/images');
v.addSchema(openingHour, '/openingHour');

module.exports = {
  validate: (data, schema) => {
    const result = v.validate(data, schema, { throwError: true });
    return result.valid;
  },
};
