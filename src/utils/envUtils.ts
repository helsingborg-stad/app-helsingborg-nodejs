
export const HBG_GROUP_ID = "HBG_GROUP_ID";

export function getEnvAsInt(key: string): number {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`ENV value ${key} required`);
  }

  return parseInt(value, 10);
}
