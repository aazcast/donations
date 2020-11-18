const express = require('express');
const app = express();
const fs = require('graceful-fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const processError = require('./handlers/error/processError');
const GError = require('./handlers/error/gerror');
const routes = require('./routes');
//Databases
const db = require('./db');

//RealTime
const pubnub = require('./handlers/pubnub');

// app.use(morgan('combined', {stream: accessLogStream}));
app.disable('x-powered-by');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '200mb', extended: false}));

// parse application/json
app.use(bodyParser.json({limit: '500mb', extended: true}));


app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', process.env.APP_URL);
  res.header('Acces-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', function (req,res) { res.sendStatus(200); });

app.use(express.static(path.join(__dirname, 'views')));

//Ger Cookies
app.use(cookieParser());


//Start
app.get('/', (req, res) => {
  res.send('Hello, you should not be here');
});

//Load the Api Routes
app.use('/api/', routes);

//Load Postgre Database
db.load();

//Connect to Pubnub Socket
pubnub.startSocket();

//Error handler validation
app.use((err, req, res, next) => {
  processError.handle(err, res);
});

//Record any unhandled rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Rejection at: Promise', p, 'reason:', reason);
  const error = new GError('99', 'unhandledRejection: ' + reason + ' IN ' + p, 500, false, null, true);
  processError.handle(error);
});

process.on('uncaughtException', (error) => {
  console.log('>uncaughtException at: Promise', error);
  const err = new GError('99', 'uncaughtException ' + error, 500, true, error.stack, true);
  processError.handle(err);
});

module.exports = app;