const app = require('./app');

var server = app.listen(process.env.PORT || 5000, () => {
  console.log(`ENV: IS_MAIN_NETWORK: ${process.env.IS_MAIN_NETWORK}`);
  console.log(`ENV: IS_CLAIM_DOMAIN: ${process.env.IS_CLAIM_DOMAIN}`);
  console.log(`ENV: ${process.env.HEROKU_APP_NAME}-${process.env.HEROKU_RELEASE_VERSION}`);
  console.log(`Listening on port ${process.env.PORT || 5000}!`);
});

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server');
  server.close((err) => {
    console.debug('HTTP server closed');
    process.exit(err ? 1 : 0);
  });
});

