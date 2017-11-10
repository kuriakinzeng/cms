const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const pageSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  slug: { type: String, unique: true, slug: 'title', slug_padding_size: 4 },
  title: String,
  content: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: Boolean,
}, { timestamps: true });

pageSchema.plugin(slug);

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
