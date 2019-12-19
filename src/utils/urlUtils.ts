// TODO move to .env
const API_HOST_URL = "https://api.helsingborg.se/event/json/wp/v2";
const LANG_URL = "https://api.helsingborg.se/event/json/pll/v1/languages";

function buildIncludePart(include: string[] | undefined): string {
  if (include && include.length > 0) {
    return (
      "include=" +
      include.reduce((previousValue, currentValue, currentIndex) => {
        if (currentIndex === 0) {
          return currentValue;
        } else {
          return previousValue + "," + currentValue;
        }
      }, "")
    );
  }
  return "";
}

const buildURL = (url: string, parameters: Array<string>) => `${url}?${parameters.filter(s => s && s !== "").join("&")}`;

export function buildGuideUrl(
  include: string[] | undefined,
  lang?: string,
  userGroupId?: number,
  id?: string,
  guideGroupId?: number,
): string {
  let url = `${API_HOST_URL}/guide`;

  if (id) {
    url += `/${id}`;
  }

  const parameters = [];

  /* query params */
  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  if (userGroupId) {
    parameters.push(`group-id=${userGroupId}`);
  }

  if (guideGroupId) {
    parameters.push(`guidegroup=${guideGroupId}`);
  }

  parameters.push("_embed");
  parameters.push(buildIncludePart(include));

  return buildURL(url, parameters);
}

export function buildPropertyUrl(id: number, lang?: string): string {
  let url = `${API_HOST_URL}/property`

  const parameters=[`post=${id}`];

  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  return buildURL(url, parameters);
}

export function buildGuideGroupUrl(
  include: string[] | undefined,
  lang?: string,
): string {
  let url = `${API_HOST_URL}/guidegroup`;

  const parameters = ["_embed"];

  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  parameters.push(buildIncludePart(include));

  return buildURL(url, parameters);
}

export function buildNavigationUrl(lang?: string, userGroupId?: number): string {
  let url = `${API_HOST_URL}/navigation`;

  const parameters = [];

  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  if (userGroupId) {
    parameters.push(`group-id=${userGroupId}`);
  }

  return buildURL(url, parameters);
}

export function buildLanguagesUrl(): string {
  return LANG_URL;
}
