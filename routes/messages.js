const router = require('express').Router();
let Message = require('../modules/message-schema');


//get messages by conversation id
router.route('/:conversationId').get(async (req,res) => {
    try{
        const messages = await  Message.find({
            conversationId: req.params.conversationId
        })
        .then(() => res.status(200).json(messages))
        .catch(err => res.status(400).json('Error could not get messages by conversatioin id: '+err));
    }catch(error){
        res.status(500).json(error);
    }
});

// add new message
router.route('/').post(async (req, res) => {
    try{
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save()
        .then(() => res.status(200).json(savedMessage))
        .catch(err => res.status(400).json('Error could not add a new message: ' + err));
     }catch(error){
        res.status(500).json(error);
    }
}); 


module.exports = router;