import debug from "debug";
import fetch from "node-fetch";
import { PointProperty, Property } from "../types/typings";
import { validate } from "./jsonValidator";
import { parseGuide, parseGuideGroup } from "./parsingUtils";
const logApp = debug("app");
const logWarn = debug("warn");

// TODO move to .env
const API_HOST_URL = "https://api.helsingborg.se/event/json/wp/v2";

async function fetchProperties(
  id: number,
  lang?: string,
): Promise<PointProperty[]> {
  let url = `${API_HOST_URL}/property?post=${id}`;
  if (lang) {
    url += `&lang=${lang}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Malformed request");
  }
  const jsonArray: any[] = await response.json();
  const props: PointProperty[] = [];

  jsonArray.forEach((json) => {
    const prop: PointProperty = {
      icon: json.icon,
      id: json.id,
      name: json.name,
      slug: json.slug,
    };

    // TODO validate input
    props.push(prop);
  });

  return props;
}

async function fetchAllGuideGroups(lang?: string) {
  let url = `${API_HOST_URL}/guidegroup?_embed`;
  if (lang) {
    url += `&lang=${lang}`;
  }
  logApp(`fetching from:${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const guideGroupArray = await response.json();

  const resultArray: any[] = [];

  for (let index = 0; index < guideGroupArray.length; index++) {
    const item = guideGroupArray[index];
    try {
      const locationId = item._embedded.location[0].id;
      let props: PointProperty[] = [];
      try {
        props = await fetchProperties(locationId, lang);
      } catch (error) {
        // discarding the properties
      }

      const guideGroup = {
        ...parseGuideGroup(item),
        pointProperties: props,
      };
      validate(guideGroup, "guideGroup");

      resultArray.push(guideGroup);
    } catch (err) {
      // Discard item
      logWarn("Failed to parse item:", err);
    }
  }

  return resultArray;
}

async function fetchAllGuides(lang: string) {
  let url = `${API_HOST_URL}/guide?_embed`;
  if (lang) {
    url += `&lang=${lang}`;
  }
  logApp(`sent fetching request to:${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

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
