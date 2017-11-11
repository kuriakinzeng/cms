const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  slug: { type: String, unique: true },
  permalink: { type: String, unique: true },
  title: String,
  content: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
