'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveTranslations = exports.parseTranslationsConfig = exports.parseTranslations = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _recursiveReaddir = require('recursive-readdir');

var _recursiveReaddir2 = _interopRequireDefault(_recursiveReaddir);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matchTranslations = function matchTranslations(content, regex) {
  var translations = [];

  if (content) {
    regex.forEach(function (_ref) {
      var tag = _ref.tag,
          value = _ref.value;

      var tags = content.match(tag);

      if (tags) {
        tags.forEach(function (item) {
          var match = item.match(value);

          if (match) {
            translations.push(match[1]);
          }
        });
      }
    });
  }

  return translations;
};

var parseTranslations = function parseTranslations(targetDir, regex) {
  return new _promise2.default(function (resolve, reject) {
    (0, _recursiveReaddir2.default)(targetDir, ['^*.js'], function (err, files) {
      if (err) {
        reject(err);
        return;
      }

      var result = {};
      files.reduce(function (res, item) {
        return res.push.apply(res, (0, _toConsumableArray3.default)(matchTranslations(_fs2.default.readFileSync(item, { encoding: 'UTF-8' }), regex))), res;
      }, []).forEach(function (item) {
        return _lodash2.default.set(result, item, '');
      });

      resolve(result);
    });
  });
};

var parseJson = function parseJson(data) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

var readJsonFile = function readJsonFile(src) {
  var data = _fs2.default.readFileSync(src, { encoding: 'UTF-8' });

  if (!data) {
    return null;
  }

  data = parseJson(data, null);

  if (!data) {
    throw new Error('File must be a valid json file. (' + src + ')');
  }

  return data;
};

var writeJsonFile = function writeJsonFile(dest, data) {
  return _fs2.default.writeFileSync(dest, (0, _stringify2.default)(data, null, 2));
};

var parseTranslationsConfig = function parseTranslationsConfig(configPath) {
  configPath = _path2.default.resolve(configPath);
  var workDir = _path2.default.resolve('' + _path2.default.parse(configPath).dir);
  var data = readJsonFile(configPath);

  if (!data) {
    throw new Error('Invalid configuration.');
  }

  if (!Array.isArray(data.languages) || data.languages.length === 0) {
    throw new Error('Configuration must have "languages".');
  }

  if (!data.outputDir) {
    throw new Error('Configuration must have "outputDir".');
  } else {
    data.outputDir = _path2.default.resolve('' + workDir + _path2.default.sep + data.outputDir);
  }

  if (!data.sourceDir) {
    throw new Error('Configuration must have "sourceDir".');
  } else {
    data.sourceDir = _path2.default.resolve('' + workDir + _path2.default.sep + data.sourceDir);
  }

  return data;
};

var saveTranslations = function saveTranslations(items, config) {
  if ((0, _keys2.default)(items).length > 0) {
    config.languages.forEach(function (language) {
      var translationPath = _path2.default.resolve('' + config.outputDir + _path2.default.sep + language + '.json');

      writeJsonFile(translationPath, _lodash2.default.merge(readJsonFile(translationPath) || {}, items));
    });
  }
};

exports.parseTranslations = parseTranslations;
exports.parseTranslationsConfig = parseTranslationsConfig;
exports.saveTranslations = saveTranslations;