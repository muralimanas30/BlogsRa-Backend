const CustomError = require('./CustomError')
const { StatusCodes } = require('http-status-codes');

/* -------------------------------------------------------------------------- */
/*             COMMON ERROR HANDLER MIDDLEWARE FOR ENTIRE BACKEND             */
/* -------------------------------------------------------------------------- */


const errorHandler = (err, req, res, next) => {
    console.log(err)
    if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: err.message,
            errors: err.errors,
        });
    }

    if (err instanceof CustomError) {
        return res.status(err.statusCode||500).json({
            message: err.message,
        });
    }

    // Fallback for unexpected errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong. Please try again later.',
    });
};

module.exports = errorHandler;
