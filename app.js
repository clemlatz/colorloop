'use strict';

const nconf = require('nconf');
const hue   = require("node-hue-api");

// Load configuration
nconf.argv().env().file({ file: 'config.json' });

const username = nconf.get('username');
const lightId = nconf.get('lightId');

if (!username) {
  throw 'Username must be defined';
}

if (!lightId) {
  throw 'Light id must be defined';
}

const setColorLoop = function(host, username) {
  const api = new hue.HueApi(host, username),
    state = hue.lightState.create()

    api.setLightState(lightId, state.on().effectColorLoop())
      .then(function(result) {
        if (result === true) {
          process.stdout.write('Color loop mode enabled! \n');
        }
      })
      .fail(function(err) { throw err })
      .done();
}

// If host is undefined, look for the 1st bridge and get IP address
let host = nconf.get('host');
if (typeof host === 'undefined') {
  hue.nupnpSearch().then(function(bridges) {
    if (bridges.length === 0) {
      throw "Cannot find any Hue bridges on your local network.";
    }
    host = bridges[0].ipaddress;
    process.stdout.write(`Found a bridge via upnp @ ${host} \n`);
    setColorLoop(host, username);
  }).done();
} else {
  setColorLoop(host, username);
}
