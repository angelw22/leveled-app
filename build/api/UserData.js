"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

var userDataRoutes = function userDataRoutes(app) {
  app.post('/api/userdata', function (req, res) {
    var text = "SELECT upload_info FROM users WHERE username = '".concat(req.body.username, "';");

    _db["default"].query(text).then(function (dbResponse) {
      // console.log(dbResponse.rows[0]);
      res.status(201).send({
        ok: true,
        data: dbResponse.rows[0]
      });
    })["catch"](function (e) {
      res.status(200).send({
        ok: false
      });
      console.error(e.stack);
    });
  });
};

var _default = userDataRoutes;
exports["default"] = _default;