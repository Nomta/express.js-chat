exports.post = async function(req, res) {
  req.session.destroy()
  res.redirect('/')
}