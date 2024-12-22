const { StatusCodes } = require('http-status-codes');
const { Contact } = require('../models/ContactUs.js');
const CustomError = require('../error/CustomError'); // Assuming you have a custom error handler

// The function should accept req and res as arguments (to handle HTTP request and response)

/* -------------------------------------------------------------------------- */
/*                       TO SAVE THE MESSAGE TO DATABASE                      */
/* -------------------------------------------------------------------------- */

const createContactUs = async (req, res, next) => {
    try {
        // Extract the data from the request body
        const { email, name, message } = req.body;
        
        // Get the client's IP address from the request
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
        
        // Create a new contact form submission entry in the database
        const newContact = await Contact.create({
            name,
            email,
            message,
            ipAddress,
        });
        
        // Send a success response with status 201 (Created)
        res.status(StatusCodes.CREATED).json({ message: 'Message successfully sent!' });
        
        // Log the new contact for debugging purposes (you can remove this in production)
        console.dir(newContact, { depth: null });

    } catch (error) {
        // Pass the error to your custom error handler
        next(new CustomError("Error handling contact form submission", error.message));
    }
};
/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */
module.exports = createContactUs;
