const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Artists", ref: "Albums"},
  audioPath: { type: String, required: true }
});

module.exports = mongoose.model('Songs', songSchema);
