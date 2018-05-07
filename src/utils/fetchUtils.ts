import debug from "debug";
import fetch from "node-fetch";
import { URL } from "url";
import { IGuide, IPointProperty } from "../types/typings";
import { validate } from "./jsonValidator";
import { parseGuide, parseGuideGroup } from "./parsingUtils";
import {
  buildGuideGroupUrl,
  buildGuideUrl,
  buildPropertyUrl,
} from "./urlUtils";

const logApp = debug("app");
const logWarn = debug("warn");

async function fetchProperties(
  id: number,
  lang?: string,
): Promise<IPointProperty[]> {
  const url = buildPropertyUrl(id, lang);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Malformed request");
  }
  const jsonArray: any[] = await response.json();
  const props: IPointProperty[] = [];

  jsonArray.forEach((json) => {
    const prop: IPointProperty = {
      id: json.id,
      name: json.name,
      slug: json.slug,
    };

    if (json.icon !== null) {
      try {
        prop.icon = new URL(json.icon);
      } catch (e) {
        // not a well formatted url, discarding
        logWarn("Not a well formatted url", e);
      }
    }

    try {
      validate(prop, "pointProperty");
      props.push(prop);
    } catch (err) {
      logWarn("Invalid property, discarding", err);
    }
  });

  return props;
}

export async function fetchAllGuideGroups(lang?: string) {
  const url = buildGuideGroupUrl(lang);
  logApp(`fetching from:${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const guideGroupArray = await response.json();

  const resultArray: any[] = [];

  for (const item of guideGroupArray) {
    let guideGroup = null;
    try {
      const locationId = item._embedded.location[0].id;
      let props: IPointProperty[] = [];
      try {
        props = await fetchProperties(locationId, lang);
      } catch (error) {
        // discarding the properties
      }

      guideGroup = {
        ...parseGuideGroup(item),
        pointProperties: props,
      };
      validate(guideGroup, "guideGroup");

      resultArray.push(guideGroup);
    } catch (err) {
      // Discard item
      logWarn("Failed to parse item:", guideGroup);
      logWarn("Validation error: ", err);
    }
  }

  return resultArray;
}

export async function fetchGuide(lang: string, id: string): Promise<IGuide> {
  const url = buildGuideUrl(lang, id);
  logApp(`sent fetching request to: ${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const guideJson = await response.json();

  return parseGuide(guideJson);
}

export async function fetchAllGuides(lang: string): Promise<IGuide[]> {
  const url = buildGuideUrl(lang);
  logApp(`sent fetching request to: ${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const guidesJson = await response.json();

  const guides: IGuide[] = [];
  guidesJson.forEach((item: any) => {
    try {
      const guide = parseGuide(item);
      validate(guide, "guide");
      guides.push(guide);
    } catch (err) {
      // Discard item
      logWarn("Failed to parse guide from: ", item);
      logWarn("Validation error: ", err);
    }
  });
  logApp("Guides parsing complete");

  return guides;
}
