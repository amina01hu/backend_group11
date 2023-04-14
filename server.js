const uri = "mongodb+srv://dbAdmin:dbAdminPassword@cluster0.antlr.mongodb.net/Blog-Database?retryWrites=true&w=majority";

const express = require("express");
const rateLimit = require('express-rate-limit');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const HTTP_PORT = process.env.PORT || 8080;

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100
});

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Database connected!");
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const conversationsRouter = require('./routes/conversations');
const messagesRouter = require('./routes/messages');

app.use('/users', limiter, usersRouter);
app.use('/posts', limiter, postsRouter);
app.use('/conversations', limiter, conversationsRouter);
app.use('/messages', limiter, messagesRouter);

app.get('/', (req, res) => {
    res.send("Hello Everyone!");
})

app.listen(HTTP_PORT, () => {
    console.log("API listening on: " + HTTP_PORT)
});