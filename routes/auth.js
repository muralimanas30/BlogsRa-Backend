/* -------------------------------------------------------------------------- */
/*                                   IMPORT                                   */
/* -------------------------------------------------------------------------- */
const authenticator = require('../middleware/authentication')
const express = require('express')
const router = express.Router()
const {register,login,deleteUser,deleteAllUserr,getAll,googleLogin,verifyPassword } = require('../controllers/auth')

/* -------------------------------------------------------------------------- */
/*               ALL ROUTES REQUIRE AUTHENTICATION, AUTH ROUTES               */
/* -------------------------------------------------------------------------- */

router.post('/google/callback', googleLogin); // Google login handler
router.get('/getall',authenticator,getAll)
router.post('/verifyPassword',authenticator,verifyPassword)
router.post('/register',register)
router.post('/login',login)
router.delete('/deleteall',authenticator,deleteAllUserr)
router.delete('/',authenticator,deleteUser)

module.exports =  router