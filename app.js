const nconf = require('nconf');
const hue   = require("node-hue-api");

// Load configurationa
nconf.argv()
   .env()
   .file({ file: 'config.json' });

let host = nconf.get('host');

// If host is undefined, look for the 1st bridge and get IP address
if (typeof host === 'undefined') {
  hue.nupnpSearch().then(function(bridges) {
    host = bridges[0].ipaddress;
  }).done();
}
