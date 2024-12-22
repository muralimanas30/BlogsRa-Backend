# Project Name: BlogsRa User Authentication and Management System

## Overview

This project provides an API for user authentication and management. It allows users to register, log in, and manage their accounts, including deleting individual users or all users at once. The API uses JSON Web Tokens (JWT) for authentication.
## Features
- User registration and authentication
- Password recovery options
- User profile management
- Post creation and management
- Contact form for user inquiries
- Admin functionalities (if applicable)

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Middleware libraries (e.g., Helmet, CORS, XSS Clean)

## Installation Instructions
1. **Prerequisites**: Ensure you have Node.js and MongoDB installed on your machine.
2. **Clone the repository**:
   ```bash
   git clone https://github.com/muralimanas30/blogs-ra/backend
   cd https://github.com/muralimanas30/blogs-ra
  ```

  ```
   YOULL NEED ALL THESE MODULES INSTALLED 
   
      ├── @types/dotenv@6.1.1 
      ├── @types/express-rate-limit@5.1.3 
      ├── @types/express@5.0.0  
      ├── @types/node@22.10.1 
      ├── axios@1.7.8 
      ├── bcrypt@5.1.1
      ├── cors@2.8.5
      ├── dotenv@16.4.5
      ├── express-async-errors@3.1.1
      ├── express-rate-limit@7.4.1
      ├── express@4.21.1
      ├── google-auth-library@9.15.0
      ├── helmet@8.0.0
      ├── http-status-codes@2.3.0
      ├── jsonwebtoken@9.0.2
      ├── mongoose@8.8.3
      ├── morgan@1.10.0
      ├── node@20.18.1
      ├── nodemailer@6.9.16
      ├── nodemon@3.1.7
      ├── react-router-dom@7.0.1
      └── xss-clean@0.1.4```

  You can install all the packages at once using the following command: 


  ```
  npm install @types/dotenv@6.1.1 @types/express-rate-limit@5.1.3 @types/express@5.0.0 @types/node@22.10.1 axios@1.7.8 bcrypt@5.1.1 cors@2.8.5 dotenv@16.4.5 express-async-errors@3.1.1 express-rate-limit@7.4.1 express@4.21.1 google-auth-library@9.15.0 helmet@8.0.0 http-status-codes@2.3.0 jsonwebtoken@9.0.2 mongoose@8.8.3 morgan@1.10.0 node@20.18.1 nodemailer@6.9.16 nodemon@3.1.7 react-router-dom@7.0.1 xss-clean@0.1.4
  ```



## Folder Structure
```
project-root/
│
├── controller/
│   ├── accountController.js      # Handles account-related operations  
│   ├── auth.js                    # Handles user authentication (login, registration)
│   ├── authAdmin.js               # Handles admin authentication
│   ├── contactController.js        # Handles contact-related operations
│   ├── postController.js           # Handles post-related operations
│   └── README.md                   # Documentation for controllers
│
├── db/
│   ├── connect.js                  # Database connection setup using Mongoose
│   └── README.md                   # Documentation for the database setup
│
├── error/
│   ├── errorHandler.js             # Handles errors and sends appropriate responses
│   └── README.md                   # Documentation for error handling
│
├── middleware/
│   ├── authentication.js            # JWT-based authentication middleware
│   └── README.md                   # Documentation for middleware
│
├── model/
│   ├── AccountStatus.js            # Schema for account status
│   ├── AdminUser .js                # Schema for admin users
│   ├── User.js                     # User schema definition with password hashing and JWT creation
│   ├── Post.js                     # Schema for posts
│   ├── ContactUs.js                # Schema for contact us form submissions
│   └── README.md                   # Documentation for models
│
├── routes/
│   ├── account.js                  # Defines routes for account management
│   ├── auth.js                     # Defines routes for authentication
│   ├── contactus.js                # Defines routes for contact us functionality
│   └── README.md                   # Documentation for routes
│
├── README.md                       # Main documentation for the project
└── package.json                    # Project metadata and dependenciesependencies
```

## API Endpoints

### 1. **POST /register**
- Registers a new user.
- Request body: 
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
Response:
{
  "user": {
    "name": "string",
    "id": "user_id",
    "email": "string"
  },
  "token": "jwt_token",
  "message": "REGISTRATION SUCCESSFUL"
}
Success Status Code: 201 Created

### 2. **POST /login**
Authenticates a user and returns a JWT.
Request body:
{
  "email": "string",
  "password": "string"
}
Response : 
{
  "user": {
    "name": "string",
    "id": "user_id",
    "email": "string"
  },
  "token": "jwt_token",
  "message": "LOGIN SUCCESSFUL"
}
status code : 200 OK


### 3. **DELETE /userId**
Deletes a specific user by userId. Protected by JWT authentication.
URL Params: userId
Response:
{
  "message": "User successfully deleted"
}
status code : 200 OK


## *Code Explanation*

### *1. controller/auth.js*
    This file contains the logic for user registration, login, and management (deleting users).
    - register: Handles the creation of a new user and generates a JWT token.
    - login: Authenticates an existing user and generates a JWT token.
    - deleteUser: Deletes a specific user by userId.
    - deleteAllUserr: Deletes all users in the database.
    - getAll: Retrieves all users from the database.





### *2. db/connect.js*
    This file establishes the connection to the MongoDB database using Mongoose.

### *3. error/errorHandler.js*
    A custom error handler middleware that catches errors and sends appropriate responses.

### *4. middleware/authentication.js*
    This middleware checks for a valid JWT token in the request headers and authenticates the user.

### *5. model/User.js*
    Defines the User schema using Mongoose, including password hashing, JWT creation, and password comparison methods.

### *6. routes/auth.js*
    Defines the routes for authentication and user management, including registration, login, deleting users, and fetching all users.

### *Error Handling*

The project uses custom error handling to return appropriate messages and HTTP status codes in case of errors:
    - 400: Bad Request (e.g., missing or invalid input)
    - 401: Unauthorized (e.g., invalid or missing JWT token)
    - 404: Not Found (e.g., user not found)
    - 500: Internal Server Error (e.g., unexpected errors)

### *app.js*


This file is the entry point of the Express application. It sets up the core server, middlewares, error handling, routes, and establishes a connection to the MongoDB database.


## **Table of Contents**

- [Overview](#overview)
- [Code Explanation](#code-explanation)
- [Key Features](#key-features)
- [Middleware Used](#middleware-used)
- [Routing](#routing)
- [Error Handling](#error-handling)
- [Database Connection](#database-connection)
- [Server Initialization](#server-initialization)


## **Explanation of Code app.js**

```javascript
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

```
### Key Features

- **Environment Variables**: Uses `dotenv` to load sensitive configurations such as the MongoDB URI and other environment-specific variables from a `.env` file.
- **Security**: Implements `helmet`, `cors`, and `xss-clean` to protect against common web vulnerabilities, ensuring enhanced security.
- **Logging**: Utilizes `morgan` for logging HTTP requests in a combined format, which is useful for monitoring and debugging.
- **Error Handling**: Utilizes `express-async-errors` to automatically handle async errors and forward them to the error-handling middleware.
- **Routing**: User authentication, account management, and contact routes are defined in their respective files and handled by their routers.
- **Cross-Origin Policies**: Sets Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP) headers to enhance security against cross-origin attacks.
- **Database Connection**: Establishes a connection to MongoDB using the `connectDB` function defined in `db/connect.js`.
- **Server Initialization**: The server connects to the database and starts on the specified port (defaults to 3000).

### **Middleware Used**

- **express.json()**: Parses incoming requests with JSON payloads.
- **helmet**: Helps secure Express apps by setting various HTTP headers.
- **cors**: Enables Cross-Origin Resource Sharing with specified origins.
- **xss-clean**: Middleware to sanitize user input to prevent XSS attacks.
- **morgan**: HTTP request logger middleware for Node.js.

## **Explanation of Code controllers/accountController.js**## Explanation of Code: controllers/accountController.js

### Account Controller

The `accountController.js` file contains functions that handle account-related operations for users. This includes creating a new account, retrieving account details, and deleting an existing account. Each function is designed to interact with the `AccountStatus` model and manage user account data effectively.

### Functions

#### 1. `createAccount`

##### Description:
- Responsible for creating a new user account.
- Validates the required fields:
  - `userId`
  - `name`
  - `email`
- Checks if an account with the provided email already exists.
- If not, creates a new account and responds with:
  - User ID
  - Name
  - Email
  - Bio
  - Profile Picture URL
  - Blog Stats
  - Creation Timestamp

#### 2. `getAccountDetails`

##### Description:
- Retrieves the account details for the authenticated user.
- Uses the `userId` from the request to find the corresponding account in the database.
- If the account is found, it returns:
  - User ID
  - Name
  - Email
  - Bio
  - Profile Picture URL
  - Blog Stats
  - Creation Timestamp
- Throws an error if the account is not found.

#### 3. `deleteAccount`

##### Description:
- Handles the deletion of a user account.
- Searches for the account using the user's email.
- Deletes the account from the database.
- Sends a confirmation response if the account is successfully deleted.
- Throws an error if the account does not exist.

### Error Handling

- Each function includes error handling to manage potential issues during database operations.
- Custom error messages are thrown using a `CustomError` class, allowing for consistent error responses throughout the application.

### Usage

- These functions are exported for use in the application's routing layer.
- They can be invoked in response to HTTP requests related to user account management.

## Explanation of Code: controllers/auth.js

### Auth Controller

The `auth.js` file contains functions that handle user authentication and management operations. This includes Google login, user registration, user login, password verification, and user deletion. Each function is designed to interact with the `User ` model and manage user data effectively.

### Functions

#### 1. `googleLogin`

##### Description:
- Handles Google login for users.
- Expects an access token from the client.
- Validates the presence of the access token.
- Fetches the user's profile from Google using the access token.
- Checks for errors in the profile response.
- Retrieves the user's email and name.
- Finds or creates a user in the database:
  - If the user does not exist, creates a new user with a placeholder password.
- Generates a JWT for the user.
- Responds with user details and the generated token.

#### 2. `register`

##### Description:
- Handles user registration.
- Expects user details in the request body.
- Creates a new user in the database.
- Generates a JWT for the newly registered user.
- Responds with user details and the generated token.
- Handles validation errors and throws appropriate custom errors.

#### 3. `login`

##### Description:
- Handles user login.
- Expects email and password in the request body.
- Validates the presence of email and password.
- Finds the user by email.
- Checks if the password is correct.
- Generates a JWT for the user upon successful login.
- Responds with user details and the generated token.

#### 4. `verifyPassword`

##### Description:
- Verifies the user's password.
- Expects email and password in the request body.
- Finds the user by email.
- Checks if the provided password is correct.
- Responds with a success message if the password is valid.

#### 5. `deleteUser `

##### Description:
- Handles user account deletion.
- Validates the presence of `userId` from the request.
- Finds and deletes the user by `userId`.
- Responds with a confirmation message upon successful deletion.
- Handles errors related to user not found or missing user ID.

#### 6. `deleteAllUser r`

##### Description:
- Placeholder function for deleting all users.
- Currently responds with a "Coming Soon" message.

#### 7. `getAll`

##### Description:
- Placeholder function for retrieving all users.
- Currently responds with a "Coming Soon" message.

### Error Handling

- Each function includes error handling to manage potential issues during database operations.
- Custom error messages are thrown using a `CustomError` class, allowing for consistent error responses throughout the application.

### Usage

- These functions are exported for use in the application's routing layer.
- They can be invoked in response to HTTP requests related to user authentication and management.

## Explanation of Code: controllers/contactController.js

### Contact Controller

The `contactController.js` file contains functions that handle contact form submissions from users. This includes saving user messages to the database. The function is designed to interact with the `Contact` model and manage contact data effectively.

### Functions

#### 1. `createContactUs`

##### Description:
- Handles the submission of contact form messages.
- Expects the following data in the request body:
  - `email`: The email address of the user submitting the form.
  - `name`: The name of the user submitting the form.
  - `message`: The message content from the user.
- Retrieves the client's IP address from the request.
- Creates a new entry in the database using the `Contact` model with the provided data:
  - `name`
  - `email`
  - `message`
  - `ipAddress`
- Sends a success response with a status of 201 (Created) and a message indicating that the message was successfully sent.
- Logs the new contact entry for debugging purposes (this can be removed in production).
- Passes any errors to a custom error handler for consistent error management.

### Error Handling

- The function includes error handling to manage potential issues during the database operation.
- Errors are passed to a custom error handler using the `next` function, allowing for consistent error responses throughout the application.

### Usage

- This function is exported for use in the application's routing layer.
- It can be invoked in response to HTTP requests related to contact form submissions.

## Explanation of Code: controllers/postController.js

### Post Controller

The `postController.js` file is designed to handle operations related to posts within the application. This includes retrieving posts, uploading new posts, and deleting existing posts. Each function is intended to interact with the relevant data models and manage post data effectively.

### Functions

#### 1. `getPosts`

##### Description:
- This function is intended to retrieve a list of posts from the database.
- Currently, the implementation is a placeholder and needs to be completed.
- Once implemented, it should return the posts in a structured format, possibly with pagination or filtering options.

#### 2. `uploadPost`

##### Description:
- This function is intended to handle the uploading of new posts to the database.
- Currently, the implementation is a placeholder and needs to be completed.
- Once implemented, it should accept post data (such as title, content, images, etc.) and save it to the database, returning a success response.

#### 3. `deletePost`

##### Description:
- This function is intended to handle the deletion of existing posts from the database.
- Currently, the implementation is a placeholder and needs to be completed.
- Once implemented, it should accept a post identifier (such as post ID) and remove the corresponding post from the database, returning a confirmation response.

### Error Handling

- As the functions are currently placeholders, error handling has not yet been implemented.
- Once the functions are fully developed, appropriate error handling should be added to manage potential issues during database operations.

### Usage

- These functions are exported for use in the application's routing layer.
- They can be invoked in response to HTTP requests related to post management, such as retrieving, creating, and deleting posts.
/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                             END OF CONTROLLERS FOLDER                      */
/*                                                                            */
/* -------------------------------------------------------------------------- */
/*                                                                            */
/*   This section contains all the controller functions responsible for        */
/*   handling the application's core logic related to user authentication,     */
/*   account management, contact submissions, and post management.            */
/*                                                                            */
/*   Each controller is designed to interact with the corresponding models,    */
/*   manage data effectively, and provide appropriate responses to the client. */
/*                                                                            */
/*   Future enhancements may include additional controllers for new features,  */
/*   improved error handling, and optimized performance.                       */
/*


/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                             START OF DATABASE SECTION                      */
/*                                                                            */
/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                     This section contains the database connection setup    */
/*                     file: `connectDb.js`.                                 */
/*                                                                            */
/* -------------------------------------------------------------------------- */

## Explanation of Code: db/connectDb.js

### Database Connection

The `connectDb.js` file is designed to establish a connection to the MongoDB database using Mongoose. This file contains a function that can be readily called to initiate the connection process.

### Functions

#### 1. `connectDB`

##### Description:
- This function is responsible for connecting to the MongoDB database.
- It accepts a single parameter:
  - `url`: The connection string for the MongoDB database.
- The function uses Mongoose to establish the connection and returns a promise that resolves when the connection is successful.
- It currently includes commented-out options for connection settings, which can be enabled as needed.

### Error Handling

- As the function is currently a straightforward connection setup, specific error handling has not been implemented within this file.
- It is recommended to handle connection errors in the application logic where this function is called to ensure robust error management.

### Usage

- This function is exported for use in the application wherever a database connection is required.
- It can be invoked with the appropriate MongoDB connection URL to establish a connection to the database.


## Explanation of Code: error/CustomError.js

### Custom Error Handler

The `CustomError.js` file defines a custom error class that extends the built-in JavaScript `Error` class. This custom error handler is designed to facilitate consistent error management throughout the application.

### Classes

#### 1. `CustomError`

##### Description:
- This class extends the built-in `Error` class to create a custom error type.
- It accepts two parameters:
  - `message`: A string that describes the error.
  - `statusCode`: A numeric HTTP status code associated with the error.
- The constructor calls the parent `Error` constructor with the provided message and assigns the `statusCode` to the instance.
- This allows for more informative error handling and responses in the application.

### Error Handling

- The `CustomError` class can be used throughout the application to throw errors with specific messages and status codes.
- This promotes better error handling practices by providing a consistent way to manage errors.

### Usage

- This class is exported for use in other parts of the application where custom error handling is required.
- It can be instantiated and thrown in route handlers, middleware, or any other part of the application logic to signal errors with appropriate context.

## Explanation of Code: middleware/customHandler.js

### Common Error Handler Middleware

The `customHandler.js` file defines a middleware function that serves as a centralized error handler for the entire backend application. This middleware is designed to catch and process errors that occur during the request-response cycle.

### Functions

#### 1. `errorHandler`

##### Description:
- This middleware function is invoked whenever an error is passed to the `next()` function in the application.
- It accepts four parameters:
  - `err`: The error object that was thrown.
  - `req`: The HTTP request object.
  - `res`: The HTTP response object.
  - `next`: The next middleware function in the stack.
- The function performs the following checks:
  - If the error is a `ValidationError`, it responds with a status of 400 (Bad Request) and includes the error message and details.
  - If the error is an instance of `CustomError`, it responds with the specified status code and message.
  - For any unexpected errors, it responds with a status of 500 (Internal Server Error) and a generic error message.

### Error Handling

- This middleware provides a centralized way to handle errors across the application, ensuring consistent error responses.
- It allows for specific handling of different error types, improving the clarity of error messages returned to the client.

### Usage

- This middleware should be added to the Express application after all route handlers and other middleware.
- It can be used to catch and handle errors thrown in any part of the application, providing a robust error management solution.
## Explanation of Code: middleware/authentication.js

### Authentication Middleware

The `authentication.js` file defines middleware that is responsible for authenticating users based on JSON Web Tokens (JWT). This middleware extracts the token from the request headers, verifies it, and adds the user information to the request object.

### Functions

#### 1. `auth`

##### Description:
- This middleware function is invoked to authenticate requests that require user verification.
- It accepts three parameters:
  - `req`: The HTTP request object.
  - `res`: The HTTP response object.
  - `next`: The next middleware function in the stack.
- The function performs the following checks:
  - It retrieves the `Authorization` header from the request.
  - If the header is missing or does not start with "Bearer", it throws an error indicating that authentication is required.
  - It extracts the token from the header and verifies it using the `jsonwebtoken` library and a secret stored in the environment variable `JWT_SECRET`.
  - If the token is valid, it decodes the payload and adds the user information (userId, name, email) to the `req.user` object.
  - Finally, it calls the `next()` function to pass control to the next middleware or route handler.

### Error Handling

- If the token is missing, invalid, or verification fails, the middleware throws an error with a relevant message.
- This allows for consistent error handling in the application, ensuring that unauthorized requests are properly managed.

### Usage

- This middleware should be applied to routes that require user authentication.
- It can be used in conjunction with other middleware and route handlers to protect sensitive endpoints and ensure that only authenticated users can access certain resources.



## Explanation of Code: models/AccountStatus.js

### Account Status Model

The `AccountStatus.js` file defines the Mongoose schema for user account status within the application. This schema outlines the structure of the account data and includes various fields related to user profiles, bios, and blog statistics.

### Schema Definition

#### 1. `AccountStatusSchema`

##### Description:
- This schema represents the structure of the user account status document in the MongoDB database.
- It includes the following fields:

  - **userId**: 
    - Type: `String`
    - Description: A unique identifier for the user. This can be a custom string identifier.
    - Unique: Optional for uniqueness if needed.

  - **name**: 
    - Type: `String`
    - Description: The name of the user.
    - Required: Yes, must provide a name.
    - Validation: Maximum length of 50 characters. The name is formatted to capitalize the first letter of each word.

  - **email**: 
    - Type: `String`
    - Description: The user's email address.
    - Required: Yes, must provide an email.
    - Unique: Yes, must be unique across users.
    - Validation: Email is converted to lowercase.

  - **bio**: 
    - Type: `String`
    - Description: A short biography of the user.
    - Default: Randomly selected from a predefined list of default bios.
    - Validation: Maximum length of 250 characters.

  - **profilePictureUrl**: 
    - Type: `String`
    - Description: URL of the user's profile picture.
    - Default: An empty string.

  - **socialLinks**: 
    - Type: `Object`
    - Description: An object to store social media links.
    - Default: An empty object.

  - **createdAt**: 
    - Type: `Date`
    - Description: Timestamp of when the account was created.
    - Default: Current date and time.

  - **updatedAt**: 
    - Type: `Date`
    - Description: Timestamp of the last update to the account.
    - Default: Current date and time.

  - **blogStats**: 
    - Type: `Object`
    - Description: An object to store blog statistics.
    - Fields:
      - `posts`: Number of posts (default: 0).
      - `followers`: Number of followers (default: 0).
      - `following`: Number of accounts the user is following (default: 0).

  - **posts**: 
    - Type: `Array`
    - Description: An array of Object IDs referencing the user's posts.

### Middleware

- The schema includes a post-save hook that handles duplicate email errors:
  - If a `MongoServerError` occurs with a code of 11000 (duplicate key error), it throws a custom error indicating that the email is already in use.

### Usage

- This model is exported for use in other parts of the application where user account data needs to be accessed or manipulated.
- It can be used to create, read, update, and delete user account status documents in the MongoDB database.



## Explanation of Code: models/AdminUser .js

### Admin User Model

The `AdminUser .js` file defines the Mongoose schema for admin users within the application. This schema outlines the structure of the admin user data and includes methods for password hashing and JWT creation.

### Schema Definition

#### 1. `AdminSchema`

##### Description:
- This schema represents the structure of the admin user document in the MongoDB database.
- It includes the following fields:

  - **name**: 
    - Type: `String`
    - Description: The name of the admin user.
    - Required: Yes, must provide a name.
    - Validation: Maximum length of 50 characters.

  - **email**: 
    - Type: `String`
    - Description: The admin user's email address.
    - Required: Yes, must provide an email.
    - Unique: Yes, must be unique across admin users.

  - **password**: 
    - Type: `String`
    - Description: The password for the admin user account.
    - Required: Yes, must provide a password.
    - Validation: Minimum length of 6 characters and maximum length of 20 characters.

### Middleware

- **Pre-save Hook**: 
  - The schema includes a pre-save hook that hashes the password before saving it to the database using `bcrypt`.
  - This ensures that passwords are stored securely.

- **Post-save Hook**: 
  - The schema includes a post-save hook that handles duplicate email errors:
    - If a `MongoServerError` occurs with a code of 11000 (duplicate key error), it throws a custom error indicating that the email already exists.

### Instance Methods

#### 1. `createJWT`

##### Description:
- This method generates a JSON Web Token (JWT) for the admin user.
- It includes the following payload:
  - `userId`: The unique identifier of the admin user.
  - `name`: The name of the admin user.
  - `email`: The email of the admin user.
- The token is signed using a secret stored in the environment variable `JWT_SECRET` and has an expiration time defined by `JWT_LIFETIME`.

#### 2. `comparePassword`

##### Description:
- This method compares a candidate password with the hashed password stored in the database.
- It uses `bcrypt` to check if the provided password matches the stored password.
- Returns a boolean indicating whether the passwords match.

### Usage

- This model is exported for use in other parts of the application where admin user data needs to be accessed or manipulated.
- It can be used to create, read, update, and delete admin user documents in the MongoDB database.

## Explanation of Code: models/ContactUs.js

### Contact Us Model

The `ContactUs.js` file defines the Mongoose schema for handling contact form submissions from users. This schema outlines the structure of the contact data and includes fields related to user inquiries.

### Schema Definition

#### 1. `ContactUsSchema`

##### Description:
- This schema represents the structure of the contact form submission document in the MongoDB database.
- It includes the following fields:

  - **email**: 
    - Type: `String`
    - Description: The email address of the user submitting the contact form.
    - Required: Yes, must provide an email.
    - Behavior: The email is converted to lowercase before saving to ensure uniformity.

  - **name**: 
    - Type: `String`
    - Description: The name of the user submitting the contact form.
    - Required: Yes, must provide a name.

  - **ipAddress**: 
    - Type: `String`
    - Description: The IP address of the user submitting the contact form.
    - Required: Yes, must provide an IP address.

  - **message**: 
    - Type: `String`
    - Description: The message content from the user.
    - Required: Yes, must provide a message.

  - **createdAt**: 
    - Type: `Date`
    - Description: Timestamp of when the contact form submission was created.
    - Default: Current date and time.

  - **status**: 
    - Type: `String`
    - Description: The status of the contact form submission.
    - Default: "Pending", indicating that the inquiry is awaiting response.

### Usage

- This model is exported for use in other parts of the application where contact form submissions need to be accessed or manipulated.
- It can be used to create, read, update, and delete contact form submission documents in the MongoDB database.

## Explanation of Code: models/Post.js

### Post Model

The `Post.js` file defines the Mongoose schema for user-generated posts within the application. This schema outlines the structure of the post data and includes various fields related to the content and metadata of each post.

### Schema Definition

#### 1. `PostSchema`

##### Description:
- This schema represents the structure of a post document in the MongoDB database.
- It includes the following fields:

  - **email**: 
    - Type: `String`
    - Description: The email address of the user who created the post.
    - Required: Yes, must provide an email.

  - **accountId**: 
    - Type: `mongoose.Schema.Types.ObjectId`
    - Description: A reference to the `AccountStatus` document associated with the post.
    - Required: Yes, must provide an account ID.

  - **userId**: 
    - Type: `String`
    - Description: A custom user identifier for the post creator.
    - Required: Yes, must provide a user ID.

  - **title**: 
    - Type: `String`
    - Description: The title of the post.
    - Required: Yes, must provide a title.
    - Validation: Maximum length of 100 characters, trimmed of whitespace.

  - **content**: 
    - Type: `String`
    - Description: The main content of the post.
    - Required: Yes, must provide content for the post.

  - **tags**: 
    - Type: `[String]`
    - Description: An array of tags associated with the post.
    - Default: An empty array.

  - **categories**: 
    - Type: `[String]`
    - Description: An array of categories associated with the post.
    - Default: An empty array.

  - **imageUrl**: 
    - Type: `String`
    - Description: URL of an image associated with the post (optional).

  - **likes**: 
    - Type: `Number`
    - Description: The number of likes the post has received.
    - Default: 0.

  - **createdAt**: 
    - Type: `Date`
    - Description: Timestamp of when the post was created.
    - Default: Current date and time.

  - **updatedAt**: 
    - Type: `Date`
    - Description: Timestamp of when the post was last updated.
    - Default: Current date and time.

### Timestamps

- The schema is configured to automatically manage `createdAt` and `updatedAt` fields using Mongoose's `timestamps` option.

### Usage

- This model is exported for use in other parts of the application where post data needs to be accessed or manipulated.
- It can be used to create, read, update, and delete post documents in the MongoDB database.


## Explanation of Code: models/User.js

### User Model

The `User .js` file defines the Mongoose schema for user accounts within the application. This schema outlines the structure of user data and includes methods for password hashing and JWT creation.

### Schema Definition

#### 1. `User Schema`

##### Description:
- This schema represents the structure of a user document in the MongoDB database.
- It includes the following fields:

  - **name**: 
    - Type: `String`
    - Description: The name of the user.
    - Required: Yes, must provide a name.
    - Validation: Maximum length of 50 characters.

  - **email**: 
    - Type: `String`
    - Description: The user's email address.
    - Required: Yes, must provide an email.
    - Unique: Yes, must be unique across users.

  - **password**: 
    - Type: `String`
    - Description: The password for the user account.
    - Required: Yes, must provide a password.
    - Validation: Minimum length of 6 characters and maximum length of 20 characters.

### Middleware

- **Pre-save Hook**: 
  - The schema includes a pre-save hook that hashes the password before saving it to the database using `bcrypt`.
  - This ensures that passwords are stored securely.

- **Post-save Hook**: 
  - The schema includes a post-save hook that handles duplicate email errors:
    - If a `MongoServerError` occurs with a code of 11000 (duplicate key error), it throws a custom error indicating that the email already exists.

### Instance Methods

#### 1. `createJWT`

##### Description:
- This method generates a JSON Web Token (JWT) for the user.
- It includes the following payload:
  - `userId`: The unique identifier of the user.
  - `name`: The name of the user.
  - `email`: The email of the user.
- The token is signed using a secret stored in the environment variable `JWT_SECRET` and has an expiration time defined by `JWT_LIFETIME`.

#### 2. `comparePassword`

##### Description:
- This method compares a candidate password with the hashed password stored in the database.
- It uses `bcrypt` to check if the provided password matches the stored password.
- Returns a boolean indicating whether the passwords match.

### Usage

- This model is exported for use in other parts of the application where user data needs to be accessed or manipulated.
- It can be used to create, read, update, and delete user documents in the MongoDB database.


## Explanation of Code: routes/account.js

### Account and Post Routes

The `account.js` file defines the Express routes for managing user accounts and posts within the application. It utilizes middleware for authentication and connects to the appropriate controller functions for handling requests.

### Imports

- **authenticator**: Middleware for authenticating users based on JSON Web Tokens (JWT).
- **express**: The Express framework for building web applications and APIs.
- **router**: An instance of an Express router to define routes.
- **Controller Functions**: 
  - `createAccount`, `getAccountDetails`, `deleteAccount`, `verifyPassword` from the `accountControllers`.
  - `getPosts`, `uploadPost`, `deletePost` from the `postControllers`.

### Routes

#### 1. Account Routes

- **POST `/account`**: 
  - Description: Creates a new user account.
  - Middleware: `authenticator` (authentication required).

- **GET `/account`**: 
  - Description: Retrieves details of the authenticated user account.
  - Middleware: `authenticator` (authentication required).

- **DELETE `/account`**: 
  - Description: Deletes the authenticated user account.
  - Middleware: `authenticator` (authentication required).

#### 2. Post Routes

- **GET `/posts`**: 
  - Description: Retrieves a list of posts.
  - Middleware: `authenticator` (authentication required).

- **POST `/post`**: 
  - Description: Uploads a new post.
  - Middleware: `authenticator` (authentication required).

- **DELETE `/post`**: 
  - Description: Deletes a specified post.
  - Middleware: `authenticator` (authentication required).

### Export

- The router is exported for use in the main application file, allowing the defined routes to be integrated into the Express app.

### Usage

- This routing file should be included in the main application to handle requests related to user accounts and posts, ensuring that only authenticated users can access these routes.


## Explanation of Code: routes/auth.js

### Authentication Routes

The `auth.js` file defines the Express routes for user authentication and account management within the application. It includes routes for registration, login, and user management, utilizing middleware for authentication where necessary.

### Imports

- **authenticator**: Middleware for authenticating users based on JSON Web Tokens (JWT).
- **express**: The Express framework for building web applications and APIs.
- **router**: An instance of an Express router to define routes.
- **Controller Functions**: 
  - `register`, `login`, `deleteUser `, `deleteAllUser r`, `getAll`, `googleLogin`, `verifyPassword` from the `auth` controller.

### Routes

#### 1. Google Authentication

- **POST `/google/callback`**: 
  - Description: Handles the callback from Google after user authentication.
  - No authentication required.

#### 2. User Management Routes

- **GET `/getall`**: 
  - Description: Retrieves a list of all users.
  - Middleware: `authenticator` (authentication required).

- **POST `/verifyPassword`**: 
  - Description: Verifies the user's password.
  - Middleware: `authenticator` (authentication required).

- **POST `/register`**: 
  - Description: Registers a new user account.
  - No authentication required.

- **POST `/login`**: 
  - Description: Authenticates a user and logs them in.
  - No authentication required.

- **DELETE `/deleteall`**: 
  - Description: Deletes all user accounts.
  - Middleware: `authenticator` (authentication required).

- **DELETE `/`**: 
  - Description: Deletes the authenticated user account.
  - Middleware: `authenticator` (authentication required).

### Export

- The router is exported for use in the main application file, allowing the defined routes to be integrated into the Express app.

### Usage

- This routing file should be included in the main application to handle requests related to user authentication and account management, ensuring that only authenticated users can access certain routes.

## Explanation of Code: routes/contact.js

### Contact Routes

The `contact.js` file defines the Express route for handling contact form submissions from users. It connects to the appropriate controller function responsible for processing the contact data.

### Imports

- **express**: The Express framework for building web applications and APIs.
- **router**: An instance of an Express router to define routes.
- **createContactUs**: The controller function that handles the logic for processing contact form submissions.

### Routes

#### 1. Contact Form Submission

- **POST `/contact`**: 
  - Description: Submits a contact form with user inquiries.
  - Handler: `createContactUs` (the controller function that processes the contact data).

### Export

- The router is exported for use in the main application file, allowing the defined route to be integrated into the Express app.

### Usage

- This routing file should be included in the main application to handle requests related to contact form submissions, enabling users to send their inquiries or feedback.