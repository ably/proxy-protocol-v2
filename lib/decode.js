var common = require('./common');

module.exports = function decode(buf, validate) {
	var socketDetails = {},
	fields = common.fields,
	enc_family = buf[fields.family],
	family = enc_family & 0xf0,
	protocol = enc_family & 0x0f;

	if(validate) {
		var sigBytes = common.sigBytes,
			sigLength = sigBytes.length,
			receivedSig = buf.slice(0, sigLength);

		if(sigBytes.compare(receivedSig)) {
			throw new Error('proxy protocol: invalid signature received');
		}

		if(buf[fields.ver_cmd] != common.V2_PROXY) {
			throw new Error('proxy protocol: invalid version or cmd received');
		}

		if(family !== common.families.AF_INET && family !== common.families.AF_INET6) {
			throw new Error('proxy protocol: unsupported family received');
		}

		if(protocol !== common.protocols.STREAM && protocol !== common.protocols.DGRAM) {
			throw new Error('proxy protocol: unsupported protocol received');
		}
	}

	socketDetails.protocol = (protocol == common.protocols.STREAM) ? 'tcp' : 'udp';

	if(family == common.families.AF_INET) {
		socketDetails.remoteFamily = 'IPv4';
		var ipv4Addr = common.ipv4Addr, addr = fields.addr;
		socketDetails.remoteAddress = decodeV4Address(buf, addr + ipv4Addr.src_addr);
		socketDetails.localAddress = decodeV4Address(buf, addr + ipv4Addr.dst_addr);
		socketDetails.remotePort = decodePort(buf, addr + ipv4Addr.src_port);
		socketDetails.localPort = decodePort(buf, addr + ipv4Addr.dst_port);
	} else {
		socketDetails.remoteFamily = 'IPv6';
		var ipv6Addr = common.ipv6Addr, addr = fields.addr;
		socketDetails.remoteAddress = decodeV6Address(buf, addr + ipv6Addr.src_addr);
		socketDetails.localAddress = decodeV6Address(buf, addr + ipv6Addr.dst_addr);
		socketDetails.remotePort = decodePort(buf, addr + ipv6Addr.src_port);
		socketDetails.localPort = decodePort(buf, addr + ipv6Addr.dst_port);
	}

	return socketDetails;
};

function decodePort(buf, offset) {
	return buf.readUInt16BE(offset, true);
}

function decodeV4Address(buf, offset) {
	var address = new Array(4);
	for(var i = 0; i < 4; i++)
		address[i] = Number(buf[offset + i]).toString();

	return address.join('.');
}

function decodeV6Address(buf, offset) {
	var address = new Array(8);
	for(var i = 0; i < 8; i++)
		address[i] = Number(buf.readUInt16BE(offset + i * 2, true)).toString(16);

	return address.join(':').replace(/(?::|^)(?:0:){2,}/, '::');
}
