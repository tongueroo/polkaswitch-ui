const express = require('express');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
var csrf = require('csurf');
const os = require('os');
const fs = require('fs');
const path = require('path');
var compression = require('compression');
var morgan = require('morgan');
var flash = require('connect-flash');
var _ = require('underscore');

var Sentry = require('@sentry/node');
var Tracing = require('@sentry/tracing');
require('dotenv').config()

var passport = require('./middleware/auth');

const isProduction = process.env.NODE_ENV === 'production';
const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment:
  process.env.IS_MAIN_NETWORK === 'true' ? 'production' : 'development',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  ignoreErrors: [
    // Random plugins/extensions
    "top.GLOBALS",
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "http://tt.epicplay.com",
    "Can't find variable: ZiteReader",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    "http://loading.retry.widdit.com/",
    "atomicFindClose",
    // Facebook borked
    "fb_xd_fragment",
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
    // reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    "conduitPage",
  ],
  denyUrls: [
    // Facebook flakiness
    /graph\.facebook\.com/i,
    // Facebook blocked
    /connect\.facebook\.net\/en_US\/all\.js/i,
    // Woopra flakiness
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com\/js\/woopra\.js/i,
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Other plugins
    /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
    /webappstoolbarba\.texthelp\.com\//i,
    /metrics\.itunes\.apple\.com\.edgesuite\.net\/V/i,
  ],
  release:
  process.env.APP_NAME + '-' + process.env.APP_VERSION,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using
// domains, so that every transaction/span/breadcrumb is
// attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(morgan('dev'));

if (isProduction) {
  app.use(helmet({ contentSecurityPolicy: false }));
}

var defaultCsp;

if (isProduction) {
  defaultCsp = helmet.contentSecurityPolicy.getDefaultDirectives();
} else {
  defaultCsp = _.omit(
    helmet.contentSecurityPolicy.getDefaultDirectives(),
    'upgrade-insecure-requests',
  );
}

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
      secure: true,
      httpOnly: true,
    },
  }),
);

app.use(flash());
app.use(compression());
app.enable('trust proxy');

// force HTTPS
if (process.env.FORCE_HTTPS) {
  app.use(function(request, response, next) {
    if (isProduction && !request.secure) {
      return response.redirect(
        "https://" + request.headers.host + request.url
      );
    }

    next();
  });
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", function(req, res) {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  }

  res.status(200).send(data);
});

app.get("/version", function(req, res) {
  const release = process.env.APP_NAME + "-" + process.env.APP_VERSION;
  res.status(200).send(release);
});

if (process.env.HTTP_PASSWORD) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/debug', function (req, res) {
    throw new Error('Test Error');
  });

  app.get('/login', function (req, res, next) {
    res.render('pages/login', { messages: req.flash('error') });
  });

  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: 'Invalid access credentials',
    }),
  );

  app.get('*', function (req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/login');
    }
  });

  app.use(function (req, res, next) {
    if (req.user) {
      next();
    } else {
      res.status(401).send({ error: 'not authenticated' });
    }
  });
}

app.use(express.static('dist'));
app.use(express.static('public'));

app.use('*', function (req, res) {
  const currentHost = req.hostname;
  var targetIndexFile;

  if (currentHost.includes('claim')) {
    targetIndexFile = 'claim.index.html';
  } else if (currentHost.includes('analytics')) {
    targetIndexFile = 'metrics.index.html';
  } else {
    targetIndexFile = 'index.html'
  }

  var indexPath = path.join(__dirname, '../../', `/dist/${targetIndexFile}`);

  fs.access(indexPath, fs.F_OK, (err) => {
    if (err) {
      console.error(err);

      return res.status(404).send({
        status: 404,
        error: !isProduction ? `${targetIndexFile} not found. Please make sure to run "npm run watch" for local development` : `${targetIndexFile} not found`
      });
    }

    res.sendFile(indexPath);
  });
});

app.use(function onNotFound(req, res, next) {
  res.status(404).send({
    status: 404,
    error: 'not found'
  });
});

// The error handler must be before any other error
// middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  console.error(err);
  res.status(500).send({
    status: 500,
    error: 'crash - (X_X)',
    message: !isProduction ? err : 'n/a'
  });
});

module.exports = app;


