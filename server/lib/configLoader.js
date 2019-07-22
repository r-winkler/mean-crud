'use strict';

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const env = process.env.NODE_ENV;

console.log(`Node environment: ${env}`);
console.log(`loading config.${env}.json`);

// FIXME: replace with ES6 import/export syntax ...
module.exports = require(`../config/config.${env}.json`);