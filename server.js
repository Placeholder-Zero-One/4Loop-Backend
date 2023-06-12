require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser')
const Photo = require('./models/Photo');
const Seed = require('./Seed')
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT; // Set the port for the server

app.use(bodyParser.json({ limit: '10485760' })); // 10 * 1024 * 1024
app.use(bodyParser.urlencoded({ limit: '10485760', extended: true }));
Seed();


// Create a multer middleware with the storage engine
//const storage = multer.memoryStorage()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10485760 } // Set file size limit to 10MB
});

mongoose.connect(process.env.DATABASE_URL_Cloud, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Could not connect to MongoDB:', err));


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large' });
    }
    // handle other errors
});



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
        await mongoose.connect(process.env.DATABASE_URL_Cloud, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let posts = await Post.find()
        console.log(posts)
        res.json(posts)
    } catch (error) {
        console.log("This is the error", error)
        res.status(500).send('Internal Server Error'); // Send an error response

    } finally {
        await mongoose.disconnect()
    }
})

app.post('/upload', upload.single('photo'), async (req, res) => {

    try {
        await mongoose.connect(process.env.DATABASE_URL_Cloud, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        //console.log(req.file)
        const { originalname, mimetype, buffer } = req.file;
        //console.log("Buffer", buffer)

        let photo = await Photo.create({
            name: originalname,
            data: buffer,
            contentType: mimetype
        });
        //console.log(req.file.buffer)
        //let photos = await Photo.find()
        console.log(photo)
        res.json(photo)

    } catch (error) {
        console.error('Error storing uploaded file:', error);
        res.status(500).json({ error: 'Error storing uploaded file' });
    } finally {
        await mongoose.disconnect()
    }

});



app.post('/blogs', upload.single('photo'), async (req, res) => {
    try {
        console.log("file", req.body); // Add this line to see the file data

        await mongoose.connect(process.env.DATABASE_URL_Cloud, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Access the file data through req.file.buffer
        let newPost = await Post.create({
            userId: 'jaredp',
            caption: req.body.caption,
            likes: 2,
            media: {
                data: req.body.photoBuffer, // receiving buffer
                contentType: req.body.mimetype
            }
        });

        let posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.log("This is the error", error);
        res.status(500).send('Internal Server Error');
    } finally {
        await mongoose.disconnect();
    }
});




app.listen(PORT, () => console.log(`listening on ${PORT}`)); // Start the server and listen on the specified port
