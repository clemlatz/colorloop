const nconf = require('nconf');
const hue   = require("node-hue-api");

var HueApi = new hue.HueApi();

// Load configuration
nconf.argv().env().file({ file: 'config.json' });

// If host is undefined, look for the 1st bridge and get IP address
let host = nconf.get('host');
if (typeof host === 'undefined') {
  hue.nupnpSearch().then(function(bridges) {

    if (bridges.length === 0) {
      throw "Cannot find any Hue bridges on your local network.";
    }

    host = bridges[0].ipaddress;
    registerUser(host);
  }).done();
} else {
  registerUser(host);
}
