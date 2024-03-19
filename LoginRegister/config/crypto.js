const crypto = require('crypto');

const config = {
  TOKEN_KEY: crypto.randomBytes(32).toString('hex')
};

module.exports = config;
