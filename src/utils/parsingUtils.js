const logWarn = require('debug')('warn');
const jsonValidator = require('../utils/jsonValidator');

function parseOpeningHour(item) {
  const {
    weekday, closed, opening, closing, day_number: dayNumber,
  } = item;

  const oh = {
    weekday,
    closed,
    opening,
    closing,
    dayNumber: Number(dayNumber),
  };
  jsonValidator.validate(oh, '/openingHour');
  return oh;
}

function parseLocation(item) {
  const {
    id,
    street_address: streetAddress,
    latitude,
    longitude,
    open_hours: openingHoursInput,
    open_hour_exceptions: openHoursException,
    links,
  } = item;

  const location = {
    id,
    streetAddress,
    latitude: Number(latitude),
    longitude: Number(longitude),
    links,
  };

  const openHours = [];
  location.openHours = openHours;

  if (openingHoursInput) {
    openingHoursInput.forEach((oh) => {
      try {
        const parsedOh = parseOpeningHour(oh);
        openHours.push(parsedOh);
      } catch (err) {
        logWarn('Failed to parse opening hours, discarding.', err);
      }
    });
  }

  if (openHoursException) location.openHoursException = openHoursException;

  return location;
}

function parseGuideGroup(item) {
  const {
    id, description, name, slug, apperance, settings, _embedded,
  } = item;

  const { image } = apperance;
  const { sizes } = image;
  const images = {
    thumbnail: sizes.thumbnail,
    medium: sizes.medium,
    large: sizes.medium_large,
  };

  const locationArray = _embedded.location;
  const location = parseLocation(locationArray[0]);

  const guideGroup = {
    id,
    description,
    name,
    slug,
    images,
    active: settings.active,
    location,
  };

  // validating output against JSON schema
  jsonValidator.validate(guideGroup, 'guideGroup');

  return guideGroup;
}

function parseGuide(item) {
  // TODO filter and repackage object keys
  return item;
}

module.exports = {
  parseGuideGroup,
  parseGuide,
};
