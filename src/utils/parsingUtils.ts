import crypto from "crypto";
import debug from "debug";
import { URL } from "url";
import {
  GuideType,
  IContentObject,
  IEvent,
  IGuide,
  IImageUrls,
  IInteractiveGuide,
  ILanguage,
  ILink,
  ILocation,
  IMediaContent,
  INavigationCategory,
  INavigationItem,
  IOpeningHourException,
  PostStatus,
} from "../types/typings";
import { validate } from "./jsonValidator";

const logApp = debug("app");
const logWarn = debug("warn");

function hash(str: string) {
  return crypto.createHash("md5").update(str).digest("hex");
}

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

function parseLocation(item: any): ILocation {
  const {
    id,
    street_address: streetAddress,
    latitude,
    longitude,
    title,
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
    title,
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

function parseUrl(urlString?: string): string | null {
  if (urlString === null || urlString === undefined) {
    return null;
  }

  try {
    return new URL(urlString).toString();
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

function parseImageUrls(data: any): IImageUrls[] {
  const images: IImageUrls[] = [];
  try {
    if (data instanceof Array) {
      for (const item of data) {
        const image = parseImages(item.sizes);
        images.push(image);
      }
    }
  } catch (error) {
    // something went wrong
    logWarn("Failed to parse images data: ", data);
  }
  return images;
}

function parseMediaContent(data: any): IMediaContent {
  if (!(data instanceof Object)) {
    throw new Error("Failed to parse media content from data: " + data);
  }

  const media = {
    contentType: data.type,
    created: parseDate(data.date),
    description: String(data.description),
    id: Number(data.id),
    modified: parseDate(data.modified),
    title: String(data.title),
    url: new URL(data.url).toString(),
  };
  validate(media, "IMediaContent");
  return media;
}

function parseLink(data: any): ILink {
  return {
    title: data.title,
    type: data.service,
    url: new URL(data.link).toString(),
  };
}

function parseLinks(data: any[]) {
  const links = [];
  for (const item of data) {
    try {
      if (item) {
        const link = parseLink(item);
        validate(link, "ILink");
        links.push(link);
      }
    } catch (error) {
      // discarding link
    }
  }
  return links;
}

function parseBeaconAndLocation(
  id: string,
  beacons: any[],
  locations: any[],
): { beacon: any; location: any } {
  const bData = beacons.find((item) => {
    const { content } = item;
    return content instanceof Array && content.indexOf(id) > -1;
  });

  const beacon: any = {
    distance: Number(bData.beacon_distance),
    id: bData.bid,
    nid: bData.nid,
  };

  // Parse location data
  let location;
  try {
    const { location: locationId } = bData;
    const locationData = locations.find((locData) => locData.id === locationId);
    location = parseLocation(locationData);
  } catch (error) {
    // discarding faulty location data
  }

  return { beacon, location };
}

function parseContentObject(
  key: string,
  data: any,
  beacons: any[],
  locations: any[],
) {
  if (typeof data.order !== "number") {
    throw new Error("Failed to parse order from " + data);
  }

  const postStatus: PostStatus = getPostStatus(data.active);
  const images: IImageUrls[] = parseImageUrls(data.image);

  const obj: IContentObject = {
    id: key,
    images,
    order: Number(data.order),
    postStatus,
    searchableId: data.id,
    title: data.title,
  };

  if (data.description_plain) {
    obj.description = data.description_plain;
  }

  try {
    if (data.audio) {
      obj.audio = parseMediaContent(data.audio);
    }
  } catch (error) {
    // ignoring audio
    logWarn("Trying to parse audio", error);
  }

  try {
    if (data.video) {
      obj.video = parseMediaContent(data.video);
    }
  } catch (error) {
    // ignoring video
    logWarn("Trying to parse video", error);
  }

  if (data.links && data.links instanceof Array) {
    obj.links = parseLinks(data.links);
  }

  try {
    const beaconAndLocation = parseBeaconAndLocation(
      obj.id,
      beacons,
      locations,
    );
    try {
      validate(beaconAndLocation.beacon, "IBeacon");
      obj.beacon = beaconAndLocation.beacon;
    } catch (error) {
      // logWarn("validation failed for beacon in contentobject");
    }

    try {
      validate(beaconAndLocation.location, "ILocation");
      obj.location = beaconAndLocation.location;
    } catch (error) {
      logWarn("validation failed for location in contentobject");
    }

    validate(obj, "IContentObject");
  } catch (error) {
    // logWarn("validation failed for contentobject");
  }

  return obj;
}

function parseContentObjects(
  contentData: any,
  beaconData: any,
  locationsData: any,
): IContentObject[] {
  const keys: string[] = Object.keys(contentData);

  let beacons: any[] = [];
  if (beaconData instanceof Array) {
    beacons = beaconData;
  }
  let locations: any[] = [];
  if (locationsData instanceof Array) {
    locations = locationsData;
  }

  const result: IContentObject[] = [];
  for (const key of keys) {
    try {
      const obj = parseContentObject(key, contentData[key], beacons, locations);
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

  const {
    contentObjects,
    subAttractions: beacons,
    _embedded: embeddedData,
  } = item;
  let locationData = null;
  if (embeddedData) {
    locationData = embeddedData.location;
  }

  // parse guide location
  const { guide_location: locationId } = item;
  if (locationId && locationData && locationData instanceof Array) {
    const foundLoc = locationData.find((loc) => loc.id === locationId);
    if (foundLoc) {
      try {
        guide.location = parseLocation(foundLoc);
      } catch (e) {
        // ignoring location from this guide
      }
    }
  }

  // content objects
  if (contentObjects && contentObjects instanceof Object) {
    guide.contentObjects = parseContentObjects(
      contentObjects,
      beacons,
      locationData,
    );
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

export function parseInteractiveGuide(data: any): IInteractiveGuide {
  const interactiveGuide = {
    id: data.id,
    title: data.title.rendered,
    guideGroupId: data.guidegroup[0].id,
    image: data.featured_media.source_url,
    steps: data.steps, // TODO skit i det vi inte behöver, kanske t ex räcker med bara image.url för bilder
  };

  validate(interactiveGuide, 'IInteractiveGuide');

  return interactiveGuide;
}

export function parseNavigationCategory(data: any): INavigationCategory {
  // parse navigation items
  const items: INavigationItem[] = [];
  try {
    const itemsData = data.object_list;
    itemsData.forEach((element: any) => {
      try {
        const item: INavigationItem = {
          id: element.id,
          type: element.type,
        };
        // TODO validate
        validate(item, "INavigationItem");
        items.push(item);
      } catch (err1) {
        logWarn("Failed to parse NavigationItem from: ", element);
      }
    });
  } catch (error) {
    logWarn("Failed to parse NavigationItems from: ", data);
  }

  // parse navigation category
  const category: INavigationCategory = {
    description: data.description,
    id: Number(data.id),
    items,
    name: data.name,
    slug: data.slug,
  };

  validate(category, "INavigationCategory");

  return category;
}

export function parseLanguage(data: any): ILanguage {
  validate(data, "ILanguage");
  return data;
}

export function parseEvent(item: any): IEvent[] {
  const { content, id, featured_media, occasions, slug, title } = item;
  // If given a Date in the past, occasions are empty in the API
  if (!occasions) {
    return [];
  }
  const events: IEvent[] = [];
  const baseEvent: any = {
    description: content.plain_text,
    eventId: Number(id),
    imageUrl: featured_media.source_url,
    name: title.plain_text,
    slug,
  };
  occasions.forEach((occasion: any) => {
    const event: IEvent = { ...baseEvent };
    event.dateStart = new Date(occasion.start_date);
    event.dateEnd = new Date(occasion.end_date);
    event.id = hash(id + event.dateStart.toISOString());

    try {
      event.location = parseLocation(occasion.location || item.location);
    } catch (e) {
      logApp(`Ignoring item ${event.name} because missing location`);
    }
    if (event.location) {
      events.push(event);
    }
  });

  return events;
}
