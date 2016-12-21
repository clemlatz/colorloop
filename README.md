Colorloop
=========

A simple CLI tool to enable the colorloop mode of the Hue Lightstrip Plus 
in my Christmas tree. Because I can't get Siri to do it for me.


## Install

    git clone git@github.com:iwazaru/colorloop.git
    cd colorloop
    npm install -g .
    

## Usage

Press the link button on your Hue bridge before the first use. Be sure
your computer and your bridge are the same network.

Set a light in colorloop mode:

    $ colorloop --light [id]

You must specify the light's id on first use. After that, the light's id will
be saved and you only need to use the `--light` option if you wish to target
another light.
