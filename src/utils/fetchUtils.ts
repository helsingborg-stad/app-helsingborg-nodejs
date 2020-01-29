import { endOfDay, startOfDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import debug from "debug";
import fetch from "node-fetch";
import { URL } from "url";
import {
  IEvent,
  IGuide,
  ILanguage,
  INavigationCategory,
  IPointProperty,
} from "../types/typings";
import { TZ } from "./envUtils";
import { validate } from "./jsonValidator";
import {
  parseEvent,
  parseGuide,
  parseGuideGroup,
  parseLanguage,
  parseNavigationCategory,
} from "./parsingUtils";
import {
  buildEventsUrl,
  buildGuideGroupUrl,
  buildGuideUrl,
  buildLanguagesUrl,
  buildNavigationUrl,
  buildPropertyUrl,
} from "./urlUtils";

const TIMEZONE = process.env[TZ] || "Europe/Stockholm";

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
    // TODO move into parsingUtils
    const prop: IPointProperty = {
      id: json.id,
      name: json.name,
      slug: json.slug,
    };

    if (json.icon !== null) {
      try {
        prop.icon = new URL(json.icon).toString();
      } catch (e) {
        // not a well formatted url, discarding
        logWarn("Not a well formatted url", e);
      }
    }

    try {
      validate(prop, "IPointProperty");
      props.push(prop);
    } catch (err) {
      logWarn("Invalid property, discarding", err);
    }
  });

  return props;
}

export async function fetchAllGuideGroups(
  include: string[] | undefined,
  lang?: string,
) {
  const url = buildGuideGroupUrl(include, lang);
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
      // fetch belonging point properties
      const locationId = item._embedded.location[0].id;
      let props: IPointProperty[] = [];
      try {
        props = await fetchProperties(locationId, lang);
      } catch (error) {
        // discarding the properties
      }

      // fetch belonging guides
      let guidesCount;
      try {
        const guides = await fetchAllGuides(undefined, lang, item.id);
        guidesCount = guides.length;
      } catch (error) {
        // using default value
        guidesCount = 0;
      }

      guideGroup = {
        ...parseGuideGroup(item),
        guidesCount,
        pointProperties: props,
      };
      validate(guideGroup, "IGuideGroup");

      resultArray.push(guideGroup);
    } catch (err) {
      // Discard item
      logWarn("Failed to parse item:", guideGroup);
      logWarn("Validation error: ", err);
    }
  }

  return resultArray;
}

export async function fetchGuide(id: string, lang?: string): Promise<IGuide> {
  const url = buildGuideUrl(undefined, lang, id);
  logApp(`sent fetching request to: ${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const guideJson = await response.json();

  return parseGuide(guideJson);
}

export async function fetchAllGuides(
  include: string[] | undefined,
  lang?: string,
  guideGroupId?: number,
): Promise<IGuide[]> {
  const url = buildGuideUrl(include, lang, undefined, guideGroupId);
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
      validate(guide, "IGuide");
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

export async function fetchNavigationCategories(
  userGroupId: number,
  lang?: string,
): Promise<INavigationCategory[]> {
  const url = buildNavigationUrl(userGroupId, lang);
  logApp(`sending fetch request to: ${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const navigationJson = await response.json();

  const navigationCategories: INavigationCategory[] = [];
  navigationJson.forEach((item: any) => {
    try {
      const category = parseNavigationCategory(item);
      validate(category, "INavigationCategory");
      navigationCategories.push(category);
    } catch (err) {
      // Discard item
      logWarn("Failed to parse navigation category from: ", item);
      logWarn("Validation error: ", err);
    }
  });

  logApp("Navigation parsing complete");

  return navigationCategories;
}

export async function fetchLanguages(): Promise<ILanguage[]> {
  const url = buildLanguagesUrl();
  logApp(`sending fetch request to: ${url}`);

  const response = await fetch(url);
  logApp(`received fetching response from:${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  const languages: ILanguage[] = [];
  const languagesJson = await response.json();
  languagesJson.forEach((data: any) => {
    try {
      const lang = parseLanguage(data);
      languages.push(lang);
    } catch (error) {
      // discarding faulty language
    }
  });
  return languages;
}

function sortByHourAndMin(
  { dateStart: aStart }: { dateStart: Date },
  { dateStart: bStart }: { dateStart: Date },
) {
  if (aStart.getHours() - bStart.getHours() === 0) {
    return aStart.getMinutes() - bStart.getMinutes();
  }
  return aStart.getHours() - bStart.getHours();
}

// Since some dates in API have actual hours and others are always at 00:00
// (meaning entire days presumably), we compare by start and end of day
function isIncludedInDateRange(startDate: string, endDate: string): (item: IEvent) => boolean {
  const rangeStartDate = startOfDay(new Date(startDate));
  const rangeEndDate = endOfDay(new Date(endDate));
  return (item: IEvent) => {
    const { dateStart, dateEnd } = item;
    const zonedStart = startOfDay(zonedTimeToUtc(dateStart, TIMEZONE));
    const zonedEnd = endOfDay(zonedTimeToUtc(dateEnd, TIMEZONE));
    return zonedStart <= rangeStartDate && zonedEnd >= rangeEndDate;
  };
}

export async function fetchEvents(
  userGroupId: number,
  lang?: string,
  dateStart?: string,
  dateEnd?: string,
): Promise<IEvent[]> {
  const url = buildEventsUrl(userGroupId, lang, dateStart, dateEnd);
  logApp(`sending fetch request to: ${url}`);

  // TODO: refactor this?
  const response = await fetch(url);
  logApp(`received fetching response from: ${url}`);
  if (!response.ok) {
    throw new Error("Malformed request");
  }

  let events: IEvent[] = [];
  const eventsJson = await response.json();
  eventsJson.forEach((data: any) => {
    try {
      const parsedEvents = parseEvent(data);
      events.push(...parsedEvents);
    } catch (error) {
      // Discard item
      logWarn("Failed to parse Event: ", data);
      logWarn("Validation error: ", error);
    }
  });
  if (dateStart && dateEnd) {
    const filterFn = isIncludedInDateRange(dateStart, dateEnd);
    events = events.filter(filterFn);
  }
  const sortedEvents = events.sort(sortByHourAndMin);
  return sortedEvents;
}
