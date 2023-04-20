const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema({
    id:Number,
    username:String,
    title:String,
    data: String,
    img: [{type:String}],
    text: String,
    comments: [
        {id:Number, username:String, text:String, date: Date}
        ] 
});

module.exports = mongoose.model('Post', postSchema);