const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: String,
    password: String,
    security_questions:[{type:String}],
    fName: String,
    lName: String,
    img: String,
    desc: String
});

module.exports = mongoose.model('User', userSchema);