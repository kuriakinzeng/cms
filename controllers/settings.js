const Settings = require('../models/Settings');

exports.postSettings = (req, res, next) => {
  console.log('post settings', process.env.APP_NAME, req.body.theme)
  req.assert('theme', 'Theme required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }
  
  Settings.findOneAndUpdate({ name: process.env.APP_NAME }, 
    { $set: { theme: req.body.theme } },
    { new: true, upsert: true }, (err, settings) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Settings is successfully updated.' });
      res.redirect('/')
  });
};