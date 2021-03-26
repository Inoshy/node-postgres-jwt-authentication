const bcrypt = require('bcrypt')
const db = require('../../db/config')
const jwt = require('jsonwebtoken')
const validator = require('validator')

module.exports.get = (req, res) => {
  res.render('register.html')
}

module.exports.post = async (req, res) => {
  let { name, email, password, password2 } = req.body
  let check_existing
  let validation_err = ''

  // Trim spaces from username and email
  name = name.replace(/\s/g, '')
  email = email.replace(/\s/g, '')

  // Check username length
  if (name.length < 3 || name.length > 10) {
    validation_err = 'Username too short!'

    // Render register page with error message
    res.render('register.html', { validation_err })

    // Early exit from function
    return
  }

  // Check email length
  if (email.length < 10 || name.length > 80) {
    validation_err = 'Username too short!'

    // Render register page with error message
    res.render('register.html', { validation_err })

    // Early exit from function
    return
  }

  // Check if improper username 
  if (!validator.isAlpha(name)) {
    validation_err = 'Improper Username!'

    // Render register page with error message
    res.render('register.html', { validation_err })

    // Early exit from function
    return
  }

  // Check if improper email
  if (!validator.isEmail(email)) {
    validation_err = 'Improper Email!'

    // Render register page with error message
    res.render('register.html', { validation_err })

    // Early exit from function
    return
  }

  // Check if passwords not match
  if (password != password2 || password !== password2) {
    validation_err = 'Passwords do not match!'

    // Render register page with error message
    res.render('register.html', { validation_err })

    // Early exit from function
    return
  }

  // Check if password is short
  if (password.length < 6) {
    validation_err = 'Password too short!'

    // Render register page with error message
    res.render('register.html', { validation_err })

    // Early exit from function
    return
  }

  try {
    // Check if email is already in database
    check_existing = await db.query(
      'SELECT email FROM users WHERE name = $1 OR email = $2',
      [name, email]
    )
  } catch (err) {
    validation_err = 'Error occured on our end! Please try later!'
    res.render('register.html', { validation_err })
  }

  // If username or email are taken
  if (check_existing.rowCount > 0) {
    validation_err = 'Email or Username already registered!'

    // Render register page with error message
    res.render('register.html', { validation_err: validation_err })

    // Early exit from function
    return
  }

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
