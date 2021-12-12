var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var entriesRouter = require('./routes/entries');
var messages = require('./lib/messages');
var user = require('./middleware/user');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('my shut box'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth);
app.use(user);
app.use(messages);

app.use('/users', usersRouter);
app.get('/register', registerRouter.form);
app.post('/register', registerRouter.submit);
app.get('/login', loginRouter.form);
app.post('/login', loginRouter.submit);
app.get('/logout', loginRouter.logout);
app.get('/post', entriesRouter.form);

app.post('/post', validate.required('title'),
validate.lengthAbove('title', 4),
entriesRouter.submit);

app.get('/:page?', page(Entry.count, 5), entriesRouter.list);
app.get('/api/user/:id', api.user);
app.post('/api/entry', entriesRouter.submit);
app.get('/api/entries/:page?', page(Entry.count), api.entries);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
