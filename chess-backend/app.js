var express = require('express');
var logger = require('morgan');
var cors = require('cors');

var authRouter = require('./routes/auth');
var gameRouter = require('./routes/games');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/auth', authRouter);
app.use('/games', gameRouter);

module.exports = app;
