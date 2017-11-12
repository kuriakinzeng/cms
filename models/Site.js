const mongoose = require('mongoose');
// const arrayUniquePlugin = require('mongoose-unique-array');

const siteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' },
  url: { type: String, unique: true },
  title: String,
  description: { type: String, default: '' },
  logoImageUrl: { type: String, default: '' },
  coverImageUrl: { type: String, default: '' },
  postPerPage: { type: Number, default: 0 },
  facebookPageUrl: { type: String, default: '' },
  twitterProfileUrl: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  timeZone: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // It might not be needed in near future
  navigations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Navigation', default: [] }],
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: [] }],
}, { timestamps: true });

// siteSchema.plugin(arrayUniquePlugin); // Haven't tested it yet

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;
