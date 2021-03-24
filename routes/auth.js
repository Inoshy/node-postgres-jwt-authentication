const { Router } = require('express')
const controller = require('../controllers/auth/index')
const middleware = require('../middleware/auth')

const router = Router()

router.use('/user/register', (req, res, next) => {
  middleware.is_auth(req, res, next)
})

router.get('/user/register', controller.register.get)

router.post('/user/register', controller.register.post)

router.use('/user/login', (req, res, next) => {
  middleware.is_auth(req, res, next)
})

router.get('/user/login', controller.login.get)

router.post('/user/login', controller.login.post)

router.use('/user/control', (req, res, next) => {
  middleware.require_control(req, res, next)
})

router.get('/user/control', controller.panel.get)

router.get('/user/logout', controller.logout.get)

module.exports = router
