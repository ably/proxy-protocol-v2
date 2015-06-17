var decode = require('../lib/decode'),
	v1_decode = require('../lib/v1_decode'),
	v1_encode = require('../lib/v1_encode');

exports.v1_TCP4_encode_decode = function(test) {
	var socketDetails = {
		remoteFamily: 'IPv4',
		remoteAddress: '12.34.56.78',
		localAddress: '127.0.0.1',
		remotePort: 1234,
		localPort: 8080,
		protocol: 'tcp'
	};

	try {
		var buf = v1_encode(socketDetails),
			v1_decoded = v1_decode(buf, true),
			decoded = decode(buf, true);

		test.expect(2);
		test.deepEqual(socketDetails, v1_decoded);
		test.deepEqual(socketDetails, decoded);
		test.done();
	} catch(e) {
		test.ok(false, 'Unexpected exception running test; err = ' + e);
		test.done();
	}
};

exports.v1_TCP6_encode_decode = function(test) {
	var socketDetails = {
		remoteFamily: 'IPv6',
		remoteAddress: 'fe80::62c5:47ff:fe8a:d2e0',
		localAddress: 'fe80::1',
		remotePort: 1234,
		localPort: 8080,
		protocol: 'tcp'
	};

	try {
		var buf = v1_encode(socketDetails),
			v1_decoded = v1_decode(buf, true),
			decoded = decode(buf, true);

		test.expect(2);
		test.deepEqual(socketDetails, v1_decoded);
		test.deepEqual(socketDetails, decoded);
		test.done();
	} catch(e) {
		test.ok(false, 'Unexpected exception running test; err = ' + e);
		test.done();
	}
};
