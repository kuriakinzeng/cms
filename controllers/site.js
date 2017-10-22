const { Page } = require('../models/Site');

/**
 * POST /pages
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
    const { title, content, author_id: authorId, is_published: isPublished } = req.body;
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
