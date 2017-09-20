const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const fs = require('fs');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    const user = {};
    user.email = profile.emails[0].value;
    user.id = profile.id;
    user.googleToken = accessToken;
    user.profile = {};
    user.profile.name = profile.name.givenName;
    user.profile.gender = profile._json.gender;
    user.profile.picture = profile._json.image.url;
    let authorized_emails = process.env.AUTHORIZED_EMAILS.split(',');
    if (authorized_emails.includes(user.email)) {
        done(null, user);
    } else {
        console.log(user.email + ' REFUSED');
        done('Your email address is not authorized. Please try with your personal Google one.', null);
    };
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split('/').slice(-1)[0];
    const token = req.user.tokens.find(token => token.kind === provider);
    if (token) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};
