'use strict';

const { Driver } = require('homey');

class MyDriver extends Driver {

  async onInit() {
    this.log('Tradfri Light Driver has been initialized');
  }

  updateCapabilities(tradfriDevice) {
    for (const device of this.getDevices()) {
      if (device.getData().id === tradfriDevice.instanceId) {
        device.updateCapabilities(tradfriDevice);
      }
    }
  }

  async onPairListDevices() {
    const devices = [];
    if (!this.homey.app.isGatewayConnected()) {
      throw new Error('First go to Settings -> Apps -> IKEA Tradfri Gateway to configure.');
    } else {
      const lights = await this.homey.app.getLights();
      for (const light of lights) {
        let capabilities = [];
        if (light.capabilities.canReceive.includes('isOn')) {
          capabilities.push('onoff');
        }
        if (light.capabilities.canReceive.includes('lightLevel')) {
          capabilities.push('dim');
        }
        if (light.capabilities.canReceive.includes('colorTemperature')) {
          capabilities.push('light_temperature');
        }
        if (light.capabilities.canReceive.includes('colorHue')) {
          capabilities.push('light_hue');
        }
        if (light.capabilities.canReceive.includes('colorSaturation')) {
          capabilities.push('light_saturation');
        }
        devices.push({
          data: {
            id: light.id,
          },
          capabilities,
          name: (light['attributes'].customName !== '' ? light['attributes'].customName : light['attributes'].model),
        });
      }
      return devices.sort(MyDriver._compareHomeyDevice);
    }
  }

  static _compareHomeyDevice(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

}

module.exports = MyDriver;
