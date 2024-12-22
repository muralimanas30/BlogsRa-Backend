const AccountStatus = require('../models/AccountStatus'); // Import the AccountStatus model
const { StatusCodes } = require('http-status-codes'); // For HTTP status codes
const CustomError = require('../error/CustomError'); // Assuming you have a custom error handler

 /* -------------------------------------------------------------------------- */
 /*                           CREATE ACCOUNT FUNCTION                          */
 /* -------------------------------------------------------------------------- */
const createAccount = async (req, res) => {
    try {
        const { userId, name, email } = req.user;
        console.log(req.user)
        
        // Validate that all required fields are present
        if (!userId || !name || !email) {
            throw new CustomError('Please provide userId, name, and email', StatusCodes.BAD_REQUEST);
        }
        let newAccount = await AccountStatus.findOne({ email });
        if(!newAccount){
            newAccount = await AccountStatus.create({
                userId,
                name,
                email,
            });
        }

        // Respond with the newly created account details (excluding sensitive information like passwords)
        res.status(StatusCodes.CREATED).json({
            user: {
                userId: newAccount.userId,
                name: newAccount.name,
                email: newAccount.email,
                bio: newAccount.bio, // Default bio set in schema
                profilePictureUrl: newAccount.profilePictureUrl, // Default profile picture URL,
                blogStats:newAccount.blogStats,
                createdAt: newAccount.createdAt, // Account creation timestamp
            },
            message: 'Account successfully created',
        });
    } catch (error) {
        console.error(error);
        throw new CustomError(error.message || 'An error occurred while creating the account', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

 /* -------------------------------------------------------------------------- */
 /*                        GET ACCOUNT DETAILS FUNCTION                        */
 /* -------------------------------------------------------------------------- */
const getAccountDetails = async (req, res) => {
    try {
        const { userId } = req.user;

        // Find the account details for the authenticated user
        const user = await AccountStatus.findOne({ userId });

        if (!user) {
            throw new CustomError('Account not found', StatusCodes.NOT_FOUND);
        }

        // Return the user account details
        res.status(StatusCodes.OK).json({
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profilePictureUrl: user.profilePictureUrl,
                blogStats: user.blogStats, // Include stats like posts, followers, etc.
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error(error);
        throw new CustomError(error.message || 'An error occurred while fetching account details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

 /* -------------------------------------------------------------------------- */
 /*                           DELETE ACCOUNT FUNCTION                          */
 /* -------------------------------------------------------------------------- */
const deleteAccount = async (req, res) => {
    try {
        const { email } = req.user;

        // Find and delete the user's account using the userId
        const user = await AccountStatus.findOneAndDelete({ email });

        if (!user) {
            throw new CustomError('Account not found', StatusCodes.NOT_FOUND);
        }

        // Optionally, delete related data such as posts, comments, etc.
        // For example:
        // await Post.deleteMany({ userId });

        // Send a response confirming the account was successfully deleted
        res.status(StatusCodes.OK).json({
            message: 'Account successfully deleted',
        });
    } catch (error) {
        console.error(error);
        throw new CustomError(error.message || 'An error occurred while deleting the account', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

 /* -------------------------------------------------------------------------- */
 /*                  Export the functions to be used in routes                 */
 /* -------------------------------------------------------------------------- */
module.exports = { createAccount, getAccountDetails, deleteAccount };
