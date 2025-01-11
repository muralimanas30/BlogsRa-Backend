const { StatusCodes } = require('http-status-codes')
const User = require('../models/User');
const CustomError = require('../error/CustomError'); 
const https = require('https')


/* -------------------------------------------------------------------------- */
/*                            Google login handler                            */
/* -------------------------------------------------------------------------- */
const googleLogin = async (req, res, next) => {
    const { token: accessToken } = req.body; // Access token from client

    if (!accessToken) {
        return next(new CustomError('Access token is required', StatusCodes.BAD_REQUEST));
    }

    try {
        // Fetch user profile using the access token
        const url = 'https://www.googleapis.com/oauth2/v2/userinfo'; // Google API endpoint for user info

        https.get(`${url}?access_token=${accessToken}`, (response) => {
            let data = '';

            // Collect the data
            response.on('data', (chunk) => {
                data += chunk;
            });

            // Process the data once complete
            response.on('end', async () => {
                let profile;
                try {
                    profile = JSON.parse(data);
                } catch (err) {
                    return next(new CustomError('Failed to parse Google profile data', StatusCodes.INTERNAL_SERVER_ERROR));
                }

                if (profile.error) {
                    return next(new CustomError(profile.error.message, StatusCodes.UNAUTHORIZED));
                }

                const { email, name } = profile;
                if (!email || !name) {
                    return next(new CustomError('Failed to retrieve email or name from Google profile', StatusCodes.UNAUTHORIZED));
                }

                // Find or create the user in the database
                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        email,
                        name,
                        password: email.slice(0, 6), // Use email as placeholder password
                        byOAuth: true,
                    });
                }

                // Generate a JWT for the user
                const tokenToSend = user.createJWT();

                // Respond with user details and token
                res.status(StatusCodes.OK).json({
                    user: { userId: user._id, name: user.name, email: user.email, byOAuth: user.byOAuth },
                    token: tokenToSend,
                    message: 'Google login successful',
                    success: true,
                });
            });
        }).on('error', (err) => {
            // Handle https.get error
            next(new CustomError(err.message || 'Failed to fetch Google profile', StatusCodes.INTERNAL_SERVER_ERROR));
        });
    } catch (err) {
        // Catch any unexpected errors
        next(new CustomError(err.message || 'Failed to fetch Google profile', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

/* -------------------------------------------------------------------------- */
/*                              REGISTER FUNCTION                             */
/* -------------------------------------------------------------------------- */
const register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({
            user: { userId: user._id, name: user.name, id: user._id, email: user.email },
            token,
            message: "REGISTRATION SUCCESSFUL",
            success: true,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Extract the validation message
            const messages = Object.values(error.errors).map(err => err.message);
            console.dir(messages.join(', ') || error, { depth: null });

            next(new CustomError(messages.join(', ') || 'Registration failed', StatusCodes.BAD_REQUEST));
        } else {
            const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            next(new CustomError(error.message || 'Registration failed', error.statusCode || statusCode));
        }
    }
}
/* -------------------------------------------------------------------------- */
/*                               LOGIN FUCNTION                               */
/* -------------------------------------------------------------------------- */
const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next(new CustomError('Please provide email and password', 400));
        return;
    }
    try {

        const user = await User.findOne({ email });
        if (!user) {
            next(new CustomError('No account with entered email', 404));
            return;
        }


        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            next(new CustomError('Incorrect password', 401));
            return;
        }

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
            user: { userId: user._id, name: user.name, id: user._id, email: user.email },
            token,
            message: "LOGIN SUCCESSFUL",
            success: true,
        });
    } catch (error) {
        next(new CustomError(error.message || 'Something went wrong in loginFn', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)); // Pass all errors to the global error handler
    }
};

/* -------------------------------------------------------------------------- */
/*                      FUNCTION TO JUST VERIFY PASSWORD                      */
/* -------------------------------------------------------------------------- */
const verifyPassword = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            throw new CustomError('User not found', StatusCodes.NOT_FOUND);
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new CustomError('Invalid password', 401);
        }
        res.status(200).json({
            message: 'Valid Password',
            success: true,
        })
    } catch (error) {
        next(error)
    }
}



const deleteUser = async (req, res, next) => {
    const { userId } = req.user;

    if (!userId) {
        return next(new CustomError('User ID is required', StatusCodes.BAD_REQUEST));
    }

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new CustomError('User not found', StatusCodes.NOT_FOUND);
        }
        res.status(StatusCodes.OK).json({ message: 'Account deleted' });
    } catch (error) {
        next(new CustomError(error.message || 'Something went wrong in deleteUserFn', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)); // Pass all errors to the 
    }
};

/* -------------------------------------------------------------------------- */
/*             FEW ADMIN ROUTES LATER WILL BE ADDED                            */
/* -------------------------------------------------------------------------- */

const deleteAllUserr = async (req, res) => {
    res.status(401).json({ message: "COMING SOON" })
}

const getAll = async (req, res) => {
    res.status(401).json({ message: "COMING SOON" })
}
module.exports = { verifyPassword, register, login, deleteUser, deleteAllUserr, getAll, googleLogin };