const jsonValidator = require('../utils/jsonValidator');

function parseLocation(item) {
  const {
    // eslint-disable-next-line camelcase
    id,
    street_address: streetAddress,
    latitude,
    longitude,
    open_hours: openHours,
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

  // eslint-disable-next-line camelcase
  if (openHours) {
    openHours.map((oh) => {
      // eslint-disable-next-line no-param-reassign
      oh.dayNumber = Number(oh.day_number);
      // eslint-disable-next-line no-param-reassign
      delete oh.day_number;
      return oh;
    });
    location.openHours = openHours;
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
