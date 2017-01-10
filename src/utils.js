import fs from 'fs';

const parseJson = (data, defaultValue = {}) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

const readJsonFile = (src) => new Promise((resolve, reject) => {
  fs.readFile(src, { encoding: 'UTF-8' }, (error, data) => {
    if (error) {
      return reject(error);
    }

    if (!data) {
      return resolve(null);
    }

    data = parseJson(data, null);

    if (!data) {
      return reject(new Error(`File must be a valid json file. (${src})`));
    }

    return resolve(data);
  });
});

const writeJsonFile = (dest, data) => new Promise((resolve, reject) => {
  fs.writeFile(dest, JSON.stringify(data, null, 2), (error) => {
    if (error) {
      return reject(error);
    }

    return resolve();
  });
});

export {
  readJsonFile,
  writeJsonFile,
  parseJson,
};