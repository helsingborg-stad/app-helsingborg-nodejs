# app-helsingborg-nodejs

NodeJS middleware for the guide helsingborg app. Purpose: simplify mobile app API.

Basically it:

1. fetches data from a wordpress API
2. filters out relevant data
3. remaps properties
4. validates the data
5. puts it in a cache
6. returns it in the response

## Getting started

1. `npm install`
2. `cp .env.example .env`
3. `npm run watch-debug`

### Enable local cache

Setup and start a local [redis](https://redis.io/) server or run with [Docker](https://docs.docker.com/install/).

```
docker-compose up -d
```

## Deployment

This project is configured to run the `postinstall` script after deployment. Then the program is started with `npm run start`.

## The project setup

This is a NodeJS app built upon [ExpressJS](https://expressjs.com/). It is written completely in [Typescript](https://www.typescriptlang.org/) which is compiled to JavaScript before it is started.

### Core concepts

#### Types

All typescript definitions are placed [here](src/types/).

#### Routers

A [router](src/routes/) handles a subset of a path, for example we have one router for `/guides` and one for `/navigation`. It is responsible for validating query parameters and returning a response. The links to the routers are setup in [`app.ts`](src/app.ts).

#### Core utility modules

##### ParsingUtils

[ParsingUtils](src/utils/parsingUtils.ts) is the core of the whole app. This is where all data is parsed and remapped.

##### FetchUtils

[FetchUtils](src/utils/fetchUtils.ts) is a high level component responsible for fetching and validating data.

#### Cache middleware

The [cache middleware](src/middleware/cache.ts) is attached to a router. For every request passed onto that router it will check if that request is stored in the cache. If it is it will return immediately, otherwise it will let the router implementation fetch fresh data.

#### JSON-schema

All JSON data that is returned from this app has been validated with [JSON schema](http://json-schema.org/). The schemas are located [here](json-schemas/) and can (and should) be distributed to consumers (such as the mobile app client).

Remember to generate new schemas whenever you change (or add new) types. To simplify development you can run this script `npm run regenerate-json-schemas`. Make sure you keep the [script](scripts/generate-json-schemas.sh) up to date.

## Notes

The parameter `userGroupId` ("group-id" in Event api) is used as a selector for location and can be used to filter content for different guide apps.
