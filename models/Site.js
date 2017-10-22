const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
const slug = require('mongoose-slug-generator');

const navigationSchema = new mongoose.Schema({
  label: String,
  url: String,
  order: Number,
}, { timestamps: true });

const pageSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  slug: { type: String, unique: true, slug: 'title', slug_padding_size: 4 },
  title: String,
  content: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: Boolean,
}, { timestamps: true });

const siteSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, index: true },
  url: { type: String, unique: true },
  title: String,
  description: String,
  logoImageUrl: String,
  coverImageUrl: String,
  postPerPage: Number,
  facebookPageUrl: String,
  twitterProfileUrl: String,
  timeZone: String,
  isPrivate: Boolean,
  members: [mongoose.Schema.Types.ObjectId], // It might not be needed in near future
  navigations: [navigationSchema],
  pages: [pageSchema],
}, { timestamps: true });

siteSchema.plugin(arrayUniquePlugin); // Haven't tested it yet
pageSchema.plugin(slug);

const Site = mongoose.model('Site', siteSchema);
const Page = mongoose.model('Page', pageSchema);

module.exports = { Site, Page };
