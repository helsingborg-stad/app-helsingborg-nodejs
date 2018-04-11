const fetch = require('node-fetch');
const parsingUtils = require('./parsingUtils');

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

  async fetchAllGuideGroups() {
    const response = await fetch(`${API_HOST_URL}/guidegroup?_embed`);
    if (!response.ok) throw new Error('Malformed request');

    console.log('response OK');

    const guideGroupArray = await response.json();

    const resultArray = [];

    guideGroupArray.forEach((item) => {
      try {
        resultArray.push(parsingUtils.parseGuideGroup(item));
      } catch (err) {
        // Discard item
        console.log('Failed to parse item:', err);
      }
    });

    return resultArray;
  },
};
