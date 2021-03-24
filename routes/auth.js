const { Router } = require('express')
const auth_control = require('../controllers/auth')
const { is_auth, require_control } = require('../middleware/auth')

const router = Router()

router.use('/user/register', (req, res, next) => {
  is_auth(req, res, next)
})

router.get('/user/register', auth_control.get_register)

router.post('/user/register', auth_control.post_register)

router.use('/user/login', (req, res, next) => {
  is_auth(req, res, next)
})

router.get('/user/login', auth_control.get_login)

router.post('/user/login', auth_control.post_login)

router.use('/user/control', (req, res, next) => {
  require_control(req, res, next)
})

router.get('/user/control', auth_control.get_user_control)

module.exports = router
