import debug from "debug";
import { URL } from "url";
import {
  GuideType,
  IContentObject,
  IGuide,
  IImageUrls,
  IOpeningHourException,
  PostStatus,
} from "../types/typings";

const logWarn = debug("warn");

function parseOpeningHour(item: any) {
  const { weekday, closed, opening, closing, day_number: dayNumber } = item;

  const oh = {
    closed,
    closing,
    dayNumber: Number(dayNumber),
    opening,
    weekday,
  };
  return oh;
}

function parseLocation(item: any) {
  const {
    id,
    street_address: streetAddress,
    latitude,
    longitude,
    open_hours: openingHoursInput,
    open_hour_exceptions: openHoursException,
    links,
  } = item;

  const location: any = {
    id: Number(id),
    latitude: Number(latitude),
    links,
    longitude: Number(longitude),
    streetAddress,
  };

  const openHours: any[] = [];
  if (openingHoursInput) {
    openingHoursInput.forEach((oh: any) => {
      try {
        const parsedOh = parseOpeningHour(oh);
        openHours.push(parsedOh);
      } catch (err) {
        logWarn("Failed to parse opening hours, discarding.", err);
      }
    });
  }

  if (openHours.length > 0) {
    location.openingHours = openHours;
  }

  if (openHoursException) {
    const openingHourExceptions: IOpeningHourException[] = [];
    openHoursException.forEach((element: any) => {
      try {
        const exc: IOpeningHourException = {
          date: new Date(element.exception_date).toISOString(),
          description: element.exeption_information,
        };
        openingHourExceptions.push(exc);
      } catch (error) {
        // discarding exception
        logWarn("Error parsing opening hour exception from: " + element);
      }
    });

    if (openingHourExceptions.length > 0) {
      location.openingHourExceptions = openingHourExceptions;
    }
  }

  return location;
}

function parseUrl(urlString?: string): URL | null {
  if (urlString === null || urlString === undefined) {
    return null;
  }

  try {
    return new URL(urlString);
  } catch (error) {
    logWarn("Not a well formatted url, discarding: " + urlString);
  }

  return null;
}

function parseImages(item: any): IImageUrls {
  const images = {
    large: parseUrl(item.large),
    medium: parseUrl(item.medium),
    thumbnail: parseUrl(item.thumbnail),
  };
  return images;
}

export function parseGuideGroup(item: any) {
  const { id, description, name, slug, apperance, settings, _embedded } = item;

  const { image } = apperance;
  const { sizes } = image;

  const images = parseImages(sizes);

  const locationArray = _embedded.location;
  const location = parseLocation(locationArray[0]);

  // TODO return type GuideGroup
  const guideGroup = {
    active: settings.active,
    description,
    id,
    images,
    location,
    name,
    slug,
  };

  return guideGroup;
}

function getPostStatus(active: any): PostStatus {
  return active ? PostStatus.PUBLISH : PostStatus.DRAFT;
}

function parseContentObject(key: string, data: any): IContentObject {
  if (typeof data.order !== "number") {
    throw new Error("Failed to parse order from " + data);
  }

  const postStatus: PostStatus = getPostStatus(data.active);
  return {
    id: key,
    images: [],
    order: Number(data.order),
    postStatus,
    searchableId: String(data.id),
    title: String(data.title),
  };
}

function parseContentObjects(data: any): IContentObject[] {
  const keys: string[] = Object.keys(data);

  const result: IContentObject[] = [];
  for (const key of keys) {
    try {
      const obj = parseContentObject(key, data[key]);
      result.push(obj);
    } catch (error) {
      logWarn("Failed to parse content object, discarding.");
    }
  }
  return result;
}

function parsePublishStatus(data: any): PostStatus {
  return data as PostStatus;
}

function parseGuideType(data: any): GuideType {
  return data as GuideType;
}

function parseDate(data: any): string {
  if (data === null || data === undefined) {
    throw new Error("Can not parse null/undefined to a date.");
  }
  return new Date(data).toISOString();
}

export function parseGuide(item: any): IGuide {
  const guide: IGuide = {
    childFriendly: Boolean(item.guide_kids),
    contentObjects: [],
    description: item.content.plain_text,
    guideGroupId: Number(item.guidegroup[0].id),
    guideType: parseGuideType(item.content_type),
    id: Number(item.id),
    images: parseImages(item.guide_images[0].sizes),
    name: item.title.plain_text,
    postStatus: parsePublishStatus(item.status),
    slug: item.slug,
    tagline: item.guide_tagline,
  };

  const { contentObjects } = item;

  if (contentObjects && contentObjects instanceof Object) {
    guide.contentObjects = parseContentObjects(contentObjects);
  }

  try {
    const dateStart = parseDate(item.guide_date_start);
    guide.dateStart = dateStart;
  } catch (error) {
    // no valid start time
  }

  try {
    const dateEnd = parseDate(item.guide_date_end);
    guide.dateEnd = dateEnd;
  } catch (error) {
    // no valid end time
  }

  return guide;
}
