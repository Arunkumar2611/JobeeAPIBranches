const express = require('express')
const router = express.Router()

const { getUserProfile, updatePassword } = require('../controllers/userController')
const { isAuthenticatedUser } = require('../middlewares/auth')

// router.get('/me', getUserProfile)
router.route('/me').get(isAuthenticatedUser,getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)

module.exports = router