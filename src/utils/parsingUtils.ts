import debug from "debug";
import { URL } from "url";

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
  location.openHours = openHours;

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

  if (openHoursException) {
    location.openHoursException = openHoursException;
  }

  return location;
}

function parseGuideGroup(item: any) {
  const { id, description, name, slug, apperance, settings, _embedded } = item;

  const { image } = apperance;
  const { sizes } = image;

  let images = null;
  try {
    images = {
      // TODO extract ONE url at a time, please
      large: new URL(sizes.medium_large),
      medium: new URL(sizes.medium),
      thumbnail: new URL(sizes.thumbnail),
    };
  } catch (e) {
    logWarn("Not a well defined url", e);
  }

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

function parseGuide(item: any) {
  // TODO filter and repackage object keys
  return item;
}

export { parseGuideGroup, parseGuide };
