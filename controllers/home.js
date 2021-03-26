const db = require('../db/config')

module.exports.get_home = async (req, res) => {
  if (req.decoded_token) {
    // Retrieve user id via http
    const user_id = req.decoded_token.user_id

    let retrieve_user
    let data_retrieve_error = ''

    // Try to retrieve user fromm database with id
    try {
      retrieve_user = await db.query('SELECT name FROM users WHERE id = $1', [
        user_id
      ])
    } catch (err) {
      // If connection fails, show error
      data_retrieve_error = 'Error retrieving data'

      // Then render homepage
      res.render('index.html', { data_retrieve_error })

      // Early exit from function
      return
    }

    if (retrieve_user.rowCount > 0) {
      // If user exists, get name from database
      const username = retrieve_user.rows[0].name

      // Render homepage and pass user data
      res.render('index.html', { username })
    } else {
      // If user is deleted from database
      // while logged in, clear jwt cookie
      res.clearCookie('jwt')

      // Redirect them to register page
      res.redirect('/user/register')
    }
  } else {
    // If token doesn't exist, show
    // homepage but don't pass user data
    res.render('index.html')
  }
}
