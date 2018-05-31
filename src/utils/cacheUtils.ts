import debug from "debug";
import redis from "redis";
import { promisify } from "util";
import { readNumber } from "./serverUtils";

const logApp = debug("app");

const CACHE_EXPIRATION_TIME = readNumber(process.env.CACHE_EXPIRATION_TIME, 10);

const REDIS_URL = process.env.REDIS_URL || "";
const client = redis.createClient(REDIS_URL);
const getAsync = promisify(client.get).bind(client);

let isReady: boolean = false;

// Subscribe to client events
client.on("error", (error) => {
  logApp("redis: ERROR: ", error);
});

client.on("connect", () => {
  logApp("redis: CONNECTED");
});

client.on("ready", () => {
  logApp("redis: READY");
  isReady = true;
});

client.on("end", () => {
  logApp("redis: END");
  isReady = false;
});

async function get(key: string): Promise<any> {
  if (!isReady) {
    throw new Error("Redis client not connected.");
  }

  const reply = await getAsync(key);
  if (!reply) {
    logApp("CACHE MISS: " + key);
    throw new Error("Cache miss");
  }

  logApp("CACHE HIT: " + key);
  return JSON.parse(reply);
}

function set(key: string, data: any): void {
  logApp("CACHE UPDATE DATA: ", key);
  const stringData = JSON.stringify(data);
  client.set(key, stringData, "EX", CACHE_EXPIRATION_TIME, redis.print);
}

export default { get, set };
