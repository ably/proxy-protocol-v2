var encode = require('../lib/encode'),
	decode = require('../lib/decode');

exports.v4_encode_decode = function(test) {
	var socketDetails = {
		remoteFamily: 'IPv4',
		remoteAddress: '12.34.56.78',
		localAddress: '127.0.0.1',
		remotePort: 1234,
		localPort: 8080,
		protocol: 'tcp'
	};

	try {
		var buf = encode(socketDetails),
			decoded = decode(buf, true);

		test.expect(1);
		test.deepEqual(socketDetails, decoded);
		test.done();
	} catch(e) {
		test.ok(false, 'Unexpected exception running test; err = ' + e);
		test.done();
	}
};

exports.v6_encode_decode = function(test) {
	var socketDetails = {
		remoteFamily: 'IPv6',
		remoteAddress: 'fe80::62c5:47ff:fe8a:d2e0',
		localAddress: 'fe80::1',
		remotePort: 1234,
		localPort: 8080,
		protocol: 'tcp'
	};

	try {
		var buf = encode(socketDetails),
			decoded = decode(buf, true);

		test.expect(1);
		test.deepEqual(socketDetails, decoded);
		test.done();
	} catch(e) {
		test.ok(false, 'Unexpected exception running test; err = ' + e);
		test.done();
	}
};
