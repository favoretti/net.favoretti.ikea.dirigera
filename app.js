'use strict';

const Homey = require('homey');
const nodeDirigeraClient = require('dirigera');

const lightDriverName = 'light';
const groupDriverName = 'group';

class IkeaDirigeraGatewayApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('IkeaDirigeraGatewayApp has been initialized');

    this._gatewayConnected = false;

    this._lights = {};
    this._groups = {};

    (async (args, callback) => {
      try {
        await this.connect();
      } catch (err) {
        this.log(err.message);
      }
    })();

    // const lights = await this._client.lights.list();
    // this.log(lights);
  }

  async connect() {
    this._gatewayConnected = false;
    if (this._dirigera != null) {
      this._dirigera.destroy();
    }
    this._dirigera = await nodeDirigeraClient.createDirigeraClient({
      accessToken: this.homey.settings.get('accessToken'),
    });
    this._gatewayConnected = true;
    this._dirigera.startListeningForUpdates(
      async (updateEvent) => {
        this.log(JSON.stringify(updateEvent));
      },
    );
    this.log('Connected to DIRIGERA gateway');
  }

  isGatewayConnected() {
    return this._gatewayConnected;
  }

  async getLights() {
    this._lights = await this._dirigera.lights.list();
    return this._lights;
  }

  setLightIsOn(tradfriInstanceId, on) {
    this.log('setLightOnOff: Sending command', on);
    return this._dirigera.lights.setIsOn(tradfriInstanceId, on);
  }

}
module.exports = IkeaDirigeraGatewayApp;
