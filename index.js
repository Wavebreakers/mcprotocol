const ProtocolService = require('./mcprotocol');
const app = new ProtocolService;

const states = {
	reading: false,
	writing: false,
};

const dsn = {
	port: 1025,
	host: '192.168.1.10',
	ascii: false,
}

let commands = {
	TEST1: 'D0,5',	// 5 words starting at D0
	TEST2: 'M6990,28',	// 28 bits at M6990
	TEST3: 'CN199,2',	// ILLEGAL as CN199 is 16-bit, CN200 is 32-bit, must request separately
	TEST4: 'R2000,2',	// 2 words at R2000
	TEST5: 'X034',	// Simple input
	TEST6: 'D6000.1,20',	// 20 bits starting at D6000.1
	TEST7: 'D6001.2',	// Single bit at D6001
	TEST8: 'S4,2',	// 2 bits at S4
	TEST9: 'RFLOAT5000,40',	// 40 floating point numbers at R5000
};

app.initiateConnection(dsn, onConnected);

function onConnected(error) {
	if (error) {
		console.error(error);
		process.exit();
	}
	app.setTranslationCB(tag => commands(tag));
	app.addItems(['TEST1', 'TEST4']);
	app.addItems('TEST6');
	app.readAllItems((error, values) => {
		if (error) {
			console.error(error);
		}
		console.log(values);
		states.reading = false;
		process.exit();
	});
}