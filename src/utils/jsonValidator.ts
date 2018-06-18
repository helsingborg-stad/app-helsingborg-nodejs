import Ajv from "ajv";

import jsonSchema = require("ajv/lib/refs/json-schema-draft-06.json");
import beacon from "../../json-schemas/IBeacon.json";
import contentObject from "../../json-schemas/IContentObject.json";
import guide from "../../json-schemas/IGuide.json";
import guideGroup from "../../json-schemas/IGuideGroup.json";
import language from "../../json-schemas/ILanguage.json";
import link from "../../json-schemas/ILink.json";
import location from "../../json-schemas/ILocation.json";
import mediaContent from "../../json-schemas/IMediaContent.json";
import navigationCategory from "../../json-schemas/INavigationCategory.json";
import navigationItem from "../../json-schemas/INavigationItem.json";
import pointProperty from "../../json-schemas/IPointProperty.json";
import position from "../../json-schemas/IPosition.json";

const options: Ajv.Options = { verbose: true };
const ajv = new Ajv(options);

ajv.addMetaSchema(jsonSchema);

// Add schemas
ajv.addSchema(guideGroup, "IGuideGroup");
ajv.addSchema(pointProperty, "IPointProperty");
ajv.addSchema(guide, "IGuide");
ajv.addSchema(language, "ILanguage");
ajv.addSchema(mediaContent, "IMediaContent");
ajv.addSchema(navigationCategory, "INavigationCategory");
ajv.addSchema(navigationItem, "INavigationItem");
ajv.addSchema(contentObject, "IContentObject");
ajv.addSchema(link, "ILink");
ajv.addSchema(beacon, "IBeacon");
ajv.addSchema(position, "IPosition");
ajv.addSchema(location, "ILocation");

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
