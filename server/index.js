import fs from 'fs';
import app from './app';

const PORT = process.env.SSR_PORT;
const SOCK = process.env.SSR_SOCK;

if (PORT) {
  app
    .listen(PORT, () => {
      console.log(`Sportnet.online SSR listening on port ${PORT}!`);
    })
    .on('error', onError);
}

if (SOCK) {
  try {
    fs.unlinkSync(SOCK);
  } catch (e) {
    // nothing to do here...
  }

  app
    .listen(SOCK, () => {
      fs.chmodSync(SOCK, '0777');
      console.log(`Sportnet.online SSR istening on socket ${SOCK}!`);
    })
    .on('error', onError);
}

if (!PORT && !SOCK) {
  console.error('You must specify either port or socket!');
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string' ? 'Port ' + PORT : 'Sock ' + SOCK;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
