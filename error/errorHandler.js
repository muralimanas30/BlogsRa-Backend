const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

/* -------------------------------------------------------------------------- */
/*             COMMON ERROR HANDLER MIDDLEWARE FOR ENTIRE BACKEND             */
/* -------------------------------------------------------------------------- */

const errorHandler = (err, req, res, next) => {
    console.log(err)
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err); // Log full error details in dev mode
    }

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map((e) => e.message), // Extract validation error messages
        });
    }

    // Handle Known Custom Errors
    if (err instanceof CustomError) {
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
    }

    // Fallback for Unexpected Errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
    });
};

module.exports = errorHandler;
