const User = require("../users/users-model");

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  console.log(req.method, req.url, timestamp);
  // DO YOUR MAGIC
  next();
}

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      next({ status: 404, message: "user not found" });
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    next({ status: 400, message: "missing required name field" });
  } else {
    req.name = name.trim();
    next();
  }

  // DO YOUR MAGIC
  next();
}

function validatePost(req, res, next) {
  console.log("validatePost middleware");
  // DO YOUR MAGIC
  next();
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
