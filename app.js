const uri = "mongodb+srv://dbAdmin:dbAdminPassword@cluster0.antlr.mongodb.net/Blog-Database?retryWrites=true&w=majority";

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
let User = require('./modules/user-schema');
let Post = require('./modules/post-schema');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Database connected!");
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get('/', (req, res) => {
    res.send("Hello Everyone watching this deployment video!");
})

app.get('/users', (req, res) => {
    res.send("Searching for user AminaTesting!");
    let id = "AminaTesting";
    const result = User.findOne({username: id}).exec().then(function(result){
        console.log(result);
      })
})

app.get('/usersList', (req, res) => {
    res.send("Searching for all User records !");
    const result = User.find().exec().then(function(result){
        console.log(result)
      })
})

app.get('/posts', (req, res) => {
    res.send("Searching for post by AminaTesting!");
    let id = "AminaTesting";
    const result = Post.findOne({username: id}).exec().then(function(result){
        console.log(result)
      })
  })
  
  app.get('/postsList', (req, res) => {
    res.send("Searching for all User posts!");
    const result = Post.find().exec().then(function(result){
        console.log(result)
      })
  })


app.listen(HTTP_PORT, () => {
    console.log("API listening on: " + HTTP_PORT)
});