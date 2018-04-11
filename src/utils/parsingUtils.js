/*
{
    "id": 638,
"description": "...”,
    "name": "#artstreethbg",
    "slug": "artstreethbg",
    "images": {
                "thumbnail": x.png",
              "medium": "x.png",
            “large”: “x.jpg”
       }
"active": true,
    "location": {
                            "id": 47590,
           "street_address": "Södergatan 60",
                        "latitude": "56.039192",
                        "longitude": "12.7026167",
                        "open_hours": null,
                        "open_hour_exceptions": null,
"links": [
                    {
                        "service": "instagram",
                        "url": "https://www.instagram.com/artstreethbg/"
                    }
                    ],
}


}
*/

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
  return {
    id,
    description,
    name,
    slug,
    images,
    active: settings.active,
    location,
  };
}

module.exports = {
  parseGuideGroup,
};
