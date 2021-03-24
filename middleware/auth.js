const jwt = require('jsonwebtoken')

const is_auth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err, decoded_token) => {
      if (err) {
        console.log(err)
        res.cookie('jwt', '', {
          maxAge: 0
        })
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

const require_control = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err, decoded_token) => {
      if (err) {
        console.log(err)
        res.cookie('jwt', '', {
          maxAge: 0
        })
        res.redirect('/user/login')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/user/login')
  }
}

module.exports = { is_auth, require_control }
