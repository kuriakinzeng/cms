const mongoose = require('mongoose');

const navigationSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  label: String,
  url: String,
  order: Number,
}, { timestamps: true });

const Navigation = mongoose.model('Navigation', navigationSchema);

module.exports = Navigation;
