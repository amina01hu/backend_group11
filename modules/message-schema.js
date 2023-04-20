const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  conversationId: {
    type:String
  },
  sender: {
    type:String
  },
  messageBody: {
    type:String
  },
},
  {timestamps: true}
);

module.exports = mongoose.model('Message', messageSchema);