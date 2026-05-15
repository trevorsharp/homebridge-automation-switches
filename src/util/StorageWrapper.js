'use strict';

const fs = require('fs');
const path = require('path');

const NameFactory = require('./NameFactory');

class StorageWrapper {
  constructor(api, log, type, name) {
    this._key = `${type}.${NameFactory.generate(name)}.json`;
    this._path = path.join(api.user.persistPath(), this._key);
    log(`Switch ${name} is stored in file ${this._key}`);
  }

  store(value, callback) {
    fs.writeFile(this._path, JSON.stringify(value), callback);
  }

  retrieve(defaultValue, callback) {
    fs.readFile(this._path, 'utf8', (error, data) => {
      if (error) {
        if (error.code === 'ENOENT') {
          callback(undefined, defaultValue);
          return;
        }

        callback(error, defaultValue);
        return;
      }

      try {
        callback(undefined, JSON.parse(data));
      } catch (parseError) {
        callback(parseError, defaultValue);
      }
    });
  }
}

module.exports = StorageWrapper;
