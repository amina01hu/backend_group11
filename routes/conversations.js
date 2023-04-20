const router = require('express').Router();
let Conversation = require('../modules/conversation-schema');

//create new coversation 
router.route('/').post(async (req, res) => {
    const newConversation = new Conversation({
            participants : [req.body.senderId, req.body.receiverId]
        });
        try{
            const savedConversation = await newConversation.save()
            .then(() => res.status(200).json(savedConversation))
            .catch(err => res.status(400).json('Error could not create a new conversation: ' + err));
        }catch(error){
            res.status(500).json(error);
        }
});

//get conversations of a certain user
router.route('/:userId').get(async (req,res) => {
    try{
        const userConversation = await Conversation.find({
            particpants: {$in: [req.params.userId] }
        })
        .then(() => res.status(200).json(userConversation))
        .catch(err => res.status(400).json('Error could not get conversation by user id: '+err));
    }catch(error){
        res.status(500).json(error);
    }

});

//get conversations using two userids

router.route('find/:firstUserId/:secondUserId').get(async (req, res) => {
    try{
        const conversation = await Conversation.find({
            particpants: {$all: [req.params.userId, req.params.secondUserId] }
        })
        .then(() => res.status(200).json(conversation))
        .catch(err => res.status(400).json('Error could not get conversation by the user ids given: '+err));
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;