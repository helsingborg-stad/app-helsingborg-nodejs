import Ajv from "ajv";

import guideGroup from "../../json-schemas/guideGroup.json";

const options: Ajv.Options = { verbose: true };
const ajv = new Ajv(options);

ajv.addSchema(guideGroup, "guideGroup");

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
