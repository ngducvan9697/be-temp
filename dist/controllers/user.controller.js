'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _httpStatusCodes = require('http-status-codes');

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../services/user.service');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('../models/user.model');

var _user4 = _interopRequireDefault(_user3);

var _main = require('../config/main.config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	signup: function () {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
			var _userService$validate, error, value, user;

			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.prev = 0;
							_userService$validate = _user2.default.validateSchema(req.body), error = _userService$validate.error, value = _userService$validate.value;

							if (!(error && error.details)) {
								_context.next = 4;
								break;
							}

							return _context.abrupt('return', res.status(_httpStatusCodes.BAD_REQUEST).json(error));

						case 4:
							_context.next = 6;
							return _user4.default.create(value);

						case 6:
							user = _context.sent;
							return _context.abrupt('return', res.json({ success: true, message: 'User created successfully' }));

						case 10:
							_context.prev = 10;
							_context.t0 = _context['catch'](0);

							console.error(_context.t0);
							return _context.abrupt('return', res.status(_httpStatusCodes.INTERNAL_SERVER_ERROR).json(_context.t0));

						case 14:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, this, [[0, 10]]);
		}));

		function signup(_x, _x2) {
			return _ref.apply(this, arguments);
		}

		return signup;
	}(),
	login: function () {
		var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
			var _userService$validate2, error, value, user, matched, token;

			return _regenerator2.default.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.prev = 0;
							_userService$validate2 = _user2.default.validateSchema(req.body), error = _userService$validate2.error, value = _userService$validate2.value;

							if (!(error && error.details)) {
								_context2.next = 4;
								break;
							}

							return _context2.abrupt('return', res.status(_httpStatusCodes.BAD_REQUEST).json(error));

						case 4:
							_context2.next = 6;
							return _user4.default.findOne({ email: value.email });

						case 6:
							user = _context2.sent;

							if (user) {
								_context2.next = 9;
								break;
							}

							return _context2.abrupt('return', res.status(_httpStatusCodes.BAD_REQUEST).json({ err: 'invalid email or password' }));

						case 9:
							_context2.next = 11;
							return _bcryptjs2.default.compare(value.password, user.password);

						case 11:
							matched = _context2.sent;

							if (matched) {
								_context2.next = 14;
								break;
							}

							return _context2.abrupt('return', res.status(_httpStatusCodes.UNAUTHORIZED).json({ err: 'invalid credentials' }));

						case 14:
							token = _jsonwebtoken2.default.sign({ id: user._id }, _main.mainConfig.secret, {
								expiresIn: '1d'
							});
							return _context2.abrupt('return', res.json({ success: true, token: token }));

						case 18:
							_context2.prev = 18;
							_context2.t0 = _context2['catch'](0);

							console.error(_context2.t0);
							return _context2.abrupt('return', res.status(_httpStatusCodes.INTERNAL_SERVER_ERROR).json(_context2.t0));

						case 22:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this, [[0, 18]]);
		}));

		function login(_x3, _x4) {
			return _ref2.apply(this, arguments);
		}

		return login;
	}(),
	test: function () {
		var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
			return _regenerator2.default.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							return _context3.abrupt('return', res.json(req.currentUser));

						case 1:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, this);
		}));

		function test(_x5, _x6) {
			return _ref3.apply(this, arguments);
		}

		return test;
	}()
};
//# sourceMappingURL=user.controller.js.map