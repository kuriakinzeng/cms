const Site = require('../models/Site');

/**
 * POST /sites
 * Create a new site
 */
exports.postSite = (req, res, next) => {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('url', 'Url cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.json(errors);
  } else {
    const owner = req.user._id;
    const members = [owner];
    const { url, title } = req.body;

    new Site({
      title,
      url,
      owner,
      members,
    }).save()
      .then((site) => {
        res.status(201).send({ site });
      })
      .catch(err => next(err));
  }
};

/**
 * GET /sites/:id
 * Get site
 */
exports.getSite = (req, res, next) => {
  const id = req.params.id;

  Site.findOne({ _id: id })
    .populate('owner', 'email profile')
    .populate('members', 'email profile')
    // .populate('navigations', 'label url order')
    // .populate('pages', 'slug permalink title content author')
    .then((site) => {
      if (!site) {
        return res.json({ status: 'Site not found' });
      }
      res.send({ site });
    })
    .catch(err => next(err));
};

/**
 * GET /sites/:id
 * Get site
 */
exports.getDefaultSite = (req, res, next) => {
  Site.findOne({})
    .populate('owner', 'email profile')
    .populate('members', 'email profile')
    // .populate('navigations', 'label url order')
    // .populate('pages', 'slug permalink title content author')
    .then((site) => {
      if (!site) {
        return res.json({ status: 'Site not found' });
      }
      res.send({ site });
    })
    .catch(err => next(err));
};

/**
 * PUT /sites/:id
 * Update site
 */
exports.putSite = (req, res, next) => {
  req.assert('title', 'Title cannot be blank').notEmpty();
  // req.assert('url', 'Url cannot be blank').notEmpty();
  if (req.body.facebookPageUrl) {
    req.assert('facebookPageUrl', 'Enter a valid Facebook URL').optional().matches('https://facebook.com/*');
  }
  if (req.body.twitterProfileUrl) {
    req.assert('twitterProfileUrl', 'Enter a valid Twitter URL').optional().matches('https://twitter.com/*');
  }
  if (req.body.email) {
    req.assert('email', 'Please enter a valid email address.').optional().isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
  }

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin/general');
  }

  Site.findOne({ _id: req.params.id })
    .then((site) => {
      if (!site) {
        return res.send({ status: 'Site not found' });
      }

      site.url = req.body.url || site.url;
      site.title = req.body.title || site.title;
      site.description = req.body.description;
      if (req.files.logoImageUrl) {
        site.logoImageUrl = `${req.headers.origin}/uploads/${req.files.logoImageUrl[0].filename}`;
      }
      if (req.files.coverImageUrl) {
        site.coverImageUrl = `${req.headers.origin}/uploads/${req.files.coverImageUrl[0].filename}`;
      }
      if (req.files.faviconImageUrl) {
        site.faviconImageUrl = `${req.headers.origin}/uploads/${req.files.faviconImageUrl[0].filename}`;
      }
      site.postPerPage = req.body.postPerPage || site.postPerPage;
      site.facebookPageUrl = req.body.facebookPageUrl;
      site.twitterProfileUrl = req.body.twitterProfileUrl;
      site.email = req.body.email;
      site.address = req.body.address;
      site.timeZone = req.body.timeZone || site.timeZone;
      if (site.isPrivate !== undefined) {
        site.isPrivate = req.body.isPrivate;
      }
      site.members = req.body.members || site.members;
      site.navigations = req.body.navigations || site.navigations;
      site.pages = req.body.pages || site.pages;

      site.save()
        .then(() => {
          req.flash('success', { msg: 'Site information has been updated.' });
          res.redirect('/admin/general');
        });
    })
    .catch(err => next(err));
};

/**
 * DEL /sites/:id
 * Delete site
 */
exports.deleteSite = (req, res, next) => {
  Site.findOne({ _id: req.params.id })
    .then((site) => {
      if (!site) {
        return res.send({ status: 'Site not found' });
      }

      site.remove()
        .then(() => {
          res.json({ message: 'Site deleted' });
        });
    })
    .catch(err => next(err));
};
