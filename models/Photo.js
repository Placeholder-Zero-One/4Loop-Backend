const mongoose = require('mongoose');

// Destructure Schema from mongoose, which provides the structure for each document in a MongoDB collection.
const { Schema } = mongoose;



let photoSchema = new Schema({
  
    image: String
   
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;