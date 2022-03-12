const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, "user must have an username"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "user must have a password"],
	},
});

UserSchema.virtual("publicProfile").get(function () {
	return {
		_id: this._id,
		username: this.username,
	};
});

UserSchema.virtual("getToken").get(function () {
	return {
		id: this._id,
	};
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
