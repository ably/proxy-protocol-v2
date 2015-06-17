var decode = require('../lib/decode'),
	v2_decode = require('../lib/v2_decode'),
	v2_encode = require('../lib/v2_encode');

exports.v2_TCP4_encode_decode = function(test) {
	var socketDetails = {
		remoteFamily: 'IPv4',
		remoteAddress: '12.34.56.78',
		localAddress: '127.0.0.1',
		remotePort: 1234,
		localPort: 8080,
		protocol: 'tcp'
	};

	try {
		var buf = v2_encode(socketDetails),
			v2_decoded = v2_decode(buf, true),
			decoded = decode(buf, true);

		test.expect(2);
		test.deepEqual(socketDetails, v2_decoded);
		test.deepEqual(socketDetails, decoded);
		test.done();
	} catch(e) {
		test.ok(false, 'Unexpected exception running test; err = ' + e);
		test.done();
	}
};

exports.v2_TCP6_encode_decode = function(test) {
	var socketDetails = {
		remoteFamily: 'IPv6',
		remoteAddress: 'fe80::62c5:47ff:fe8a:d2e0',
		localAddress: 'fe80::1',
		remotePort: 1234,
		localPort: 8080,
		protocol: 'tcp'
	};

	try {
		var buf = v2_encode(socketDetails),
			v2_decoded = v2_decode(buf, true),
			decoded = decode(buf, true);

		test.expect(2);
		test.deepEqual(socketDetails, v2_decoded);
		test.deepEqual(socketDetails, decoded);
		test.done();
	} catch(e) {
		test.ok(false, 'Unexpected exception running test; err = ' + e);
		test.done();
	}
};
