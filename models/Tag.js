const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const tagSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  name: { type: String, index: true },
  slug: { type: String, slug: 'name', slug_padding_size: 1 }
}, { timestamps: true });

tagSchema.plugin(slug);
tagSchema.index({ siteId: 1, name: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
