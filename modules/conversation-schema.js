const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let conversationSchema = new Schema(
    {
        participants : {
            type: Array
        },
        messages: [
            {
                from:String,
                to:String,
                message: String,
                date: Date
            }
        ] 
    }
);

module.exports = mongoose.model('Conversation', conversationSchema);
