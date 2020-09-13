const Keyv = require('keyv');

const settings = new Keyv('redis://@localhost:6379');

module.exports = settings;