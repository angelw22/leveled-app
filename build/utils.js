"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSessionIdFromCookies = exports.getUser = exports.getRandomId = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _ = require("./");

var getRandomId = function getRandomId() {
  return (0, _v["default"])();
};

exports.getRandomId = getRandomId;

var getUser = function getUser(sessionId) {
  var sessionKey = undefined;
  var user = undefined;
  return new Promise(function (resolve, reject) {
    var stream = _.redisClient.scanStream({
      match: "sess:".concat(sessionId),
      count: 10
    });

    stream.on("data", function (resultKeys) {
      for (var i = 0; i < resultKeys.length; i++) {
        sessionKey = resultKeys[i];
        break;
      }
    });
    stream.on("end", function _callee() {
      return _regenerator["default"].async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _regenerator["default"].awrap(_.redisClient.get(sessionKey));

            case 3:
              user = _context.sent;
              resolve(user);
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 7]]);
    });
  });
};

exports.getUser = getUser;

var getSessionIdFromCookies = function getSessionIdFromCookies(cookies) {
  var regex = /(challengerSession=s%3A)/g;
  var cookiesArray = cookies.split('; ');
  var challengerCookie = cookiesArray.find(function (cookieStr) {
    return regex.test(cookieStr);
  });

  if (challengerCookie) {
    return challengerCookie.replace('challengerSession=s%3A', '').split('.')[0];
  } else {
    return null;
  }
};

exports.getSessionIdFromCookies = getSessionIdFromCookies;