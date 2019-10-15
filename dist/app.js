'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _httpStatusCodes = require('http-status-codes');

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _globalMiddleware = require('./middlewares/global-middleware');

var _main = require('./config/main.config');

var _main2 = require('./routes/main.router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mongoose
_mongoose2.default.Promise = global.Promise; // ==================================== IMPORT LIBRARY ======================================

_mongoose2.default.connect(_main.mainConfig.urlDb, { useNewUrlParser: true });
_mongoose2.default.set('useCreateIndex', true);
var app = (0, _express2.default)();
var port = _main.mainConfig.port;

// register global middleware
(0, _globalMiddleware.setGlobalMiddleware)(app);
app.use('/api', _main2.mainRouter);

app.use(function (req, res, next) {
  var error = new Error('Not found');
  error.message = "Invalid route";
  error.status = _httpStatusCodes2.default.NOT_FOUND;
  next(error);
});
app.use(function (err, req, res, next) {
  return res.status(err.status || _httpStatusCodes2.default.INTERNAL_SERVER_ERROR).json({
    error: {
      message: err.message
    }
  });
});

app.listen(port, function () {
  console.log('Server is up and running on port numner ' + port);
});
//# sourceMappingURL=app.js.map