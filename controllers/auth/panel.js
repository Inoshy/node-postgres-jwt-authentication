const db = require('../../db/config')
const jwt = require('jsonwebtoken')

module.exports.get = async (req, res) => {
  const token = req.cookies.jwt
  // Decode token verified by middleware
  // Get user id from decoded token
  const user_id = jwt.decode(token).user_id 
  try {
    // Retrieve user data found from token
    retrieve_user = await db.query(
      'SELECT name, email FROM users WHERE id = $1',
      [user_id]
    )
    if (retrieve_user.rowCount > 0) {
      username = retrieve_user.rows[0].name
      usermail = retrieve_user.rows[0].email
      res.render('control.html', { username, usermail })
    } else {
      res.send('Error retrieving user')
    }
  } catch (err) {
    res.send('Error Retrieving Data!')
  }
}
