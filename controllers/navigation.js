const Navigation = require('../models/Navigation');

/**
 * POST /sites/:id/navigations
 * Create a new navigation
 */
exports.postNavigation = (req, res, next) => {
  req.assert('navigations', 'No navigation to add').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.json(errors);
  } else {
    const site = req.params.id;
    const { navigations } = req.body;

    const merged = [...new Set(navigations.map(a => a.order))];
    if (merged.length < navigations.length) {
      return res.json({ message: 'Cannot have navigation with same order' });
    }

    const queries = [];
    const options = {
      // Return the document after updates are applied
      new: true,
      // Create a document if one isn't found.
      upsert: true,
      setDefaultsOnInsert: true
    };

    navigations.forEach((nav) => {
      const { label, url, order } = nav;
      const query = { site, url };

      queries.push(
        Navigation.findOneAndUpdate(query, {
          label, url, order
        }, options));
    });

    Promise.all(queries)
      .then((navigation) => {
        res.status(201).send({ navigation });
      })
      .catch(err => next(err));
  }
};

/**
 * GET /sites/:id/navigations
 * Get navigation
 */
exports.getAllNavigation = (req, res, next) => {
  const site = req.params.id;
  const condition = { site };

  return Navigation.find(condition)
    .then(navs => res.json(navs))
    .catch(err => next(err));
};

/**
 * DEL /sites/:id/navigations/:navigationId
 * Delete navigation
 */
exports.deleteNavigation = (req, res, next) => {
  Navigation.findOne({ _id: req.params.navigationId })
    .then((navigation) => {
      if (!navigation) {
        return res.send({ status: 'Navigation not found' });
      }

      return navigation.remove();
    })
    .then(() => {
      res.json({ message: 'Navigation deleted' });
    })
    .catch(err => next(err));
};