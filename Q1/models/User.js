const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  files: [String],
});

module.exports = mongoose.model('Q1', userSchema);