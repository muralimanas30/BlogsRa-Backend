const AccountStatus = require('../models/AccountStatus');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../error/CustomError');
const cloudinary = require('../utility/cloudinary');
const PostList = require('../models/PostList');
require("dotenv").config()
const PostSchema = require('../models/Post')

/* -------------------------------------------------------------------------- */
/*                           CREATE ACCOUNT FUNCTION                          */
/* -------------------------------------------------------------------------- */
const createAccount = async (req, res, next) => {
    try {
        const { userId, name, email, byOAuth } = req.user;

        // Validate input
        if (!userId || !name || !email) {
            throw new CustomError('Missing required fields: userId, name, or email', StatusCodes.BAD_REQUEST);
        }

        // Check if account already exists
        let existingAccount = await AccountStatus.findOne({ email });
        if (!existingAccount) {
            existingAccount = await AccountStatus.create({
                userId,
                name,
                email,
                byOAuth,
            });
        }

        console.log(existingAccount.name, existingAccount.email, existingAccount.byOAuth)
        // Respond with account details
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Account successfully created',
            user: {
                accountId: existingAccount._id,
                userId: existingAccount.userId,
                name: existingAccount.name,
                email: existingAccount.email,
                bio: existingAccount.bio,
                profilePicture: existingAccount.profilePicture,
                blogStats: existingAccount.blogStats,
                createdAt: existingAccount.createdAt,
                byOAuth: existingAccount.byOAuth,
                updatedAt: existingAccount.updatedAt,
            },
        });
    } catch (error) {
        next(new CustomError(error.message || 'Failed to create account', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


/* -------------------------------------------------------------------------- */
/*                           UPDATE ACCOUNT FUNCTION                          */
/* -------------------------------------------------------------------------- */
const updateAccount = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { bio } = req.body;
        const file = req.file;

        if (!email) {
            throw new CustomError('Please provide email', StatusCodes.BAD_REQUEST);
        }

        let existingAcc = await AccountStatus.findOne({ email });

        if (!existingAcc) {
            throw new CustomError('Account not found', StatusCodes.NOT_FOUND);
        }

        existingAcc.bio = bio || existingAcc.bio;
        let imageUrl = existingAcc.profilePicture;

        if (file) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                resource_type: 'image',
            });
            imageUrl = uploadResult.secure_url;
            existingAcc.profilePicture = imageUrl;
        }
        existingAcc.updatedAt = Date.now();
        await existingAcc.save();

        res.status(StatusCodes.OK).json({
            user: {
                bio: existingAcc.bio,
                profilePicture: existingAcc.profilePicture,
                updatedAt: existingAcc.updatedAt,
            },
            success: true,
            message: 'Account successfully updated',
        });


        console.log(`Account successfully updated:
            Email: ${email}
            Bio: ${existingAcc.bio || 'No bio provided'}
            Profile Picture: ${existingAcc.profilePicture || 'No profile picture available'}`);

        await updateProfileForAllPosts(existingAcc._id,
            existingAcc.profilePicture
        )

    } catch (error) {
        next(new CustomError(error.message || 'An error occurred while updating the account', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR));

    }
};
const updateProfileForAllPosts = async (accountId, newProfilePictureUrl) => {
    try {
        // Step 1: Find the PostList document for the user
        const postList = await PostList.findOne({ accountId });
        if (!postList) {
            console.error("No PostList found for the given accountId");
            return;
        }

        // Step 2: Extract the posts array
        const postIds = postList.posts;
        console.log(postIds)
        // Step 3: Update each post's profilePicture
        await PostSchema.updateMany(
            { _id: { $in: postIds } }, // Match all posts in the array
            { $set: { profilePicture: newProfilePictureUrl } } // Update profilePicture
        );

        console.log(`Successfully updated profilePicture for ${postIds.length} posts`);
    } catch (error) {
        console.error("Error updating profile pictures:", error);
    } finally {
        // Close the database connection
    }
}

/* -------------------------------------------------------------------------- */
/*                        GET ACCOUNT DETAILS FUNCTION                        */
/* -------------------------------------------------------------------------- */
const getAccountDetails = async (req, res, next) => {
    try {
        const { userId } = req.body;
        console.log(userId + " From get account details")
        // Validate userId is provided
        if (!userId) {
            throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
        }

        const user = await AccountStatus.findOne({ userId });

        if (!user) {
            next(new CustomError('Account not found', StatusCodes.NOT_FOUND));
            return
        }

        // Return the user account details
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Account details fetched successfully',
            user: {
                accountId: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                blogStats: user.blogStats, // Include stats like posts, followers, etc.
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                byOAuth: false
            },
        });
    } catch (error) {

        next(new CustomError(error.message || 'An error occurred while fetching account details', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

/* -------------------------------------------------------------------------- */
/*                           DELETE ACCOUNT FUNCTION                          */
/* -------------------------------------------------------------------------- */
const deleteAccount = async (req, res, next) => {
    try {
        const { email } = req.user;
        if (!email) {
            throw new CustomError('Email is required to delete the account', StatusCodes.BAD_REQUEST);
        }

        // Find and delete the user's account using the userId
        const user = await AccountStatus.findOneAndDelete({ email });

        if (!user) {
            throw new CustomError('Account not found', StatusCodes.NOT_FOUND);
        }

        // Optionally, delete related data such as posts, comments, etc.
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Account successfully deleted',
        });
    } catch (error) {
        next(new CustomError(error.message || 'An error occurred while deleting the account', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


const idFromName = async (req, res, next) => {
    
    try {
        
        const { name } = req.params;
        if (!name || typeof name !== 'string') {
            throw new CustomError('Invalid name provided', StatusCodes.BAD_REQUEST);
        }
        const response = await AccountStatus.find(
            { name: { $regex: name, $options: 'i' } }
            )
            .select('name profilePicture userId')
            .limit(3)

        if (!response.length) {
            throw new CustomError('No account found with the given name', StatusCodes.NOT_FOUND);
        }
        res.status(StatusCodes.OK).json({ success: true, data: response });
    } catch (error) {
        next(new CustomError(error.message || 'An error occurred while getting name from account', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

const sendInitiatorResponse = async (req, res, next) => {
    res.status(StatusCodes.OK).json({ success: true });
}

/* -------------------------------------------------------------------------- */
/*                  Export the functions to be used in routes                 */
/* -------------------------------------------------------------------------- */
module.exports = { createAccount, getAccountDetails, deleteAccount, updateAccount, idFromName, sendInitiatorResponse };
