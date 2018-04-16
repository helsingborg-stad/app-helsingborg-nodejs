const tv4 = require('tv4');
const schemaGuideGroup = require('../../json-schemas/guideGroup');

function parseLocation(item) {
  const {
    // eslint-disable-next-line camelcase
    id, street_address, latitude, longitude, open_hours, open_hour_exceptions, links,
  } = item;

  let openHours;
  // eslint-disable-next-line camelcase
  if (open_hours) {
    openHours = open_hours.map((oh) => {
      // eslint-disable-next-line no-param-reassign
      oh.dayNumber = oh.day_number;
      // eslint-disable-next-line no-param-reassign
      delete oh.day_number;
      return oh;
    });
  }

  return {
    id,
    streetAddress: street_address,
    latitude,
    longitude,
    openHours,
    openHoursException: open_hour_exceptions,
    links,
  };
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

  // TODO throw exception if any REQUIRED props are missing
  const guideGroup = {
    id,
    description,
    name,
    slug,
    images,
    active: settings.active,
    location,
  };

  // TODO Validate object
  const result = tv4.validate(guideGroup, schemaGuideGroup);
  console.log('GuideGroup validated: ', result);
  if (!result) {
    console.log(tv4.error);
    // throw new Error(tv4.error);
  }

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
