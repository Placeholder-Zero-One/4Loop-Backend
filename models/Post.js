const mongoose = require('mongoose');

// Destructure Schema from mongoose, which provides the structure for each document in a MongoDB collection.
const { Schema } = mongoose;


let mediaSchema = new Schema({
    
    data: String
  
});

let videoSchema = new Schema({
    data: Buffer,
    contentType: String
});


let postSchema = new Schema({
    userId: String,
    title:String,
    caption: String,
    likes: Number,
    media: mediaSchema
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
