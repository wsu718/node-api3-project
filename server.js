const express = require('express');

const UsersRouter = require('./users/userRouter.js');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(express.json());
// server.use(logger);

server.use('/api/users', UsersRouter);

//custom middleware

// - `logger` logs to the console the following information about each request: request method, request url, and a timestamp
// - this middleware runs on every request made to the API

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`(+new Date))
  next();
}

module.exports = server;
