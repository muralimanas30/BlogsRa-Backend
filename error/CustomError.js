
/* -------------------------------------------------------------------------- */
/*                            CUSTOM ERROR HANDLER                            */
/* -------------------------------------------------------------------------- */
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;

/* -------------------------------------------------------------------------- */
/*                       MORE CUSTOM ERRORS, COMING SOON                      */
/* -------------------------------------------------------------------------- */