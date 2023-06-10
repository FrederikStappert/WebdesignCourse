var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon =require('serve-favicon')
const bodyparser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config()

const url = 'mongodb+srv://Hald:Test1234@cluster0.k8190jd.mongodb.net/?retryWrites=true&w=majority'

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var createRouter = require('./routes/createUser');
var pickupRouter = require('./routes/pickup');

const bodyParser = require("body-parser");

var app = express();

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true})
const con = mongoose.connection

con.on('open',function (){
  console.log('connected....')
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname,'public/assets')))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, '/public/images', 'favicon.ico')))

app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true,
}));

app.use('/', indexRouter);
app.use('/login',loginRouter);
app.use('/create',createRouter);
app.use('/pickup',pickupRouter)

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

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