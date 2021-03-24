const db = require('../db/config')
const jwt = require('jsonwebtoken')

module.exports.get_home = async (req, res) => {
  token = req.cookies.jwt
  if (token) {
    // Retrieve user id from decoded token
    user_id = jwt.decode(token).user_id
    // Retrieve user data from id
    retrieve_user = await db.query('SELECT name FROM users WHERE id = $1', [
      user_id
    ])
    if (retrieve_user.rowCount > 0) {
      const username = retrieve_user.rows[0].name
      res.render('index.html', { username })
    } else {
      res.send('Error retrieving data')
    }
  } else {
    res.render('index.html')
  }
}
