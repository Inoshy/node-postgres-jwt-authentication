module.exports.get = (req, res) => {
  token = req.cookies.jwt
  if (token) {
    res.clearCookie('jwt')
  }
  res.redirect('/')
}