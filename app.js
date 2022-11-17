const uri = "mongodb+srv://dbAdmin:dbAdminPassword@cluster0.antlr.mongodb.net/BlogDatabase?retryWrites=true&w=majority";

const { Console } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
let User = require('./modules/user-schema');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Database connected!");
});

const db = mongoose.connection;
console.log(db.readyState);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get('/', (req, res) => {
    res.send("Hello Everyone!");
    const result = User.create({
        "username" :"AminaTesting",
        "password":"Testing",
        "security_questions":[ "my cat"],
        "fName":"Amina",
        "lName":"Hussein",
        "img":"fake image",
        "desc":"bruh"
    }).then(function(result){
        console.log(result)
      });

    console.log(result);
})

app.get('/users', (req, res) => {
    res.send("TESTING!");
    let id = "AminaTesting";
    const result = User.findOne({username: id}).exec().then(function(result){
        console.log(result)
      })
})

app.get('/usersList', (req, res) => {
    res.send("TESTING!");
    const result = User.find().exec().then(function(result){
        console.log(result)
      })
})


app.listen(HTTP_PORT, () => {
    console.log("API listening on: " + HTTP_PORT)
});