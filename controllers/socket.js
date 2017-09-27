// socket.io usage examples
exports.index = (req, res, next) => {
  res.render('socket', {
    title: 'Socket Example'
  });
};