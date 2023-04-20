const router = require('express').Router();
let Conversation = require('../modules/conversation-schema');

//create new coversation 
router.route('/').post(async (req, res) => {
    const newConversation = new Conversation({
            participants : [req.body.senderId, req.body.receiverId]
        });
        try{
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        }catch(error){
            res.status(500).json(error);
        }
});

//get conversations of a certain user
router.route('/:userId').get(async (req,res) => {
    try{
        const userConversation = await Conversation.find({
            particpants: {$in: [req.params.userId] }
        });
        res.status(200).json(userConversation);
    }catch(error){
        res.status(500).json(error);
    }
});

//get conversations using two userids

router.route('/find/:firstUserId/:secondUserId').get(async (req, res) => {
    try{
        const conversation = await Conversation.find({
            particpants: {$all: [req.params.userId, req.params.secondUserId] }
        });
        res.status(200).json(conversation);
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;