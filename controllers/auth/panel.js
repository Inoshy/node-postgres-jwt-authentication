const db = require('../../db/config')
const jwt = require('./token')

module.exports.get = async (req, res) => {
  const token = req.cookies.jwt
  const user_id = jwt.decode_token(token)
  try {
    retrieve_user = await db.query(
      'SELECT name, email FROM users WHERE id = $1',
      [user_id]
    )
    if (retrieve_user.rowCount > 0) {
      username = retrieve_user.rows[0].name
      usermail = retrieve_user.rows[0].email
      res.render('control.html', { username, usermail })
    }
  } catch (err) {
    console.log(err)
    res.send('Error Retrieving Data!')
  }
}
