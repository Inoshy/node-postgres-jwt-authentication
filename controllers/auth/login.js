const bcrypt = require('bcrypt')
const db = require('../../db/config')
const cookies = require('./cookies')
const jwt = require('./token')

module.exports.get = (req, res) => {
  res.render('login.html')
}

module.exports.post = async (req, res) => {
  const { email, password } = req.body
  let login_err = ''
  try {
    const existing_user = await db.query(
      'SELECT id, password FROM users WHERE email = $1',
      [email]
    )
    if (existing_user.rowCount > 0) {
      try {
        const hash_match = await bcrypt.compare(
          password,
          existing_user.rows[0].password
        )
        if (hash_match) {
          console.log('match successful')
          const token = jwt.sign_token(existing_user.rows[0].id)
          cookies.create_jwt(res, token)
          res.redirect('/')
        } else {
          login_err = 'Incorrect Password!'
          res.render('login.html', { login_err: login_err })
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      login_err = 'User not found!'
      res.render('login.html', { login_err: login_err })
    }
  } catch (err) {
    console.log(err)
  }
}
