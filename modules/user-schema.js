const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username:String,
    email: String,
    password: String,
    security_questions:[{type:String, answer:String}],
    fName: String,
    lName: String,
    img: String,
    desc: String,
    friends: [{friendUsername:String, dateAdded: Date}]
});

module.exports = mongoose.model('User', userSchema);