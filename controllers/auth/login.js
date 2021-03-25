const bcrypt = require('bcrypt')
const db = require('../../db/config')
const jwt = require('jsonwebtoken')

module.exports.get = (req, res) => {
  res.render('login.html')
}

module.exports.post = async (req, res) => {
  const { email, password } = req.body
  let existing_user
  let login_err = ''
  try {
    // Try to retrieve user from database
    existing_user = await db.query(
      'SELECT id, password FROM users WHERE email = $1',
      [email]
    )
  } catch (err) {
    // If databse error occurs, show error message
    res.send('Error occured on our end! Please try again!')

    // Early exit from function
    return
  }
  if (existing_user.rowCount > 0) {
    let hash_match

    // If user exists, compare password
    // input with hashed password
    try {
      hash_match = await bcrypt.compare(
        password,
        existing_user.rows[0].password
      )
    } catch (err) {
      // If error occurs, show error message
      res.send('Error occured on our end! Please try later!')

      // Early exit from function
      return
    }

    if (hash_match) {
      // If password matches,
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
  } else {
    login_err = 'User not found!'
    res.render('login.html', { login_err: login_err })
  }
}
