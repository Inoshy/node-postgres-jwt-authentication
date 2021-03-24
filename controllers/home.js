const db = require('../db/config')

module.exports.get_home = async (req, res) => {
  try {
    const fetch_users = await db.query('SELECT name FROM users')
    res.render('index.html', {
      all_user: fetch_users.rows
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports.post_home = (req, res) => {}
