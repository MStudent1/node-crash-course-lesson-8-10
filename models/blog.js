const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {timestamps: true})

//Model
const Blog = mongoose.model('Blog', blogSchema);
//Exports the model elsewhere in the project; model can be used to save new blog documents
model.exports = Blog;