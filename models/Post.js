const mongoose = require('mongoose');

// Destructure Schema from mongoose, which provides the structure for each document in a MongoDB collection.
const { Schema } = mongoose;

// The Buffer data type is used to store the actual binary data of the media file in the data property of the media field. 
//The Buffer type allows you to efficiently store and manipulate binary data in Node.js.
let mediaSchema = new Schema({
    data: Buffer,
    contentType: String
});

let videoSchema = new Schema({
    data: Buffer,
    contentType: String
});

let postSchema = new Schema({
    userId: String,
    caption: String,
    likes: Number,
    media: mediaSchema,
    video: videoSchema // You can also embed the videoSchema in your postSchema if required
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
