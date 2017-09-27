const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

// Contact page
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};

// Send email via nodemailer
exports.postContact = (req, res) => {
  req.assert('name', 'Name required').notEmpty();
  req.assert('email', 'Valid email required').isEmail();
  req.assert('message', 'Message required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: 'user@example.com',
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
