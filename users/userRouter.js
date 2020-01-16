const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

// - `insert()`: calling insert passing it a `resource` object will add it to the database and return the new `resource`.

router.post('/', validateUser, (req, res) => {
  Users
    .insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error creating the user' })
    })

});


router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  Posts
    .insert({ ...req.body, user_id: req.params.id })
    .then(post => {
      res.status(201).json(post)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'error creating post' })
    })
});

router.get('/', (req, res) => {
  Users
    .get()
    .then(userList => {
      res.status(200).json(userList)
    })
    .catch(() => {
      res.status(500).json({ error: "The user list could not be retrieved." })
    })
});

// - `getById()`: takes an `id` as the argument and returns a promise that resolves to the `resource` with that id if found.

router.get('/:id', validateUserId, (req, res) => {
  req.user
    ? res.status(200).json(req.user)
    : res.status(500).json({
      message: 'Error retrieving the user'
    });
})

router.get('/:id/posts', validateUserId, (req, res) => {
  Users
    .getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error retriving user posts' })
    })
})

router.delete('/:id', validateUserId, (req, res) => {
  Users
    .remove(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error deleting user' })
    })
});

router.put('/:id', validateUserId, (req, res) => {
  Users
    .update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error updating user' })
    })
});

//custom middleware

// - `validateUserId()`

//   - `validateUserId` validates the user id on every request that expects a user id parameter
//   - if the `id` parameter is valid, store that user object as `req.user`
//   - if the `id` parameter does not match any user id in the database, cancel the request and respond with status `400` and `{ message: "invalid user id" }`

// - `getById()`: takes an `id` as the argument and returns a promise that resolves to the `resource` with that id if found.

function validateUserId(req, res, next) {
  Users
    .getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next()
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'There was an error' })
    })
};

// - `validateUser()`

//   - `validateUser` validates the `body` on a request to create a new user
//   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing user data" }`
//   - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`


function validateUser(req, res, next) {

  // console.log(req.body)
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" })
  }
  else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  }
  else {
    next()
  }
}


// - `validatePost()`
//   - `validatePost` validates the `body` on a request to create a new post
//   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing post data" }`
//   - if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }`

// - `insert()`: calling insert passing it a `resource` object will add it to the database and return the new `resource`.

function validatePost(req, res, next) {
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing text field" });
  } else {
    next();
  }
}

module.exports = router;
