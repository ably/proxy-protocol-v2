"use strict";

module.exports = function decode(buf, validate) {
	var socketDetails = {},
		parts = String(buf).split(' '),
		sig = parts[0],
		family = parts[1],
		remoteAddress = parts[2],
		localAddress = parts[3],
		remotePort = Number(parts[4]),
		localPort = Number(parts[5]),
		crlf = parts[6];

	if(validate) {
		if(sig !== 'PROXY') {
			throw new Error('proxy protocol: invalid signature received');
		}

		if(family !== 'TCP4' && family !== 'TCP6') {
			throw new Error('proxy protocol: unsupported family received');
		}

		if(crlf !== '\r\n') {
			throw new Error('proxy protocol: invalid end of line received');
		}
	}

	socketDetails.protocol = 'tcp';
	socketDetails.remoteFamily = (family == 'TCP4') ? 'IPv4' : 'IPv6';
	socketDetails.remoteAddress = remoteAddress;
	socketDetails.localAddress = localAddress;
	socketDetails.remotePort = remotePort;
	socketDetails.localPort = localPort;

	return socketDetails;
};
