const API_HOST_URL = process.env.API_HOST_URL;
const LANG_URL = process.env.LANG_URL || "";

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

  if (guideGroupId) {
    parameters.push(`guidegroup=${guideGroupId}`);
  }

  parameters.push("_embed");
  parameters.push(buildIncludePart(include));

  return buildURL(url, parameters);
}

export function buildPropertyUrl(id: number, lang?: string): string {
  const url = `${API_HOST_URL}/property`

  const parameters = [`post=${id}`];

  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  return buildURL(url, parameters);
}

export function buildGuideGroupUrl(
  include: string[] | undefined,
  lang?: string,
): string {
  const url = `${API_HOST_URL}/guidegroup`;

  const parameters = ["_embed"];

  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  parameters.push(buildIncludePart(include));

  return buildURL(url, parameters);
}

export function buildNavigationUrl(userGroupId: number, lang?: string): string {
  const url = `${API_HOST_URL}/navigation`;

  const parameters = [];

  parameters.push(`group-id=${userGroupId}`);

  if (lang) {
    parameters.push(`lang=${lang}`);
  }

  return buildURL(url, parameters);
}

export function buildLanguagesUrl(): string {
  return LANG_URL;
}
