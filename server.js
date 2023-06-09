require('dotenv').config(); // Load environment variables from a .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose for database operations
const app = express();
const axios = require('axios'); // Import Axios for making HTTP requests
const { expressjwt: jwt } = require('express-jwt'); // Import express-jwt for JWT verification
const jwks = require('jwks-rsa'); // Import jwks-rsa for JWT verification

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

const PORT = process.env.PORT || 3001; // Set the port for the server

// Middleware for JWT verification
const verifyJWT = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.JWKS_URI}` // Retrieve JWKS URI from environment variables
    }),
    audience: `${process.env.AUDIENCE}`, // Set the JWT audience from environment variables
    issuer: `${process.env.ISSUER}`, // Set the JWT issuer from environment variables
    algorithms: ['RS256'] // Set the allowed JWT signing algorithms
}).unless({ path: ['/books'] }); // Exclude the '/books' path from JWT verification

app.use(verifyJWT); // Apply JWT verification to all routes except '/books'
