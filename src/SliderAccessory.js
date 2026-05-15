'use strict';

const clone = require('clone');

let Characteristic, Service;

class SliderAccessory {

  constructor(api, log, config, storage) {
    Characteristic = api.hap.Characteristic;
    Service = api.hap.Service;

    this.log = log;
    this.name = config.name;
    this._config = config;

    this._storage = storage;

    const defaultValue = {
      value: config.default === undefined ? false : config.default
    };
    this._state = defaultValue;

    storage.retrieve(defaultValue, (error, value) => {
      this._state = value;
      this._sliderService.getCharacteristic(Characteristic.SliderValue)
        .updateValue(this._state.value);
    });

    this._services = this.createServices();
  }

  getServices() {
    return this._services;
  }

  createServices() {
    return [
      this.getAccessoryInformationService(),
      this.getSliderService()
    ];
  }

  getAccessoryInformationService() {
    return new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'Michael Froehlich')
      .setCharacteristic(Characteristic.Model, 'Slider')
      .setCharacteristic(Characteristic.SerialNumber, this._config.serialNumber)
      .setCharacteristic(Characteristic.FirmwareRevision, this._config.version)
      .setCharacteristic(Characteristic.HardwareRevision, this._config.version);
  }

  getSliderService() {
    this._sliderService = new Service.Slider(this.name);

    const props = {
      minValue: this._config.minValue,
      maxValue: this._config.maxValue
    };

    if (this._config.minStep !== undefined) {
      props.minStep = this._config.minStep;
    }

    this._sliderService.getCharacteristic(Characteristic.SliderValue)
      .on('set', this._setValue.bind(this))
      .setProps(props)
      .updateValue(this._state.value);

    this._sliderService.isPrimaryService = true;

    return this._sliderService;
  }

  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }

  _setValue(value, callback) {
    this.log(`Change value of ${this.name} to ${value}`);

    const data = clone(this._state);
    data.value = value;

    this._persist(data, callback);
  }

  _persist(data, callback) {
    this._storage.store(data, (error) => {
      if (error) {
        callback(error);
        return;
      }

      this._state = data;
      callback();
    });
  }
}

module.exports = SliderAccessory;
