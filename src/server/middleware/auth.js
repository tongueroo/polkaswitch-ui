var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    if (
      username == process.env.HTTP_USER &&
      password == process.env.HTTP_PASSWORD
    ) {
      return done(null, 1);
    } else {
      return done(null, false);
    }
  }),
);

module.exports = passport;
