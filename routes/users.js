const router = require('express').Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
let User = require('../modules/user-schema');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth : {
    user: "aminaisnotepic@gmail.com",
    pass: "qqgowvhftxiqcssw"
  },
  tls : {
    rejectUnauthorized: false
  }
})

async function hashPassword(password){
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}


router.route("/").get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error could not get all suers: ' + err));
});

router.route('/add').post(async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const username = req.body.username;
    var password = req.body.password;
    password = await hashPassword(password);
    var security_questions = req.body.security_questions;
    var fName = req.body.fName;
    var lName = req.body.lName;
    var img = req.body.img;
    var desc = req.body.desc;
    var friends = req.body.friends;
    const newUser = new User({'username':username, 'email': email, 'password' : password, 'security_questions': security_questions,
  'fName': fName, 'lName':lName, 'img':img, 'desc':desc, 'friends':friends});
    newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error could not add new user: ' + err));
});


router.route("/getUser").post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ username: username, email: email })
      .then((data) => {
        if (data) {
          const hashedPassword = data.password;
          if (bcrypt.compareSync(password, hashedPassword)) {
            res.json("Account found!");
          } else {
            res.json("Incorrect password");
          }
        } else {
          res.json("User not found");
        }
      })
      .catch((error) => {
        res.json("Error: " + error);
      });
  });


router.route("/getFriends").post(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = user.friends;

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.route("/login").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then((data) => {
          if(data){
            if (bcrypt.compareSync(password, data.password)) {
                res.json("Account found!");
              } else {
                res.json("Incorrect password");
              }
          } else{
              res.json("Account does not exist!")
          }
      })
      .catch((err) => res.json("Error: " + err));
  });

router.post('/addFriend', async (req, res) => {
  const { userEmail, friendEmail } = req.body;
  
  try {
    const friendUser = await User.findOne({ email: friendEmail });
    if (!friendUser) {
      return res.status(404).json({ error: 'Friend not found' });
    }
  
    const friendObj = { friendUsername: friendUser.username, dateAdded: new Date() };
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { friends: friendObj } },
      { new: true }
    );
  
    res.json(updatedUser.friends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});
  

  router.route("/removeFriend").post(async (req, res) =>{
    const { userEmail, friendEmail } = req.body;
  
    try {
      const friendUser = await User.findOne({ email: friendEmail });
      if (!friendUser) {
        return res.status(404).json({ error: 'Friend not found' });
      }
    
      const friendObj = { friendUsername: friendUser.username, dateAdded: new Date() };
      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        { $pull: { friends: friendObj } },
        { new: true }
      );
    
      res.json(updatedUser.friends);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
  })

  router.route("/resetPassword").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
  
    User.findOne({email: email })
      .then((data) => {
        if (data) {
          const hashedPassword = data.password;
          if (bcrypt.compareSync(password, hashedPassword)) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            User.findOneAndUpdate({email: email }, { password: hash }, { new: true })
              .then(() => {
                res.json("Password updated successfully");
              })
              .catch((error) => {
                res.json("Error updating password: " + error);
              });
          } else {
            res.json("Incorrect password");
          }
        } else {
          res.json("User not found");
        }
      })
      .catch((error) => {
        res.json("Error: " + error);
      });
  });

  router.route("/forgotPassword").post(async (req, res) => {
    const email = req.body.email;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(password);
    let mailOptions = {
      from: "aminaisnotepic@gmail.com",
      to: `${email}`, 
      subject: "Forgot your password - Social Media Blog",
      text: `Hello,
      This is an email sent from the Social Media Blog. Please login to the account with this new password: ${password}`
    }
    User.findOne({email: email })
      .then((data) => {
        if (data) {
            User.findOneAndUpdate({email: email }, { password: hashedPassword }, { new: true })
              .then(() => {
                transporter.sendMail(mailOptions, function(err, success){
                  if(err){
                    console.log(err);
                  }else{
                    res.json("Email sent successfully!");
                  }
                })
              })
              .catch((error) => {
                res.json("Error updating password: " + error);
              });

        } else {
          res.json("User not found");
        }
      })
      .catch((error) => {
        res.json("Error: " + error);
      });
  });

module.exports = router;