import Ajv from "ajv";

import jsonSchema = require("ajv/lib/refs/json-schema-draft-06.json");
import guideGroup from "../../json-schemas/guideGroup.json";
import pointProperty from "../../json-schemas/pointProperty.json";

const options: Ajv.Options = { verbose: true };
const ajv = new Ajv(options);

ajv.addMetaSchema(jsonSchema);

// Add schemas
ajv.addSchema(guideGroup, "guideGroup");
ajv.addSchema(pointProperty, "pointProperty");

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
