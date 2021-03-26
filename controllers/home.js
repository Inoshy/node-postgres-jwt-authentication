
module.exports.get_home = async (req, res) => {
  // res.locals api doc http://expressjs.com/en/api.html#res.locals
  // If decoded token exists at res.locals,
  if (res.locals.decoded_token) {
    // Render homepage with decoded token info
    res.render('index.html', { user: res.locals.decoded_token })
  } else {
    // If token doesn't exist
    // show homepage only
    res.render('index.html')
  }
}
