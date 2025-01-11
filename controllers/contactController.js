const { StatusCodes } = require('http-status-codes');
const { Contact } = require('../models/ContactUs.js');
const CustomError = require('../error/CustomError'); 



/* -------------------------------------------------------------------------- */
/*                       TO SAVE THE MESSAGE TO DATABASE                      */
/* -------------------------------------------------------------------------- */

const createContactUs = async (req, res, next) => {
    try {

        const { email, name, message,ip:ipAddress } = req.body;
        
        // Create a new contact form submission entry in the database
        const newContact = await Contact.create({
            name,
            email,
            message,
            ipAddress:JSON.stringify(ipAddress),
        });
        
        // Send a success response with status 201 (Created)
        res.status(StatusCodes.CREATED).json({ message: 'Message successfully sent!' });
        
        // Log the new contact for debugging purposes (you can remove this in production)
        console.log(name,
            email,
            message);

    } catch (error) {
        // Pass the error to your custom error handler
        next(new CustomError("Error handling contact form submission", error.message));
    }
};
/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */
module.exports = createContactUs;
