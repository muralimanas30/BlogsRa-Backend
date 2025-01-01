const AccountStatus = require('../models/AccountStatus'); // Import the AccountStatus model
const { StatusCodes } = require('http-status-codes'); // For HTTP status codes
const CustomError = require('../error/CustomError'); // Assuming you have a custom error handler
const cloudinary = require('../utility/cloudinary')
require("dotenv").config()
const fs = require('fs')
const FormData = require('form-data');
const axios = require('axios')
/* -------------------------------------------------------------------------- */
/*                           CREATE ACCOUNT FUNCTION                          */
/* -------------------------------------------------------------------------- */
const createAccount = async (req, res) => {
    try {
        const { userId, name, email, byOAuth } = req.user;

        // Validate that all required fields are present
        if (!userId || !name || !email) {
            throw new CustomError('Please provide userId, name, and email', StatusCodes.BAD_REQUEST);
        }
        let newAccount = await AccountStatus.findOne({ email });
        if (!newAccount) {
            newAccount = await AccountStatus.create({
                userId,
                name,
                email,
                byOAuth,
            });

        }
        console.log(newAccount.name, newAccount.email, newAccount.byOAuth)
        // Respond with the newly created account details (excluding sensitive information like passwords)
        res.status(StatusCodes.CREATED).json({
            user: {
                userId: newAccount.userId,
                name: newAccount.name,
                email: newAccount.email,
                bio: newAccount.bio, // Default bio set in schema
                profilePicture: newAccount.profilePicture, // Default profile picture URL,
                blogStats: newAccount.blogStats,
                createdAt: newAccount.createdAt, // Account creation timestamp
                byOAuth: newAccount.byOAuth,
                updatedAt: newAccount.updatedAt,
            },
            message: 'Account successfully created',
        });
    } catch (error) {
        console.error(error);
        throw new CustomError(error.message || 'An error occurred while creating the account', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

/* -------------------------------------------------------------------------- */
/*                           UPDATE ACCOUNT FUNCTION                          */
/* -------------------------------------------------------------------------- */
const updateAccount = async (req, res) => {
    try {
        const { email } = req.user; // Getting email from the authenticated user (req.user)
        const { bio } = req.body; // Getting bio from the request body
        const file = req.file; // The uploaded file from multer

        // Validate that email is provided
        if (!email) {
            throw new CustomError('Please provide email', StatusCodes.BAD_REQUEST);
        }

        // Find the account by email
        let existingAcc = await AccountStatus.findOne({ email });

        // If no account is found, throw an error
        if (!existingAcc) {
            throw new CustomError('Account not found', StatusCodes.NOT_FOUND);
        }

        // Update bio if it's provided
        existingAcc.bio = bio || existingAcc.bio;
        let imageUrl = existingAcc.profilePicture; // Default to existing profile picture

        // Upload profile picture if a file is provided
        if (file) {
            try {
                // Use a promise to handle the Cloudinary upload
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'image' },
                        (error, result) => {
                            if (error) {
                                return reject(new CustomError('Error uploading image to Cloudinary', StatusCodes.INTERNAL_SERVER_ERROR));
                            }
                            resolve(result); // Resolve the promise with the result
                        }
                    );

                    // Pipe the file buffer into the Cloudinary stream
                    stream.end(file.buffer); // End the stream with the file buffer
                });

                // Get the URL from the upload result
                imageUrl = uploadResult.secure_url; // Set the uploaded image URL
                existingAcc.profilePicture = imageUrl; // Update the profile picture URL

            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error.message);
                throw error; // Throw the error to be caught in the outer catch block
            }
        }

        // Update the updatedAt field to reflect the time of the update
        existingAcc.updatedAt = Date.now();

        // Save the updated document back to the database
        await existingAcc.save();

        // Return the updated account information in the response
        res.status(StatusCodes.OK).json({
            user: {
                bio: existingAcc.bio,
                profilePicture: existingAcc.profilePicture, // Ensure the correct profile picture URL is returned
                updatedAt: existingAcc.updatedAt, // Include the updated timestamp
            },
            message: 'Account successfully updated',
        });

        console.log(`Account successfully updated:
            Email: ${email}
            Bio: ${existingAcc.bio || 'No bio provided'}
            Profile Picture: ${existingAcc.profilePicture || 'No profile picture available'}`);

    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the process
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || 'An error occurred while updating the account',
        });
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
                profilePicture: user.profilePicture,
                blogStats: user.blogStats, // Include stats like posts, followers, etc.
                createdAt: user.createdAt,
                updatedAt: newAccount.updatedAt,
                byOAuth
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
module.exports = { createAccount, getAccountDetails, deleteAccount, updateAccount };
