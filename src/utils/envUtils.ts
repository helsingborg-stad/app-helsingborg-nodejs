
export const API_HOST_URL = "API_HOST_URL";
export const HBG_GROUP_ID = "HBG_GROUP_ID";
export const LANG_URL = "LANG_URL";

const REQUIRED_KEYS = [API_HOST_URL, HBG_GROUP_ID, LANG_URL];

export function checkRequiredKeys(): void {

  REQUIRED_KEYS.forEach((key) => {
    const value = process.env[key];
    if (value === undefined || value === "") {
      throw new Error(`ENV value ${key} required`);
    }
  });
}

export function getEnvAsInt(key: string): number {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`ENV value ${key} required`);
  }

  return parseInt(value, 10);
}
