require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app'],
});
require('dotenv').config();

const app = require('./app').default;

const PORT = process.env.SSR_PORT || 3001;

app
  .listen(PORT, () => {
    console.log(`SSR listening on port ${PORT}!`);
  })
  .on('error', error => {
    console.error('Listen error: ', error);
  });
