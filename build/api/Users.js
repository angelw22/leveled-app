"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

var bcrypt = require('bcrypt');

var userRoutes = function userRoutes(app) {
  app.post('/api/users', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        throw new Error(err);
      }

      var text = "INSERT INTO users(username, password) VALUES($1, $2) RETURNING *";

      _db["default"].query(text, [req.body.username, hash]).then(function (dbResponse) {
        console.log(dbResponse.rows[0]);
        res.status(201).send({
          ok: true
        });
      })["catch"](function (e) {
        res.status(200).send({
          ok: false
        });
        console.error(e.stack);
      });
    });
  });
};

var _default = userRoutes;
exports["default"] = _default;