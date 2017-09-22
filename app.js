/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const hbs = require('express-handlebars');
const passport = require('passport');
const expressValidator = require('express-validator');
const bugsnag = require("bugsnag");
const timber = require('timber');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const downloads = require('./controllers/api/downloads');
const dashboardController = require('./controllers/dashboard');

/**
 * Create Express server.
 */
const app = express();

/**
 * Error and log monitoring
 */
bugsnag.register(process.env.BUGSNAG_API_KEY, {
    releaseStage: process.env.BUGSNAG_RELEASE_STAGE,
    notifyReleaseStages: ["production"]
});
app.use(bugsnag.requestHandler);
app.locals = {
    releaseStage: process.env.BUGSNAG_RELEASE_STAGE
};
timber.config.append_metadata = true;

/**
 * Passport config.
 */
const passportConfig = require('./config/passport');

/**
 * Express configuration.
 */
app.engine('.hbs', hbs({extname: '.hbs', partialsDir: __dirname + '/views/partials'}));
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.use(expressStatusMonitor());
app.use(compression());
app.use(expressValidator());
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(timber.middlewares.express())

/**
 * App routes.
 */
app.get('/', homeController.index);
app.get('/dashboard', passportConfig.isAuthenticated, dashboardController.index);

/**
 * Auth routes.
 */
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

/**
 * API routes.
 */
app.post('/api/startDownload', passportConfig.isAuthenticated, downloads.start);
app.get('/api/listCurrentDownloads', passportConfig.isAuthenticated, downloads.list);

/**
 * Error Handler.
 */
app.use(bugsnag.errorHandler);
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
