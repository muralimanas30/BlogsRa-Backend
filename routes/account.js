
/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

const authenticator = require('../middleware/authentication')
const multer = require('multer')
const path = require('path')
const express = require('express')
const router = express.Router()
const { createAccount, getAccountDetails, deleteAccount, updateAccount } = require('../controllers/accountControllers');
const { getPosts, createPost, deletePost,updatePost,deleteEverything } = require('../controllers/postControllers');



/* -------------------------------------------------------------------------- */
/*                                multer setup                                */
/* -------------------------------------------------------------------------- */
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const upload2 = multer({ storage: storage2 });
/* -------------------------------------------------------------------------- */
/*                               Account routes                               */
/* -------------------------------------------------------------------------- */
router.post('/account', authenticator, createAccount);  //  auth required
router.post('/accountdetails', getAccountDetails)
router.delete('/account', authenticator, deleteAccount);
router.post('/accountupdate', authenticator, upload2.single('profilePicture'), updateAccount)

/* -------------------------------------------------------------------------- */
/*                                 Post routes                                */
/* -------------------------------------------------------------------------- */


// Define the routes for the /post endpoint with the authenticator middleware
router.route('/post')
    .get(authenticator, getPosts)      // Auth required
    .post(authenticator,upload2.single('file'),createPost)   // Auth required
// Define the route for deleting a post
router.delete('/post/:postId', authenticator, deletePost); // Auth required to delete a post

// Define the route for updating a post
router.patch('/post/:postId', authenticator,updatePost ); // Auth required to update a post
router.delete('/delete-everything', authenticator, deleteEverything); // Auth requireds
/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */
module.exports = router