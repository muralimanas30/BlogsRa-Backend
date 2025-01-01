
/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

const authenticator = require('../middleware/authentication')
const multer = require('multer')
const express = require('express')
const router = express.Router()
const { createAccount, getAccountDetails, deleteAccount, updateAccount } = require('../controllers/accountControllers');
const { getPosts, uploadPost, deletePost } = require('../controllers/postControllers');



/* -------------------------------------------------------------------------- */
/*                                multer setup                                */
/* -------------------------------------------------------------------------- */
const storage = multer.memoryStorage()
const upload = multer({storage:storage})

/* -------------------------------------------------------------------------- */
/*                               Account routes                               */
/* -------------------------------------------------------------------------- */
router.post('/account', authenticator, createAccount)  //  auth required
    .get('/account', authenticator, getAccountDetails)  // Auth required
    .delete('/account', authenticator, deleteAccount);
router.post('/accountupdate', authenticator,upload.single('file'),updateAccount)

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