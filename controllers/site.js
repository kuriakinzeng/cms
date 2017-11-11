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
      members
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
 * PUT /sites/:id
 * Update site
 */
exports.putSite = (req, res, next) => {
  Site.findOne({ _id: req.params.id })
    .then((site) => {
      if (!site) {
        return res.send({ status: 'Site not found' });
      }

      site.url = req.body.url || site.url;
      site.title = req.body.title || site.title;
      site.description = req.body.description || site.description;
      site.logoImageUrl = req.body.logoImageUrl || site.logoImageUrl;
      site.coverImageUrl = req.body.coverImageUrl || site.coverImageUrl;
      site.postPerPage = req.body.postPerPage || site.postPerPage;
      site.facebookPageUrl = req.body.facebookPageUrl || site.facebookPageUrl;
      site.twitterProfileUrl = req.body.twitterProfileUrl || site.twitterProfileUrl;
      site.timeZone = req.body.timeZone || site.timeZone;
      if (site.isPrivate !== undefined) {
        site.isPrivate = req.body.isPrivate;
      }
      site.members = req.body.members || site.members;
      site.navigations = req.body.navigations || site.navigations;
      site.pages = req.body.pages || site.pages;

      site.save()
        .then((site) => {
          res.send({ site });
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
