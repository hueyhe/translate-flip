const env = process.env.NODE_ENV || 'development';

module.exports = require(`./webpack.${env}.config.js`);
