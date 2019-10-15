'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var userSchema = new Schema({
  displayName: String,
  firstName: String,
  lastName: String,
  birthDate: Date,
  sex: Boolean,
  avatar: String,
  email: {
    type: String,
    // required : true,
    lowercase: true,
    unique: true
  },
  googleId: String,
  password: {
    type: String
    // required : true 
  }
});

userSchema.pre('save', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(next) {
    var user, hash;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //'this' refers to the current document about to be saved
            user = this;

            //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
            //your application becomes.

            _context.next = 3;
            return _bcryptjs2.default.hash(this.password, 10);

          case 3:
            hash = _context.sent;

            //Replace the plain text password with the hash and then store it
            this.password = hash;
            //Indicates we're done and moves on to the next middleware
            next();

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

userSchema.methods.isValidPassword = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(password) {
    var user, compare;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = this;
            //Hashes the password sent by the user for login and checks if the hashed password stored in the 
            //database matches the one sent. Returns true if it does else false.

            _context2.next = 3;
            return _bcryptjs2.default.compare(password, user.password);

          case 3:
            compare = _context2.sent;
            return _context2.abrupt('return', compare);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();
// Export the model
exports.default = _mongoose2.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map