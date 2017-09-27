const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  name: String,
  theme: String
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
