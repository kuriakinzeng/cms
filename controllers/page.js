const slug = require('slug');
const Page = require('../models/Page');

/**
 * POST /sites/id/pages
 * Create a new page
 */
exports.postPage = (req, res, next) => {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('content', 'Content cannot be blank').notEmpty();
  req.assert('is_published', 'IsPublished cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.json(errors);
  } else {
    const siteId = req.params.id;
    const authorId = req.user._id;
    const { title, content, is_published: isPublished } = req.body;

    new Page({
      siteId,
      authorId,
      title,
      content,
      isPublished,
    }).save((err, page) => {
      if (err) {
        return next(err);
      }
      res.json({ page });
    });
  }
};

/**
 * DELETE /sites/id/pages/pageId
 * Delete page
 */
exports.deletePage = (req, res, next) => {
  const siteId = req.params.id;
  const pageId = req.params.pageId;

  Page.findOne({ _id: pageId, siteId }).then((page) => {
    if (!page) {
      return res.json({ message: 'Page not found' });
    }

    page.remove().then(() => {
      res.json({ message: 'Page deleted' });
    });
  }).catch((err) => {
    next(err);
  });
};

/**
 * PUT /sites/id/pages/pageId
 * Update page
 */
exports.putPage = (req, res, next) => {
  const siteId = req.params.id;
  const pageId = req.params.pageId;

  Page.findOne({ _id: pageId, siteId }).then((page) => {
    if (!page) {
      return res.json({ message: 'Page not found' });
    }

    page.siteId = req.body.siteId || page.siteId;
    page.authorId = req.user._id || page.authorId;
    page.title = req.body.title || page.title;
    page.content = req.body.content || page.content;
    page.isPublished = req.body.isPublished || page.isPublished;
    page.slug = slug(req.body.slug, { lower: true, charmap: '' }) || page.slug;

    page.save().then(page => res.json({ page }));
  }).catch(err => next(err));
};
