# proxy-protocol-v2

## Overview

A simple encoder and decoder for proxy protocol headers using the v2 binary format.

See http://www.haproxy.org/download/1.5/doc/proxy-protocol.txt for details.

Supports IPv4 and IPv6, UDP and TCP, but not UNIX sockets.

## install

    npm install proxy-protocol-v2

## encode

````
var buf = require('proxy-protocol-v2').encode(socket);
````

or

````
var buf = require('proxy-protocol-v2').encode({
  remoteFamily: 'IPv4',
  remoteAddress: '12.34.56.78',
  remotePort: 1234,
  localAddress: '172.16.0.1,
  localPort: 8080,
  protocol: 'udp'
});
````

`protocol` defaults to `'tcp'` if unspecified.

## decode

````
var details = require('proxy-protocol-v2').decode(buf),
    remoteFamily = details.remoteFamily,
    remoteAddress = details.remoteAddress,
    remotePort = details.remotePort,
    localAddress = details.localAddress,
    localPort = details.localPort,
    protocol = details.prototol;
````

## test

    nodeunit test/test.js
