require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Post = require('./models/Post');//
const app = express(); //
const multer = require('multer');
const path = require('path')
const bodyParser = require('body-parser');
const Photo = require('./models/Photo');//
const Seed = require('./Seed');//
const jwks = require('jwks-rsa'); // Import jwks-rsa for JWT verification
const { expressjwt: jwt } = require('express-jwt'); // Import express-jwt for JWT verification

app.use(cors());
app.use(express.json());
app.use(express.static('public'))

const PORT = process.env.PORT; // Set the port for the server

// app.use(bodyParser.json({ limit: '10485760' })); // 10 * 1024 * 1024
// app.use(bodyParser.urlencoded({ limit: '10485760', extended: true }));


// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("About to call cb for destination");
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        console.log("About to call cb for filename");
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});


// Increase file size limit
const upload = multer({ storage: storage});


mongoose.connect(process.env.DATABASE_URL_Cloud, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Could not connect to MongoDB:', err));






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
}).unless({ path: ['/upload'] }); // Exclude the '/upload' path from JWT verification

app.use(verifyJWT); // Apply JWT verification to all routes except '/books'


app.get('/upload', async (req, res) => {
    try {
        await mongoose.connect(process.env.DATABASE_URL_Cloud, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        let posts = await Post.find()
        console.log(posts)
        res.json(posts)
    } catch (error){
        console.log("This is the error", error)
        res.status(500).send('Internal Server Error'); // Send an error response

    } 

})

app.put('/upload:id', async (req, res) => {
    await mongoose.connect(process.env.DATABASE_URL_Cloud, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const {title, caption, likes, media} = req.body
    let updatedPost = Post.findByIdAndUpdate({id:_id}, {title:title, caption:caption, likes:likes, media:media})
    let postFinder = Post.find()
    res.send(postFinder)
})


app.post('/upload', upload.single('file'),async (req, res) => {
    console.log('Upload route hit');
    console.log("Request",req.body.title);
    
    try {
        console.log('===================================================================================')
       // console.log("file", req.body); // Add this line to see the file data

        await mongoose.connect(process.env.DATABASE_URL_Cloud, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let newPhoto = await Photo.create({ image: 'https://fourloop-backend-fwxi.onrender.com/Images/' + req.file.filename })
            //console.log(req)
        // Access the file data through req.file.buffer
        let newPost = await Post.create({
            userId: 'jaredp',
            title: req.body.title,
            caption: req.body.content,
            likes: req.like,
            media: {
                data: 'https://fourloop-backend-fwxi.onrender.com/Images/' + req.file.filename,
                localdata:'http://localhost:3001/Images/' + req.file.filename
            } // convert base64 string to buffer
                
            
        });
        console.log('===================================================================================')
        console.log(newPost);
        let posts = await Post.find();
        res.json(newPost);
    } catch (error) {
        console.log("This is the error", error);
        res.status(500).send('Internal Server Error');
    } 
    
});



app.delete('/upload:id', async (req, res) => {
    await mongoose.connect(process.env.DATABASE_URL_Cloud, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
  const blogId = req.params.id
  
  await seed.findByIdAndDelete(blogId)
  disconnect()
  res.send('Post successfully deleted')
  .catch((error) => {
    res.status(500).json({error: error.message})
  })
  })



app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large' });
    }
    // handle other errors
});

app.listen(PORT, () => console.log(`listening on ${PORT}`)); // Start the server and listen on the specified port
