const tv4 = require('tv4');
const giudeGroup = require('../json-schemas/guideGroup');
const location = require('../json-schemas/location');
const images = require('../json-schemas/images');

tv4.addSchema('guideGroup', giudeGroup);
tv4.addSchema('location', location);
tv4.addSchema('images', images);

module.exports = {
  validate: (data, schema) => {
    const result = tv4.validate(data, schema);
    if (tv4.missing.length > 0) {
      throw new Error(`Missing schema for ${tv4.missing}`);
    }

    if (!result) throw new Error(tv4.error);

    return result;
  },
};
