'use strict';

const Storage = require('node-persist').create();
const NameFactory = require('./NameFactory');

class StorageWrapper {
  constructor(api, log, type, name) {
    this._key = `${type}.${NameFactory.generate(name)}.json`;
    log(`Switch ${name} is stored in file ${this._key}`);

    this._ready = Storage.init({ dir: api.user.persistPath() });
  }

  store(value, callback) {
    this._ready
      .then(() => Storage.setItem(this._key, value))
      .then(() => callback())
      .catch(callback);
  }

  retrieve(defaultValue, callback) {
    this._ready
      .then(() => Storage.getItem(this._key))
      .then((data) => {
        if (data === undefined) {
          data = defaultValue;
        }

        callback(undefined, data);
      })
      .catch((error) => callback(error, defaultValue));
  }
}

module.exports = StorageWrapper;
