const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F'], required: false },
  variations: { type: [String], default: [] },
  referenceNumber: { type: String, required: false }
});

const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  characters: [characterSchema]
});

module.exports = mongoose.model('Work', workSchema);