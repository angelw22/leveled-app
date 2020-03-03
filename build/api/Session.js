"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _db = _interopRequireDefault(require("../db"));

var _utils = require("../utils");

var bcrypt = require('bcrypt');

var sessionRoutes = function sessionRoutes(app) {
  app.get('/api/session', function _callee(req, res) {
    var user;
    return _regenerator["default"].async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _regenerator["default"].awrap((0, _utils.getUser)(req.session.id));

          case 2:
            user = _context.sent;

            if (user) {
              res.status(200).send({
                ok: true,
                data: JSON.parse(user).username
              });
            } else {
              res.status(200).send({
                ok: false
              });
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  app.post('/api/session', function (req, res) {
    _db["default"].query("SELECT password FROM users WHERE username = '".concat(req.body.username, "'")).then(function (dbResponse) {
      if (dbResponse.rows[0] === undefined) {
        res.status(200).send({
          ok: false
        });
      } else {
        bcrypt.compare(req.body.password, dbResponse.rows[0].password, function (err, authResponse) {
          if (err) {
            throw new Error(err);
          }

          ;

          if (authResponse === true) {
            // update session
            req.session.username = req.body.username;
            req.session.isLoggedIn = true;
            res.status(200).send({
              ok: true,
              data: "Welcome, ".concat(req.session.username)
            });
          } else {
            res.status(200).send({
              ok: false
            });
          }
        });
      }
    })["catch"](function (e) {
      return console.error(e.stack);
    });
  });
  app["delete"]('/api/session', function _callee2(req, res) {
    var destroySession;
    return _regenerator["default"].async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            destroySession = function _ref(channel, message) {
              if (channel === 'socketID destroyed' && message && req) {
                req.session.destroy(function (err) {
                  if (err) {
                    res.status(200).send({
                      ok: false
                    });
                  } else {
                    res.status(200).send({
                      ok: true
                    });
                  }

                  socketEventSub.off('message', destroySession);
                });
              }
            };

            sessionEventPub.publish('destroying sessionID', req.sessionID);
            socketEventSub.on('message', destroySession);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
};

var _default = sessionRoutes;
exports["default"] = _default;