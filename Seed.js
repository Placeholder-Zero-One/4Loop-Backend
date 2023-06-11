const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const Post = require('./models/Post');
let post
async function Seed() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const pictureBuffer1 = fs.readFileSync('/Users/jaredplummer/Desktop/imgPost1.png');
        const pictureBuffer2 = fs.readFileSync('/Users/jaredplummer/Desktop/postImage2.png');
        const pictureBuffer3 = fs.readFileSync('/Users/jaredplummer/Desktop/postImage3.png');
        const pictureBuffer4 = fs.readFileSync('/Users/jaredplummer/Desktop/postImage4.png');

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
        let post3 = await Post.create({
            userId: 'jaredp',
            caption: 'Seeding the database 3',
            likes: 2,
            media: {
                data: pictureBuffer3,
                contentType: 'image/jpeg' 
            }
        });
        let post4 = await Post.create({
            userId: 'jaredp',
            caption: 'Seeding the database 4',
            likes: 2,
            media: {
                data: pictureBuffer4,
                contentType: 'image/jpeg' 
            }
        });
        
    } catch (error) {
        console.log(error)
    } finally {
        console.log('Post Saved', post);
        mongoose.disconnect();
    }
}

module.exports = Seed;
