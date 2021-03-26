const jwt = require('jsonwebtoken')

module.exports.token_validate = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err, decoded_token) => {
      // If verification fails,
      if (err) {
        // Clear jwt cookie
        res.clearCookie('jwt')
      } else {
        // If verification successful,
        // Pass decoded token via http
        req.decoded_token = decoded_token
      }
    })
  }
  // Pass to next handler
  next()
}
