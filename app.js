#!/usr/bin/env node

'use strict';

const nconf = require('nconf');
const hue   = require('node-hue-api');
const fs    = require('fs');
const yargs = require('yargs')

// Load configuration
const configFile = process.env.HOME + '/.colorloop'
nconf.argv().env().file({ file: configFile });

yargs
   .usage('$0 --light [id]')
   .option('l', {
     'alias': 'light',
     'describe': 'the light to set in color loop mode'
   })
   .help()
   .argv

if (typeof yargs.argv.light !== 'undefined' && yargs.argv.light !== true) {
  nconf.set('light', yargs.argv.light)
}

let username = nconf.get('username');
let light = nconf.get('light');

const registerUser = function(host) {
  const hueApi = new hue.HueApi();
  hueApi.registerUser(host, 'colorloop')
    .then(function(user) {
      nconf.set('username', user);
      nconf.save();
      process.stdout.write(`A new device has been registered on the bridge with id ${user} and cached locally for future uses.\n`);
    })
    .fail(function(err) {
      process.stdout.write(`An error occured while trying to register a new device. Did you press the link button on your Hue bridge?\n`);
      process.exit();
    })
    .done();
};

const setColorLoop = function() {

  if (!username) {
    registerUser(host);
    return;
  }

  if (!light) {
    process.stdout.write(`Specify the light to set in colorloop with the --light argument. I will remember it next time. \n`);
    process.exit();
  }

  const api = new hue.HueApi(host, username),
    state = hue.lightState.create()

    api.setLightState(light, state.on().effectColorLoop())
      .then(function(result) {
        if (result === true) {
          process.stdout.write('Colorloop mode enabled! \n');
        }
      })
      .fail(function(err) {
        process.stdout.write('An API error occured. Light may be color-enabled. \n');
      })
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
    setColorLoop();
  }).done();
} else {
  setColorLoop();
}

nconf.save();
