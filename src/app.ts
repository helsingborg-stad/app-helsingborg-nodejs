import * as dotenv from "dotenv";
dotenv.config();
import debug from "debug";
import express, { ErrorRequestHandler, Response } from "express";
import { Result } from "express-validator/check";
import http from "http";
import logger from "morgan";
import eventsRouter from "./routes/events";
import guideGroupRouter from "./routes/guidegroup";
import guidesRouter from "./routes/guides";
import interactiveGuidesRouter from "./routes/interactiveGuides";
import languagesRouter from "./routes/languages";
import navigationRouter from "./routes/navigation";
import { checkRequiredKeys } from "./utils/envUtils";
import { normalizePort } from "./utils/serverUtils";

checkRequiredKeys();

const app = express();
const logApp = debug("app");

const port = normalizePort(process.env.PORT || "5000");

function instanceOfResult(object: any): object is Result {
  return "mapped" in object;
}

const errorHandler: ErrorRequestHandler = (
  err: Error,
  { },
  res: Response,
  { },
) => {
  if (instanceOfResult(err)) {
    res.status(422).send({ errors: (err as Result).mapped() });
  } else {
    res.status(500).send({ error: err.message });
  }
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * ROUTES
 */
app.use("/events", eventsRouter);
app.use("/guidegroup", guideGroupRouter);
app.use("/guide", guidesRouter);
app.use("/interactive_guide", interactiveGuidesRouter);
app.use("/navigation", navigationRouter);
app.use("/languages", languagesRouter);

/**
 * ERROR handlers
 */
app.use(errorHandler);

/**
 * Start server
 */
const server = http.createServer(app);
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // tslint:disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      // tslint:disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logApp(`Listening on ${bind}`);
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
