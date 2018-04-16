const tv4 = require('tv4');
const schemaGuideGroup = require('../json-schemas/guideGroup');
const locationSchema = require('../json-schemas/location');

tv4.addSchema('guideGroup', schemaGuideGroup);
tv4.addSchema('location', locationSchema);

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
