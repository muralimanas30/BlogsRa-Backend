/* -------------------------------------------------------------------------- */
/*                            CUSTOM ERROR HANDLER                            */
/* -------------------------------------------------------------------------- */
class CustomError extends Error {
    constructor(message, statusCode, code = 'CUSTOM_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code; // Optional: Error code for easier client-side tracking
        Error.captureStackTrace(this, this.constructor); // Ensure stack trace is preserved
    }
}

module.exports = CustomError;
