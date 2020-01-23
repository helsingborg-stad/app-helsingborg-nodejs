import { NextFunction, Request, Response } from "express";
import cacheUtils from "../utils/cacheUtils";

async function asyncCache(req: Request, res: Response, next: NextFunction) {
  if (process.env.CACHE_DISABLED === "1") {
    return next();
  }
  const key = req.originalUrl;
  let jsonBody: any = null;

  const old = res.json.bind(res);
  res.json = (body) => {
    jsonBody = body;
    old(body);
    return res;
  };

  try {
    // if in cache, send response
    const cachedData = await cacheUtils.get(key);
    res.send(cachedData);
  } catch (error) {
    // nothing in the cache
    // wait for response to be sent
    res.on("finish", () => {
      if (jsonBody) {
        cacheUtils.set(key, jsonBody);
      }
    });

    next();
  }
}

export function cache(req: Request, res: Response, next: NextFunction) {
  asyncCache(req, res, next);
}
