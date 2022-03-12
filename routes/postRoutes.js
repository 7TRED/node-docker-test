const express = require("express");
const postController = require("../controllers/postController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(postController.getAllPosts).post(authenticate, postController.createPost);

router
	.route("/:id")
	.get(postController.getOnePost)
	.patch(authenticate, postController.updatePost)
	.delete(authenticate, postController.deletePost);

module.exports = router;
