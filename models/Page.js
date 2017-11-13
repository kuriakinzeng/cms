const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const pageSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  slug: { type: String, unique: true, slug: 'title', slug_padding_size: 4 },
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: Boolean,
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

pageSchema.plugin(slug);

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
