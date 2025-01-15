
/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

const authenticator = require('../middleware/authentication')
const multer = require('multer')
const path = require('path')
const express = require('express')
const router = express.Router()
const { createAccount, getAccountDetails, deleteAccount, updateAccount,idFromName,sendInitiatorResponse,validateEmail } = require('../controllers/accountControllers');
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

/* ------------------------- to initiate the server ------------------------- */
router.get(`/starter`,sendInitiatorResponse)
router.get(`/name/:name`,idFromName)
router.get(`/check/:email`,validateEmail)
/* -------------------------------------------------------------------------- */
/*                               Account routes                               */
/* -------------------------------------------------------------------------- */
router.post('/account', authenticator, createAccount);  
router.post('/accountdetails', getAccountDetails)
router.delete('/account', authenticator, deleteAccount);
router.post('/accountupdate', authenticator, upload2.single('profilePicture'), updateAccount);


/* -------------------------------------------------------------------------- */
/*                                 Post routes                                */
/* -------------------------------------------------------------------------- */



router.route('/post')
    .get(authenticator, getPosts)      
    .post(authenticator,upload2.single('file'),createPost) 

router.delete('/post/:postId', authenticator, deletePost); 


router.patch('/post/:postId', authenticator,updatePost ); 
router.delete('/delete-everything', authenticator, deleteEverything);



/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */
module.exports = router