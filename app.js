var express = require('express');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
var mongoose = require('./connection');

var store = new MongoStore({ mongooseConnection: mongoose.connection })
var sessionConfig = Object.assign({}, require('./config').session, {store})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(function(req, res, next) {
  req.session.visitCount = req.session.visitCount + 1 || 1;
  res.send('Visits: ' + req.session.visitCount)
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middleware/sendHttpError'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (req.app.get('env') === 'development') {
    if (err instanceof HttpError) {
      return res.sendHttpError(err)
    }
    res.locals.message = err.message;
    res.locals.error = err;
  }
  else {
    res.locals.message = 'Internal server error';
    res.locals.error = {};
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
