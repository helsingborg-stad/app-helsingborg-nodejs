const express = require('express');
const logger = require('morgan');
const debug = require('debug')('app');
const http = require('http');
const guideGroupRouter = require('./src/routes/guidegroup');
const { normalizePort } = require('./src/utils/serverUtils');

const app = express();

const port = normalizePort(process.env.PORT || '5000');

// eslint-disable-next-line no-unused-vars
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
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
