const jwt = require('jsonwebtoken')

module.exports.is_auth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err, decoded_token) => {
      if (err) {
        console.log(err)
        res.clearCookie('jwt')
        res.redirect('/user/login')
      } else {
        res.redirect('/')
        console.log(decoded_token)
      }
    })
  } else {
    next()
  }
}

module.exports.require_control = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err, decoded_token) => {
      if (err) {
        console.log(err)
        res.clearCookie('jwt')
        res.redirect('/user/login')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/user/login')
  }
}
