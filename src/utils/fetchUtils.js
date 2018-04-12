const fetch = require('node-fetch');
const parsingUtils = require('./parsingUtils');
const debug = require('debug')('warn');

// TODO move to .env
const API_HOST_URL = 'https://api.helsingborg.se/event/json/wp/v2';

module.exports = {
  async fetchProperties(id) {
    const response = await fetch(`${API_HOST_URL}/property?post=${id}`);
    if (!response.ok) throw new Error('Malformed request');
    const json = await response.json();
    // TODO parse and repackage structure to fit app
    return json;
  },

  async fetchAllGuideGroups(lang) {
    let url = `${API_HOST_URL}/guidegroup?_embed`;
    if (lang) url += `&lang=${lang}`;
    debug(`fetching from:${url}`);

    const response = await fetch(url);
    if (!response.ok) throw new Error('Malformed request');

    const guideGroupArray = await response.json();

    const resultArray = [];

    guideGroupArray.forEach((item) => {
      try {
        resultArray.push(parsingUtils.parseGuideGroup(item));
      } catch (err) {
        // Discard item
        debug('Failed to parse item:', err);
      }
    });

    return resultArray;
  },
};
