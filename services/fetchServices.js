//TODO move to .env
const _API_BASE = "";

module.exports = {
  async fetchProperties(id) {
    const response = await fetch(`${_API_BASE}/property?post=${id}`);
    console.log("Response", response);
    const json = await response.json();
    console.log("JSON: ", json);

    return json;
  }
};
