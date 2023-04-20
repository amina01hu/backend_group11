const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let conversationSchema = new Schema(
    {
        participants : {
            type: Array
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('conversation', conversationSchema);