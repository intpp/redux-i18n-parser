'use strict';

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var params = (0, _commandLineArgs2.default)(_config2.default.commandLineArgs);

if (!params.config) {
  throw new Error('Missing required argument "config"');
}

var translationsConfig = (0, _utils.parseTranslationsConfig)(params.config);

(0, _utils.parseTranslations)(translationsConfig.sourceDir, _config2.default.regex).then(function (translations) {
  return (0, _utils.saveTranslations)(translations, translationsConfig);
});