exports.get = function(req, res, next) {
  res.render('chat', { title: req.user.username });
}