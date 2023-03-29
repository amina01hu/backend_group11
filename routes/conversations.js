const router = require('express').Router();
let Conversation = require('../modules/conversation-schema');

//get all conversations
router.route('/').get((req,res) => {
    Conversation.find()
    .then(conversations => res.json(conversations))
    .catch(err => res.status(400).json('Error conversations could not be retrieved: ' +err));
});

//get conversation by id
router.route('/:id').get((req,res) => {
    Conversation.findById(req.params.id)
    .then(conversations => res.json(conversations))
    .catch(err => res.status(400).json('Error could not get conversation by id: '+err));
});
//create coversation 
router.route('/add').post(async (req, res) => {
    const id = req.body.id;
    var participants = req.body.participants;
    const newConversation = new Conversation({'id': id, 'participants': participants});
    newConversation.save()
    .then(() => res.json(newConversation))
    .catch(err => res.status(400).json('Error could not create a new conversation: ' + err));
});


module.exports = router;