'use strict';

var inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Formats = hap.Formats;
    const Perms = hap.Perms;

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Random: value
    ///////////////////////////////////////////////////////////////////////////////////////////
    Characteristic.RandomValue = function () {
      Characteristic.call(this, 'Value', Characteristic.RandomValue.UUID);

      this.setProps({
        format: Formats.INT,
        minValue: 0,
        maxValue: 10000,
        perms: [Perms.READ, Perms.NOTIFY],
      });

      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.RandomValue, Characteristic);
    Characteristic.RandomValue.UUID = '6B9FAFFF-1F2D-45D8-A8C7-521309858F56';
  }
};
