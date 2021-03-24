const bcrypt = require('bcrypt')
const db = require('../../db/config')
const jwt = require('jsonwebtoken')

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

          // Get user id from database
          user_id = insert_user.rows[0].id

          // Sign token with user id
          const token = jwt.sign({ user_id }, 'inodeska', {
            expiresIn: 3 * 24 * 60 * 60
          })

          // Set cookie jwt with signed token
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 3
          })

          // Redirect to homepage
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
