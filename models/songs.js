const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioPath: { type: String, required: true }
});

module.exports = mongoose.model('Songs', songSchema);
