const router = require('express').Router();
let Conversation = require('../modules/conversation-schema');

// create new conversation 
router.route('/').post(async (req, res) => {
    const newConversation = new Conversation({
        participants : [req.body.senderId, req.body.receiverId]
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch(error) {
        res.status(500).json(error);
    }
});

// get conversations of a certain user
router.route('/:userId').get(async (req,res) => {
    try {
        const userConversations = await Conversation.find({
            participants: { $in: [req.params.userId] }
        });
        res.status(200).json(userConversations);
    } catch(error) {
        res.status(500).json(error);
    }
});

//get conversations using two userids
router.route('/find/:firstUserId/:secondUserId').get(async (req, res) => {
    try{
        const conversation = await Conversation.find({
            participants: {$all: [req.params.firstUserId, req.params.secondUserId] }
        });
        res.status(200).json(conversation);
    }catch(error){
        res.status(500).json(error);
    }
});

// get a specific conversation by ID
router.route('/conversation/:id').get(async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        res.status(200).json(conversation);
    } catch(error) {
        res.status(500).json(error);
    }
});

// add message to conversation 
router.route('/:id/sendMessage').post(async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        const newMessage = {
            from: req.body.sender,
            to: req.body.receiver,
            message: req.body.message,
            date: new Date()
        };
        conversation.messages.push(newMessage);
        await conversation.save();
        res.status(200).json(conversation);
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = router;
