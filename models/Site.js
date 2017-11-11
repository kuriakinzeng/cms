const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');

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
  isPrivate: { type: Boolean, default: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // It might not be needed in near future
  navigations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Navigation' }],
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
}, { timestamps: true });

siteSchema.plugin(arrayUniquePlugin); // Haven't tested it yet

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;
