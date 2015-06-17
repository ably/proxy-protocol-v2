"use strict";

var common = require('./v2_common');
var dgramSocket = require('dgram').Socket;
var ipAddress = require('ip-address');

module.exports = function encode(socketDetails) {
	var family = socketDetails.remoteFamily || 'IPv4',
		protocol = socketDetails.protocol || (socketDetails.constructor === dgramSocket ? 'udp' : 'tcp'),
		sigBytes = common.sigBytes,
		sigLength = sigBytes.length,
		fields = common.fields,
		buf;

	if(family == 'IPv4') {
		var ipv4Addr = common.ipv4Addr, addr = fields.addr;
		buf = new Buffer(addr + ipv4Addr.len);
		buf[fields.family] = common.families.AF_INET + (protocol === 'udp' ? common.protocols.DGRAM : common.protocols.STREAM);
		buf[fields.len] = ipv4Addr.len;
		encodeV4Address(buf, addr + ipv4Addr.src_addr, socketDetails.remoteAddress);
		encodeV4Address(buf, addr + ipv4Addr.dst_addr, socketDetails.localAddress);
		encodePort(buf, addr + ipv4Addr.src_port, socketDetails.remotePort);
		encodePort(buf, addr + ipv4Addr.dst_port, socketDetails.localPort);
	} else if(family == 'IPv6') {
		var ipv6Addr = common.ipv6Addr, addr = fields.addr;
		buf = new Buffer(addr + ipv6Addr.len);
		buf[fields.family] = common.families.AF_INET6 + (protocol === 'udp' ? common.protocols.DGRAM : common.protocols.STREAM);
		buf[fields.len] = ipv6Addr.len;
		encodeV6Address(buf, addr + ipv6Addr.src_addr, socketDetails.remoteAddress);
		encodeV6Address(buf, addr + ipv6Addr.dst_addr, socketDetails.localAddress);
		encodePort(buf, addr + ipv6Addr.src_port, socketDetails.remotePort);
		encodePort(buf, addr + ipv6Addr.dst_port, socketDetails.localPort);
	} else {
		throw new Error('Unsupported address family: ' + family);
	}

	sigBytes.copy(buf, fields.sig);
	buf[fields.ver_cmd] = common.V2_PROXY;

	return buf;
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
