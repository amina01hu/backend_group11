const router = require('express').Router();
let Message = require('../modules/message-schema');

//get all messages
router.route('/').get((req,res) => {
    Message.find()
    .then(messages => res.json(messages))
    .catch(err => res.status(400).json('Error message could not be retrieved: ' +err));
});

//get messages by id
router.route('/:id').get((req,res) => {
    Message.findById(req.params.id)
    .then(messages => res.json(messages))
    .catch(err => res.status(400).json('Error could not get messages by id: '+err));
});
//create coversation 
router.route('/add').post(async (req, res) => {
    var sender = req.body.sender;
    var messageBody = req.body.messageBody;
    var timeSent = req.body.timeSent;
    var conversationId = req.body.conversationId;
    const newMessage = new Message({'sender': sender, 'messageBody': messageBody, 'timeSent': timeSent, 'conversationId':conversationId});
    newMessage.save()
    .then(() => res.json(newMessage))
    .catch(err => res.status(400).json('Error could not create a new message: ' + err));
}); 


module.exports = router;