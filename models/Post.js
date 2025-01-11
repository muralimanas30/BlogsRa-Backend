const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                          POST SCHEMA, COMING SOON                          */
/* -------------------------------------------------------------------------- */

const PostSchema = new mongoose.Schema(
    {
        accountId: { // Stores the AccountStatus _id
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AccountStatus',
            required: true,
        },
        userId: { // Stores the custom userId
            type: String,
            required: true,
        },
        name:{
            type:String
        },
        profilePicture:{
            type:String,
            
        },
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxLength: [100, 'Title cannot exceed 100 characters'],
        },
        content: {
            type: String,
            required: [true, 'Please provide content for your post'],
        },
        tags: {
            type: [String],
            default: [],
        },
        imageUrl: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);