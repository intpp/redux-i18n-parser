import fs from 'fs';
import path from 'path';
import recursive from 'recursive-readdir';
import _ from 'lodash';

const matchTranslations = (content, regex) => {
  const translations = [];

  if (content) {
    regex.forEach(({ tag, value }) => {
      const tags = content.match(tag);

      if (tags) {
        tags.forEach(item => {
          const match = item.match(value);

          if (match) {
            translations.push(match[1]);
          }
        });
      }
    });
  }

  return translations;
};

const parseTranslations = (targetDir, regex) => new Promise((resolve, reject) => {
  recursive(targetDir, ['^*.js'], (err, files) => {
    if (err) {
      reject(err);
      return;
    }

    const result = {};
    files
      .reduce((res, item) => (
        res.push(...matchTranslations(
          fs.readFileSync(item, { encoding: 'UTF-8' }),
          regex
        )),
          res
      ), [])
      .forEach(item => _.set(result, item, ''));

    resolve(result);
  });
});

const parseJson = (data, defaultValue = {}) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

const readJsonFile = (src) => {
  let data = fs.readFileSync(src, { encoding: 'UTF-8' });

  if (!data) {
    return null;
  }

  data = parseJson(data, null);

  if (!data) {
    throw new Error(`File must be a valid json file. (${src})`);
  }

  return data;
};

const writeJsonFile = (dest, data) => {
  return fs.writeFileSync(
    dest,
    JSON.stringify(data, null, 2)
  );
};

const parseTranslationsConfig = (configPath) => {
  configPath = path.resolve(configPath);
  const workDir = path.resolve(`${path.parse(configPath).dir}`);
  let data = readJsonFile(configPath);

  if (!data) {
    throw new Error('Invalid configuration.');
  }

  if (!Array.isArray(data.languages) || data.languages.length === 0) {
    throw new Error('Configuration must have "languages".');
  }

  if (!data.outputDir) {
    throw new Error('Configuration must have "outputDir".');
  } else {
    data.outputDir = path.resolve(`${workDir}${path.sep}${data.outputDir}`);
  }

  if (!data.sourceDir) {
    throw new Error('Configuration must have "sourceDir".');
  } else {
    data.sourceDir = path.resolve(`${workDir}${path.sep}${data.sourceDir}`);
  }

  return data;
};

const saveTranslations = (items, config) => {
  if (Object.keys(items).length > 0) {
    config.languages.forEach(language => {
      const translationPath = path.resolve(`${config.outputDir}${path.sep}${language}.json`);

      writeJsonFile(
        translationPath,
        _.merge(
          readJsonFile(translationPath) || {},
          items
        )
      );
    });
  }
};

export {
  parseTranslations,
  parseTranslationsConfig,
  saveTranslations,
};