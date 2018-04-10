const express = require('express');
const logger = require('morgan');
const debug = require('debug')('app');
const guideGroupRouter = require('./src/routes/guidegroup');
const http = require('http');

const app = express();

const port = normalizePort(process.env.PORT || '5000');

function errorHandler(err, req, res, next) {
  res.status(500).send({ error: 'Something failed.' });
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * ROUTES
 */
app.use('/guidegroup', guideGroupRouter);

/**
 * ERROR handler
 */
app.use(errorHandler);

/**
 * Start server
 */
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);

  debug('Listening on ' + bind);
}

function normalizePort(val) {
  const port = parseInt(val, 10);

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
