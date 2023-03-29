const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  sender:String,
  messageBody:String,
  timeSent:Date,
  conversationId: Number
});

module.exports = mongoose.model('Message', messageSchema);