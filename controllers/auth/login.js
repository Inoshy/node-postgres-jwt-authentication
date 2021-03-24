const bcrypt = require('bcrypt')
const db = require('../../db/config')
const jwt = require('jsonwebtoken')

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

          // Get user id from databse
          user_id = existing_user.rows[0].id

          // Sign token with user id
          const token = jwt.sign({ user_id }, 'inodeska', {
            expiresIn: 3 * 24 * 60 * 60
          })

          // Set cookie 'jwt' with signed token
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 3
          })

          // Redirect to homepage
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
