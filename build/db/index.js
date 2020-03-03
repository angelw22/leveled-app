"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _require = require('pg'),
    Client = _require.Client;

var pgClient = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});
pgClient.connect();
var _default = pgClient;
exports["default"] = _default;