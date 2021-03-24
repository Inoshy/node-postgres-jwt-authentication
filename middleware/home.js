const jwt = require('jsonwebtoken')

module.exports.token_validate = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err) => {
      // If verification fails,
      // Clear jwt cookie
      if (err) res.clearCookie('jwt')
    })
  }
  // Pass to next handler
  next()
}
