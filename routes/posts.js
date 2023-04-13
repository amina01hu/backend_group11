const router = require('express').Router();
let Post = require('../modules/post-schema');

//get all posts
router.route('/').get((req,res) => {
    Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error could not get all posts: ' +err));
});

//get post by id
router.route('/:id').get((req,res) => {
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error could not get posts by id: '+err));
});

//get all posts made by a user
router.route('/byUser').post(async (req,res) => {
    try {
        const posts = await Post.find({ username: req.body.username });
        res.json(posts);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});

//create post 
router.route('/add').post(async (req, res) => {
    const title = req.body.title;
    const username = req.body.username;
    var data = req.body.data;
    var img = req.body.img
    var text = req.body.text;
    var comments = req.body.comments;

    const newPost = new Post({'title': title, 'username':username, 'data': data, 'img' : img, 'text' : text, 'comments': comments});
    newPost.save()
    .then(() => res.json(newPost))
    .catch(err => res.status(400).json('Error could not add a new post: ' + err));
});

//delete post by id
router.route('/:id').delete((req,res) => {
    Post.findByIdAndDelete(req.params.id)
    .then(posts => res.json('Post deleted'))
    .catch(err => res.status(400).json('Error post could not be deleted: '+err));
});

//update post by id
router.route('/update/:id').post((req,res) => {
    Post.findById(req.params.id)
    .then(posts => {
        posts.title = req.body.title;
        posts.username = req.body.username;
        posts.data = req.body.data;
        posts.img = req.body.img
        posts.text = req.body.text;
        posts.comments = req.body.comments;
    posts.save()
    .then(() => res.json('Posts updated !'))
    .catch(err => res.status(400).json('Error post could not be updated '+err));
    })
    .catch(err => res.status(400).json('Error post could not be found: '+err));
});

//add comment to post
router.route('/addComment/:id').post((req,res) =>{
    var commenterUsername = req.body.commenterUsername;
    var commenterText = req.body.commenterText;
    var postId = req.params.id;
    var newComment = {'username' :commenterUsername, 'text': commenterText, 'date': new Date};
    Post.findByIdAndUpdate(postId, 
        { $push: { comments: newComment }})
        .then((updatedPost) => {
          res.json("Comment added! : " + updatedPost.comments)
        })
        .catch((error) => {
          res.json("Error adding comment: " + error);
        });
})

//remove comment from post
router.route('/removeComment/:id').post((req,res) =>{
    var commenterUsername = req.body.commenterUsername;
    var commenterText = req.body.commenterText;
    var postId = req.params.id;
    var newComment = {'username' :commenterUsername, 'text': commenterText, 'date': new Date};
    Post.findByIdAndUpdate(postId, 
        { $pull: { comments: newComment }})
        .then((updatedPost) => {
          res.json("Comment removed! : " + updatedPost.comments)
        })
        .catch((error) => {
          res.json("Error removing comment: " + error);
        });
})

//remove comment from post
router.route('/editComment/:id').post((req,res) =>{
    const commenterUsername = req.body.commenterUsername;
    const commenterText = req.body.commenterText;
    const postId = req.params.id;

    Post.findOneAndUpdate(
        { id: postId, "comments.username": commenterUsername },
        { $set: {"comments.$.text": commenterText } },
        { new: true })
        .then((updatedPost) => {
        res.json("Comment updated! : " + updatedPost.comments);
        })
        .catch((error) => {
        res.json("Error updating comment: " + error);
        });
})


module.exports = router;