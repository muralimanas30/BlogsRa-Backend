const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                ACCOUNT SCHEMA, ALL POSTS WILL BE LINKED HERE SOON               */
/* -------------------------------------------------------------------------- */


const PostListSchema = mongoose.Schema({
    accountId: {
        type: String, // Can be a custom string identifier
        unique: true, // Optional for uniqueness if needed
    },
    posts: {
        default:[],
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
    },
});
module.exports = mongoose.model('PostsOfAccount', PostListSchema);













