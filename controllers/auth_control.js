const bcrypt = require('bcrypt')
const db = require('../db/config')
const jwt = require('jsonwebtoken')

const create_token = id => {
  return jwt.sign({ id }, 'inodeska', {
    expiresIn: 3 * 24 * 60 * 60
  })
}

const create_cookie = (res, token) => {
  return res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3
  })
}

module.exports.get_register = (req, res) => {
  res.render('register.html')
}

module.exports.post_register = async (req, res) => {
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
          const token = create_token(insert_user.rows[0].id)
          create_cookie(res, token)
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

module.exports.get_login = (req, res) => {
  res.render('login.html')
}

module.exports.post_login = async (req, res) => {
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
          const token = create_token(existing_user.rows[0].id)
          create_cookie(res, token)
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

module.exports.get_user_control = async (req, res) => {
  res.render('control.html')
}
