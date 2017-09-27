'use strict';

const bluebird = require('bluebird');
const request = bluebird.promisifyAll(require('request'), { multiArgs: true });
const cheerio = require('cheerio');
const fb = require('fbgraph');
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Show index of API examples
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

// Google Maps
exports.getGoogleMaps = (req, res) => {
  res.render('api/google-maps', {
    title: 'Google Maps API'
  });
};


// Cheerio - web scraping library
exports.getScraping = (req, res, next) => {
  request.get('https://news.ycombinator.com/', (err, request, body) => {
    if (err) { return next(err); }
    const $ = cheerio.load(body);
    const links = [];
    $('.title a[href^="http"], a[href^="https"]').each((index, element) => {
      links.push($(element));
    });
    res.render('api/cheerio', {
      title: 'Cheerio - Web Scraping',
      links
    });
  });
};

// Stripe - payment
exports.getStripe = (req, res) => {
  res.render('api/stripe', {
    title: 'Stripe API',
    publishableKey: process.env.STRIPE_PKEY
  });
};

exports.postStripe = (req, res) => {
  stripe.charges.create({
    amount: 1,
    currency: 'sgd',
    source: req.body.stripeToken,
    description: req.body.stripeEmail
  }, (err) => {
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Card declined.' });
      return res.redirect('/api/stripe');
    }
    req.flash('success', { msg: 'Payment is successful.' });
    res.redirect('/api/stripe');
  });
};

// Twilio - SMS
exports.getTwilio = (req, res) => {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

exports.postTwilio = (req, res, next) => {
  req.assert('number', 'Phone number is required.').notEmpty();
  req.assert('message', 'Message is required.').notEmpty();

  const err = req.validationErrors();

  if (err) {
    req.flash('errors', err);
    return res.redirect('/api/twilio');
  }

  const message = {
    to: req.body.number,
    from: '+6591234567',
    body: req.body.message
  };
  twilio.sendMessage(message, (err, responseData) => {
    if (err) { return next(err.message); }
    req.flash('success', { msg: `Text sent to ${responseData.to}.` });
    res.redirect('/api/twilio');
  });
};


// Aviary - image processing library.
exports.getAviary = (req, res) => {
  res.render('api/aviary', {
    title: 'Aviary API'
  });
};

// File upload
exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File has been uploaded.' });
  res.redirect('/api/upload');
};