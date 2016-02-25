var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var indexRoute = require('./routes/index');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

var app = express();


// mongo setup
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/angluar-wiki';
mongoose.connect(mongoURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!")
});

// favicon setup
app.use(favicon(path.join(__dirname,'public','images','burger.png')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// var sessionSecret = process.env.SESSION_SECRET || 'this is not a secret ;)';
// app.use(session({ secret: sessionSecret,
//   resave: false,
//   saveUninitialized: false }));

//setup passport
// require('./config/passportConfig')(passport);
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

//setup handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', indexRoute.home);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function(err) {
	if (err) console.log(err)
});


module.exports = app;
