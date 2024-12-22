/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const express = require('express');
const app = express();
const morgan = require('morgan');

/* -------------------------------------------------------------------------- */
/*                           USING THE MIDDLEWARES                           */
/* -------------------------------------------------------------------------- */

app.use(morgan('combined')); // 'combined' provides standard Apache log output

// Middleware
app.use(express.json());
app.use(helmet());

app.use(
    cors({
        origin: ['http://localhost:5173',`${process.env.IP_1}`,`${process.env.IP_2}`], 
        credentials: true,
    })
);

app.use(xss());

/* -------------------------------------------------------------------------- */
/*                  SETTING UP AUTH, CONTACT, ACCOUNT ROUTERS                 */
/* -------------------------------------------------------------------------- */
const contactRouter = require('./routes/contact')
const authRouter = require('./routes/auth');
const accountRouter = require('./routes/account')
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/',accountRouter);
app.use('/api/v1/',contactRouter);
// Add COOP and COEP Headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

 /* -------------------------------------------------------------------------- */
 /*                   Error Handler Middleware (placed last)                   */
 /* -------------------------------------------------------------------------- */
const errorHandler = require('./error/errorHandler');
app.use(errorHandler);

 /* -------------------------------------------------------------------------- */
 /*                    Database Connection and Server Start                    */
 /* -------------------------------------------------------------------------- */
const connectDB = require('./db/connect');
const start = async () => {
    const port = process.env.PORT || 3000;
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to the database');
        // app.listen(port, () => console.log('Server listening on port ' + port));
        app.listen(port, '0.0.0.0', () => console.log('Server listening on port ' + port));
            
    } catch (error) {
        console.error('Failed to connect to the database', error.message);
        process.exit(1); // Exit process with failure
    }
};

start();
