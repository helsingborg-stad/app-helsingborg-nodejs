// TODO move to .env
const API_HOST_URL = "https://api.helsingborg.se/event/json/wp/v2";
const LANG_URL = "https://api.helsingborg.se/event/json/pll/v1/languages";

function buildIncludePart(include: string[] | undefined): string {
  if (include && include.length > 0) {
    return (
      "&include=" +
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
  url += "?";

  /* query params */
  if (lang) {
    url += `lang=${lang}`;
  }

  if (guideGroupId) {
    url += "&guidegroup=" + guideGroupId;
  }

  url += `&_embed`;

  url += buildIncludePart(include);
  return url;
}

export function buildPropertyUrl(id: number, lang?: string): string {
  let url = `${API_HOST_URL}/property?post=${id}`;
  if (lang) {
    url += `&lang=${lang}`;
  }
  return url;
}

export function buildGuideGroupUrl(
  include: string[] | undefined,
  lang?: string,
): string {
  let url = `${API_HOST_URL}/guidegroup?_embed`;
  if (lang) {
    url += `&lang=${lang}`;
  }

  url += buildIncludePart(include);

  return url;
}

export function buildNavigationUrl(lang?: string): string {
  let url = `${API_HOST_URL}/navigation`;
  if (lang) {
    url += `?lang=${lang}`;
  }
  return url;
}

export function buildLanguagesUrl(): string {
  return LANG_URL;
}
