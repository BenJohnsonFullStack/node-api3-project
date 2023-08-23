const express = require("express");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const User = require("./users-model");
const Post = require("../posts/posts-model");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const user = await User.get();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  const { user } = req;
  res.status(200).json(user);
  // this needs a middleware to verify user id
});

router.post("/", validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const { name } = req;
  try {
    const newUser = await User.insert({ name });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const { name } = req;
  try {
    const updatedUser = await User.update(id, { name });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  try {
    await User.remove(id);
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  try {
    const userPosts = await User.getUserPosts(id);
    res.status(200).json(userPosts);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    const post = req.text;
    const { id } = req.params;
    try {
      const userPost = await Post.insert({ user_id: id, text: post });
      res.status(201).json(userPost);
    } catch (err) {
      next(err);
    }
  }
);

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Something bad happened inside the hubs router",
  });
});

// do not forget to export the router
module.exports = router;
