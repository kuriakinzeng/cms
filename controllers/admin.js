/**
 * GET /admin/
 * Admin page.
 */
exports.index = (req, res) => {
  // res.render('admin/index', {
  //   title: 'Admin'
  // });
  res.redirect('admin/new-page');
};

/**
 * GET /admin/new-page
 * New page admin page.
 */
exports.getNewPage = (req, res) => {
  res.render('admin/new-page', {
    title: 'New Page - Admin'
  });
};

/**
 * GET /admin/content
 * Content admin page.
 */
exports.getContent = (req, res) => {
  res.render('admin/content', {
    title: 'Content - Admin'
  });
};

/**
 * GET /admin/general
 * General admin page.
 */
exports.getGeneral = (req, res) => {
  res.render('admin/general', {
    title: 'General - Admin'
  });
};

/**
 * GET /admin/navigation
 * Navigation admin page.
 */
exports.getNavigation = (req, res) => {
  res.render('admin/navigation', {
    title: 'Navigation - Admin'
  });
};