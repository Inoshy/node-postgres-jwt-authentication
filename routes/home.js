const { Router } = require('express')
const control = require('../controllers/home')
const middleware = require('../middleware/home') 

const router = Router()

// Validate token with a middleware
router.use('/', (req, res, next) => {
  middleware.token_validate(req, res, next)
})

router.get('/', control.get_home)

module.exports = router