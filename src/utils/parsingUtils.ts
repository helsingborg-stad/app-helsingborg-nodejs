import debug from "debug";
import jsonValidator from "../utils/jsonValidator";

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
  jsonValidator.validate(oh, "/openingHour");
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
  const images = {
    large: sizes.medium_large,
    medium: sizes.medium,
    thumbnail: sizes.thumbnail,
  };

  const locationArray = _embedded.location;
  const location = parseLocation(locationArray[0]);

  const guideGroup = {
    active: settings.active,
    description,
    id,
    images,
    location,
    name,
    slug,
  };

  // validating output against JSON schema
  jsonValidator.validate(guideGroup, "guideGroup");

  return guideGroup;
}

function parseGuide(item: any) {
  // TODO filter and repackage object keys
  return item;
}

export { parseGuideGroup, parseGuide };
