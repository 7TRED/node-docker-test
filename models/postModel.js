const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: {
		type: String,
		required: [true, "Post must have title"],
	},
	body: {
		type: String,
		required: [true, "post must have a body"],
	},
});

const Post = new mongoose.model("Post", PostSchema);
module.exports = Post;
