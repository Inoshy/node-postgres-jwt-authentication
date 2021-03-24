module.exports.create_jwt = (res, token) => {
  return res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3
  })
}
