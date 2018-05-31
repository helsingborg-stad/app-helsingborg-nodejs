// TODO move to .env
const API_HOST_URL = "https://api.helsingborg.se/event/json/wp/v2";

export function buildGuideUrl(lang?: string, id?: string): string {
  let url = `${API_HOST_URL}/guide`;
  if (id) {
    url += `/${id}`;
  }
  url += "?";

  /* query params */
  if (lang) {
    url += `&lang=${lang}`;
  }
  url += `&_embed`;

  /* count limit */
  url += `&per_page=${50}`;
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

  if (include && include.length > 0) {
    url +=
      "&include=" +
      include.reduce((previousValue, currentValue, currentIndex) => {
        if (currentIndex === 0) {
          return currentValue;
        } else {
          return previousValue + "," + currentValue;
        }
      }, "");
  }

  /* count limit */
  url += `&per_page=${50}`;

  return url;
}

export function buildNavigationUrl(lang?: string): string {
  let url = `${API_HOST_URL}/navigation`;
  if (lang) {
    url += `?lang=${lang}`;
  }
  return url;
}
