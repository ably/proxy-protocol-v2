"use strict";

var dgramSocket = require('dgram').Socket;

module.exports = function encode(socketDetails) {
	var family = socketDetails.remoteFamily || 'IPv4',
		protocol = socketDetails.protocol || (socketDetails.constructor === dgramSocket ? 'udp' : 'tcp'),
		afString;

	if(protocol == 'udp')
		throw new Error('Unsupported protocol: udp');


	if(family == 'IPv4') {
		afString = 'TCP4';
	} else if(family == 'IPv6') {
		afString = 'TCP6';
	} else {
		throw new Error('Unsupported address family: ' + family);
	}

	return 	new Buffer([
		'PROXY',
		afString,
		socketDetails.remoteAddress,
		socketDetails.localAddress,
		socketDetails.remotePort,
		socketDetails.localPort
	].join(' ') + '\r\n');
};

function encodePort(buf, offset, port) {
	buf.writeUInt16BE(port, offset, true);
}

function encodeV4Address(buf, offset, address) {
	var addr = address.split('.');
	for(var i = 0; i < addr.length; i++) buf[offset + i] = Number(addr[i]);
}

function encodeV6Address(buf, offset, address) {
	var addr = new ipAddress.v6.Address(address),
		parsedAddress = addr.parsedAddress;

	for(var i = 0; i < parsedAddress.length; i++) buf.writeUInt16BE(Number.parseInt(parsedAddress[i], 16), offset + i * 2, true);
}
