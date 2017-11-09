const Tag = require('../models/Tag');
const Promise = require('bluebird');

/**
 * POST /pages
 * Create a new page
 */
exports.postTag = (req, res) => {
  req.assert('tags', 'Tags cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.json(errors);
  } else {
    const siteId = req.params.id;
    const { tags } = req.body;
    // split it into array, so we can multiple insert at same time using comma separator
    const tagsArr = tags.split(', ');
    return Promise.all(tagsArr.map(tagName => Tag.findOne({
      name: tagName,
      siteId
    })
      .then((tag) => {
        if (!tag) {
          return Tag.create({
            name: tagName,
            siteId
          });
        }
        return Promise.resolve(tag);
      })
      .then(tag => tag)))
      .then(tagsData => res.json(tagsData))
      .catch(err => res.json(err));
  }
};

exports.deleteTag = (req, res) => {
  const siteId = req.params.id;
  const tagId = req.params.tagId;

  return Tag.findOneAndRemove({ siteId, _id: tagId })
    .then((data) => {
      if (data) {
        return res.json(data);
      }
      throw new Error('Tag not found');
    })
    .catch(err => res.json({
      success: false,
      message: err.message
    }));
};

exports.getAllTag = (req, res) => {
  const siteId = req.params.id;
  const { name } = req.query;

  const condition = {
    siteId,
  };
  if (name) {
    condition.name = {
      $regex: `.*${name}.*`,
    };
  }

  return Tag.find(condition)
    .limit(10)
    .then(tags => {
      return res.json(tags);
    });
};
