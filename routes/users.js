const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../modules/user-schema');

async function hashPassword(password){
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}


router.route("/").get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    const email = req.body.email;
    var password = req.body.password;
    password = await hashPassword(password);
    const newUser = new User({'email': email, 'password' : password});
    newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post(async (req, res) => {
    const email = req.body.email;
    var password = req.body.password;
    var matchPass = await hashPassword(password);
    User.findOne({'email' : email })
    .then((data) => {
        if(data.password == matchPass){
            res.json("User found! Login Successful")
        }
    }).catch(err => res.status(400).json("Error: " + err))
    
})

router.route('/resetLoggedIn').post(async (req, res) => {
    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var matchPass = await hashPassword(oldPassword);
    var newPassHashed = await hashPassword(newPassword);
    User.findOne({'email' : email })
    .then((data) => {
        if(data.password == matchPass){
            User.updateOne({'email' : email }, 
                {'password': newPassHashed})
                .then(() => res.json("Password changed"))
                .catch(err => res.status(400).json("Error: " + err))
        }
    }).catch(err => res.status(400).json("Error: " + err))
    
})

module.exports = router;