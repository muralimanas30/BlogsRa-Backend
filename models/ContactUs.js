const mongoose = require('mongoose')

/* -------------------------------------------------------------------------- */
/*                              CONTACT US SCHEMA                             */
/* -------------------------------------------------------------------------- */
const ContactUsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        set: (value) => value.toLowerCase(), // Convert email to lowercase before saving
    },
    name: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Set current date and time as default
    },
    status: {
        type: String,
        default: "Pending", // Default status is "Pending"
    },
});

const Contact = mongoose.model('ContactUs', ContactUsSchema);  // Correct model name

module.exports = { Contact };  // Correct export syntax
