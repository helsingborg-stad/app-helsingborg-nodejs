const fetch = require("node-fetch");

//TODO move to .env
const _API_BASE = "https://api.helsingborg.se/event/json/wp/v2";

module.exports = {
  async fetchProperties(id) {
    const response = await fetch(`${_API_BASE}/property?post=${id}`);
    const json = await response.json();
    return json;
  }
};
