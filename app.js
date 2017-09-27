// Import packages
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const ConnectMongo = require('connect-mongo')(session);
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const flash = require('express-flash');
const path = require('path');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const multer = require('multer');
const passport = require('passport');
// const socketio = require('socket.io');
const dotenv = require('dotenv');

// Add environment variables
dotenv.load({ path: '.env' });

// Create server and socket.io 
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Configure Mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('Mongo connection error');
  process.exit();
});

// Configure packages
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const passportConfig = require('./config/passport');

// Configure Express server
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new ConnectMongo({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

// change maxAge to 31557600000 to cache forever
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

// Put all controllers here
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const socketController = require('./controllers/socket');
const settingsController = require('./controllers/settings');

const userIo = io.on('connection', (socket)=>{
  console.log('Socket.io connected');
  socket.emit('greet', { title: 'Hello browser!', body: 'This message is sent via socket.io' });
  socket.on('respond', (data) => {
    console.log(data.body);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

// Non socket.io routes here
app.get('/', homeController.index);
app.get('/socket', socketController.index);
app.post('/settings', settingsController.postSettings); // not working yet
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

// Facebook Login
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

// API examples only. Not recommended to use directly. 
app.get('/api', apiController.getApi);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/cheerio', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
app.get('/api/google-maps', apiController.getGoogleMaps);

app.use(errorHandler());


// Start Express server
server.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env')); 
});

module.exports = server;
