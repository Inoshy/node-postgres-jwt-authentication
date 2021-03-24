const bcrypt = require('bcrypt')
const db = require('../../db/config')
const jwt = require('./token')
const cookies = require('./cookies')

module.exports.get = (req, res) => {
  res.render('register.html')
}

module.exports.post = async (req, res) => {
  const { name, email, password } = req.body
  let validation_err = ''
  try {
    check_existing_email = await db.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    )
    if (check_existing_email.rowCount > 0) {
      validation_err = 'Email already registered!'
      res.render('register.html', { validation_err: validation_err })
    } else {
      try {
        const hashed_password = await bcrypt.hash(password, 10)
        const insert_user = await db.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
          [name, email, hashed_password]
        )
        if (insert_user.rowCount > 0) {
          const token = jwt.sign_token(insert_user.rows[0].id)
          cookies.create_jwt(res, token)
          res.redirect('/')
        }
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
}
