import express from 'express';
import logger from 'morgan';
import debug from 'debug';
import http from 'http';
import guideGroupRouter from './routes/guidegroup';
import guidesRouter from './routes/guides';
import { normalizePort } from './utils/serverUtils';

if(process.env.NODE_ENV === "production")
{
  require('newrelic');
}

const app = express();
const logApp = debug('app');

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
app.use('/guide', guidesRouter);

/**
 * ERROR handler
 */
app.use(errorHandler);

/**
 * Start server
 */
const server = http.createServer(app);
function onError(error: NodeJS.ErrnoException) {
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
  logApp(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);