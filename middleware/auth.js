const jwt = require('jsonwebtoken')

module.exports.is_auth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err) => {
      if (err) {
        // If fails to verify, clear jwt cookie
        res.clearCookie('jwt')
        // Redirect to login page
        res.redirect('/user/login')
      } else {
        // If verification successful,
        // redirect to homepage
        res.redirect('/')
      }
    })
  } else {
    //if token doesn't exist, 
    // pass to next handler
    next()
  }
}

module.exports.require_control = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'inodeska', (err) => {
      if (err) {
        // If fails to verify, clear 'jwt' cookie
        res.clearCookie('jwt')
        // Redirect to login page
        res.redirect('/user/login')
      } else {
        // If verification successful, 
        // pass to the next handler
        next()
      }
    })
  } else {
    // If token doesn't exist, 
    // redirect to login page
    res.redirect('/user/login')
  }
}
