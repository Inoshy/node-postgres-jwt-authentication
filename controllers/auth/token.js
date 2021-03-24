const jwt = require('jsonwebtoken')

module.exports.sign_token = id => {
  return jwt.sign({ id }, 'inodeska', {
    expiresIn: 3 * 24 * 60 * 60
  })
}

module.exports.decode_token = token => {
  return jwt.verify(token, 'inodeska').id
}
