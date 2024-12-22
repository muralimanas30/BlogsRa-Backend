const mongoose = require('mongoose')


/* -------------------------------------------------------------------------- */
/*   A FUNCTION WHICH RETURNS A CONNECT FUNCTION THAT CAN BE READILY CALLED   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  CONNECTDB                                 */
/* -------------------------------------------------------------------------- */
const connectDB = (url) => {
    return mongoose.connect(url, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // useUnifiedTopology: true,
    })
}

module.exports = connectDB
