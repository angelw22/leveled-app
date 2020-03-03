"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisClient = void 0;

var _Session = _interopRequireDefault(require("./api/Session"));

var _Users = _interopRequireDefault(require("./api/Users"));

var _Uploading = _interopRequireDefault(require("./api/Uploading"));

var _UserData = _interopRequireDefault(require("./api/UserData"));

var express = require('express');

var session = require('express-session');

var Redis = require('ioredis');

var redisClient = new Redis();
exports.redisClient = redisClient;

var RedisStore = require('connect-redis')(session);

var cors = require('cors');

var app = express();
var sess = {
  secret: process.env.SESSION_SECRET_KEY,
  name: 'leveledSession',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 86400000
  },
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    client: redisClient
  })
};

if (process.env.MODE !== 'dev') {
  // setting for reverse proxy in prod
  app.enable("trust proxy"); // HTTPS-only cookies

  sess.cookie.secure = true;
}

app.use(cors({
  origin: process.env.MODE === 'dev' ? ['http://localhost:3000'] : ['https://leveled.cf', 'https://www.leveled.cf'],
  credentials: true
}));
app.use(session(sess));
app.use(express.json()); // routes

(0, _Session["default"])(app);
(0, _Users["default"])(app);
(0, _Uploading["default"])(app);
(0, _UserData["default"])(app);
app.listen(8000, function () {
  console.log("Leveled app listening on port: 8000");
});