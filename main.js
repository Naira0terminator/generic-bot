const Client = require('./src/structures/client');
const client = new Client();

client.start();

module.exports = client;

