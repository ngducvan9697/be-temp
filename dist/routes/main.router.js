'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainRouter = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('./user.router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainRouter = exports.mainRouter = _express2.default.Router();
mainRouter.use('/users', _user.userRouter);
//# sourceMappingURL=main.router.js.map