'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRouter = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRouter = exports.userRouter = _express2.default.Router();
userRouter.post('/signup', _user2.default.signup);
userRouter.post('/login', _user2.default.login);
userRouter.post('/test', _passport2.default.authenticate('jwt', { session: false }), _user2.default.test);

// invoiceRouter
//   .route('/:id')
//   .put(passport.authenticate('jwt', { session: false }), invoiceController.update)
//   .delete(passport.authenticate('jwt', { session: false }), invoiceController.delete)
//   .get(passport.authenticate('jwt', { session: false }), invoiceController.findOne);
//# sourceMappingURL=user.router.js.map