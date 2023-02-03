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
    const username = req.body.username;
    var password = req.body.password;
    password = await hashPassword(password);
    const newUser = new User({'username':username, 'email': email, 'password' : password});
    newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
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
            res.send("Account found!");
          } else {
            res.send("Incorrect password");
          }
        } else {
          res.send("User not found");
        }
      })
      .catch((error) => {
        res.send("Error: " + error);
      });
  });


router.route("/login").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then((data) => {
        if (bcrypt.compareSync(password, data.password)) {
          res.send("Account found!");
        } else {
          res.send("Account not found");
        }
      })
      .catch((err) => res.json("Error: " + err));
  });

  router.route("/resetPassword").post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
  
    User.findOne({ username: username, email: email })
      .then((data) => {
        if (data) {
          const hashedPassword = data.password;
          if (bcrypt.compareSync(password, hashedPassword)) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            User.findOneAndUpdate({ username: username, email: email }, { password: hash }, { new: true })
              .then(() => {
                res.send("Password updated successfully");
              })
              .catch((error) => {
                res.send("Error updating password: " + error);
              });
          } else {
            res.send("Incorrect password");
          }
        } else {
          res.send("User not found");
        }
      })
      .catch((error) => {
        res.send("Error: " + error);
      });
  });

module.exports = router;