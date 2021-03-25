const bcrypt = require('bcrypt')
const db = require('../../db/config')
const jwt = require('jsonwebtoken')

module.exports.get = (req, res) => {
  res.render('register.html')
}

module.exports.post = async (req, res) => {
  const { name, email, password } = req.body
  let check_existing_email
  let validation_err = ''
  try {
    // Check if email is already in database
    check_existing_email = await db.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    )
  } catch (err) {
    validation_err = 'Error occured on our end! Please try later!'
    res.send('register.html', { validation_err })
  }
  // If email is already registered, show error message
  if (check_existing_email.rowCount > 0) {
    validation_err = 'Email already registered!'
    res.render('register.html', { validation_err: validation_err })
  } else {
    let hashed_password
    // Hash password
    try {
      hashed_password = await bcrypt.hash(password, 10)
    } catch (err) {
      // If hashing fails, show error message
      validation_err = 'Error Occured! Please try later!'
      // Re-render the page after delay
      setTimeout(() => {
        res.render('register.html', { validation_err })
      }, 3000)
      // Early exit from function
      return
    }
    let insert_user
    // If successlly hashed, try to insert user data in database
    try {
      insert_user = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, hashed_password]
      )
    } catch (err) {
      validation_err = 'Error occured on our end! Please try later!'
      res.render('register.html', { validation_err })
      return
    }
    // If user is registered successfully
    if (insert_user.rowCount > 0) {
      // Get the user id
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
  }
}
