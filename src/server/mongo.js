const mongoose = require('mongoose');
const config = require('./config');
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;

function connect() {
  return mongoose.connect(config.mongoUri, { useMongoClient: true });
}

module.exports = {
  connect,
  mongoose
};