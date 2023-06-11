require('dotenv').config(); // Load environment variables from a .env file
let Seed = require('./Seed')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose for database operations
const Post = require('./models/Post')
const app = express();
const axios = require('axios'); // Import Axios for making HTTP requests
const { expressjwt: jwt } = require('express-jwt'); // Import express-jwt for JWT verification
const jwks = require('jwks-rsa'); // Import jwks-rsa for JWT verification

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

const PORT = process.env.PORT || 3001; // Set the port for the server

// Middleware for JWT verification
// const verifyJWT = jwt({
//     secret: jwks.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: `${process.env.JWKS_URI}` // Retrieve JWKS URI from environment variables
//     }),
//     audience: `${process.env.AUDIENCE}`, // Set the JWT audience from environment variables
//     issuer: `${process.env.ISSUER}`, // Set the JWT issuer from environment variables
//     algorithms: ['RS256'] // Set the allowed JWT signing algorithms
// }).unless({ path: ['/books'] }); // Exclude the '/books' path from JWT verification

// app.use(verifyJWT); // Apply JWT verification to all routes except '/books'


app.get('/test', async (req, res) => {
    // Connect to the MongoDB database
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        let posts = await Post.find()
        console.log(posts)
        res.json(posts)
    } catch (error){
        console.log("This is the error", error)
        res.status(500).send('Internal Server Error'); // Send an error response

    } finally {
        await mongoose.disconnect()
    }

})

app.post('/blogs', async (req, res)=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        let newPost = Post.create({
            userId: 'jaredp',
            caption: 'Seeding the database 4',
            likes: 2,
            media: {
                data: req.image,
                contentType: 'image/jpeg' 
            }
        });
        let posts = await Post.find()
        res.json(posts)
    } catch (error){
        console.log("This is the error", error)
        res.status(500).send('Internal Server Error'); // Send an error response

    } finally {
        await mongoose.disconnect()
    }

})



app.listen(PORT, () => console.log(`listening on ${PORT}`)); // Start the server and listen on the specified port
