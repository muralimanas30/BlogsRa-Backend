
/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

const authenticator = require('../middleware/authentication')
const express = require('express')
const router = express.Router()
const { createAccount, getAccountDetails, deleteAccount,verifyPassword } = require('../controllers/accountControllers');
const { getPosts, uploadPost, deletePost } = require('../controllers/postControllers');


 /* -------------------------------------------------------------------------- */
 /*                               Account routes                               */
 /* -------------------------------------------------------------------------- */
router.post('/account', authenticator, createAccount);  //  auth required
router.get('/account', authenticator, getAccountDetails);  // Auth required
router.delete('/account', authenticator, deleteAccount);

 /* -------------------------------------------------------------------------- */
 /*                                 Post routes                                */
 /* -------------------------------------------------------------------------- */

router.get('/posts', authenticator, getPosts);  // Auth required
router.post('/post', authenticator, uploadPost);  // Auth required
router.delete('/post', authenticator, deletePost);  // Auth required

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */
module.exports = router