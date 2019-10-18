const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/topics/:topicId/posts/new", postController.new);
router.post("/topics/:topicId/posts/create",
  helper.ensureAuthenticated, // The middleware function chain starts by making
  validation.validatePosts, // sure the user is authenticated then validates
  postController.create); // the attributes, then calls controller action
router.get("/topics/:topicId/posts/:id", postController.show);
router.post("/topics/:topicId/posts/:id/destroy", postController.destroy);
router.get("/topics/:topicId/posts/:id/edit", postController.edit);
router.post("/topics/:topicId/posts/:id/update", validation.validatePosts, postController.update);

module.exports = router;
