import Ajv from "ajv";

import jsonSchema = require("ajv/lib/refs/json-schema-draft-06.json");
import beacon from "../../json-schemas/IBeacon.json";
import contentObject from "../../json-schemas/IContentObject.json";
import guide from "../../json-schemas/IGuide.json";
import guideGroup from "../../json-schemas/IGuideGroup.json";
import link from "../../json-schemas/ILink.json";
import location from "../../json-schemas/ILocation.json";
import mediaContent from "../../json-schemas/IMediaContent.json";
import pointProperty from "../../json-schemas/IPointProperty.json";
import position from "../../json-schemas/IPosition.json";

const options: Ajv.Options = { verbose: true };
const ajv = new Ajv(options);

ajv.addMetaSchema(jsonSchema);

// Add schemas
ajv.addSchema(guideGroup, "guideGroup");
ajv.addSchema(pointProperty, "pointProperty");
ajv.addSchema(guide, "guide");
ajv.addSchema(mediaContent, "mediaContent");
ajv.addSchema(contentObject, "contentObject");
ajv.addSchema(link, "link");
ajv.addSchema(beacon, "beacon");
ajv.addSchema(position, "position");
ajv.addSchema(location, "location");

export function validate(data: any, schema: string): boolean {
  const result = ajv.validate(schema, data);
  if (typeof result === "boolean") {
    if (!result) {
      throw ajv.errors;
    }
    return result;
  }
  return false;
}

export default { validate };
