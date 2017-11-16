const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const pageSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  slug: { type: String, unique: true, slug_padding_size: 4 },
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: false },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
}, { timestamps: true });

pageSchema.plugin(slug);

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
