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
  return url;
}

export function buildPropertyUrl(lang?: string, id: number): string {
  let url = `${API_HOST_URL}/property?post=${id}`;
  if (lang) {
    url += `&lang=${lang}`;
  }
  return url;
}

export function buildGuideGroupUrl(lang?: string): string {
  let url = `${API_HOST_URL}/guidegroup?_embed`;
  if (lang) {
    url += `&lang=${lang}`;
  }
  return url;
}
