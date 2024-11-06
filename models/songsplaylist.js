const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  audioPath: { type: String, required: true }
});

module.exports = mongoose.model('Playlistsong', songSchema);