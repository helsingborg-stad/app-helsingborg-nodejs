const { Validator } = require("jsonschema");

import guideGroup from "../../json-schemas/guideGroup.json";
import images from "../../json-schemas/images.json";
import location from "../../json-schemas/location.json";
import openingHour from "../../json-schemas/openingHour.json";

const v = new Validator();
v.addSchema(guideGroup, "/guideGroup");
v.addSchema(location, "/location");
v.addSchema(images, "/images");
v.addSchema(openingHour, "/openingHour");

export function validate(data: any, schema: any): boolean {
  const result = v.validate(data, schema, { throwError: true });
  return result.valid;
}

export default { validate };
