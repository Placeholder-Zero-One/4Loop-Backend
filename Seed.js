const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const Post = require('./models/Post');

async function Seed() {
    try {
        await mongoose.connect(process.env.DATABASE_URL_Cloud, { useNewUrlParser: true, useUnifiedTopology: true });
        const pictureBuffer1 = fs.readFileSync('/Users/jaredplummer/Desktop/Screenshot 2023-06-12 at 1.43.11 PM.png');
        const pictureBuffer2 = fs.readFileSync('/Users/jaredplummer/Desktop/Screenshot 2023-06-12 at 1.55.26 PM.png');
    
       let post = await Post.create({
            userId: 'jaredp',
            caption: 'Seeding the database 1',
            likes: 2,
            media: {
                data: pictureBuffer1,
                contentType: 'image/jpeg' 
            }
        });
       let post2 = await Post.create({
            userId: 'jaredp',
            caption: 'Seeding the database 2',
            likes: 2,
            media: {
                data: pictureBuffer2,
                contentType: 'image/jpeg' 
            }
        });
    
    } catch (error) {
        console.log(error)
    } finally {
        console.log('Data base seed');
        mongoose.disconnect();
        
    }
}


module.exports = Seed;
