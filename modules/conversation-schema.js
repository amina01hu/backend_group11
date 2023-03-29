const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let conversationSchema = new Schema({
    id: Number,
    participants : [{username:String}]
});

module.exports = mongoose.model('conversation', conversationSchema);