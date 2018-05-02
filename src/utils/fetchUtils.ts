import debug from "debug";
import fetch from "node-fetch";
import { parseGuide, parseGuideGroup } from "./parsingUtils";
const logApp = debug("app");
const logWarn = debug("warn");

// TODO move to .env
const API_HOST_URL = "https://api.helsingborg.se/event/json/wp/v2";

async function fetchProperties(id: number) {
  const response = await fetch(`${API_HOST_URL}/property?post=${id}`);
  if (!response.ok) { throw new Error("Malformed request"); }
  const json = await response.json();
  // TODO parse and repackage structure to fit app
  return json;
}

async function fetchAllGuideGroups(lang: string) {
  let url = `${API_HOST_URL}/guidegroup?_embed`;
  if (lang) { url += `&lang=${lang}`; }
  logApp(`fetching from:${url}`);

  const response = await fetch(url);
  if (!response.ok) { throw new Error("Malformed request"); }

  const guideGroupArray = await response.json();

  const resultArray: any[] = [];

  guideGroupArray.forEach((item: any) => {
    try {
      resultArray.push(parseGuideGroup(item));
    } catch (err) {
      // Discard item
      logWarn("Failed to parse item:", err);
    }
  });

  return resultArray;
}

async function fetchAllGuides(lang: string) {
  let url = `${API_HOST_URL}/guide?_embed`;
  if (lang) { url += `&lang=${lang}`; }
  logApp(`sent fetching request to:${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) { throw new Error("Malformed request"); }

  const guidesJson = await response.json();

  const guides: any = [];
  guidesJson.forEach((item: any) => {
    try {
      guides.push(parseGuide(item));
    } catch (err) {
      // Discard item
      logWarn("Failed to parse item:", err);
    }
  });
  logApp("Guides parsing complete");

  return guides;
}

export { fetchAllGuideGroups, fetchAllGuides, fetchProperties };
