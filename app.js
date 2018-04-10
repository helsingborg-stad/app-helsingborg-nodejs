var express = require("express");
var logger = require("morgan");
var debug = require("debug")("app");
var guideGroupRouter = require("./routes/guidegroup");
var http = require("http");

var app = express();

var port = normalizePort(process.env.PORT || "5000");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * ROUTES
 */
app.use("/guidegroup", guideGroupRouter);

/**
 * Start server
 */
var server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);

  debug("Listening on " + bind);
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
