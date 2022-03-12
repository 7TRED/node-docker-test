const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signUp = async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await new User({ username, password: hashedPassword }).save();
		res.status(201).json({
			status: "success",
			data: {
				user: newUser.publicProfile,
			},
		});
	} catch (e) {
		res.status(400).json({
			status: "fail",
		});
	}
};

exports.signIn = async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (user === null) {
			throw new Error("user with the username does not exist");
		}
		const checked = await bcrypt.compare(password, user.password);
		if (checked) {
			req.session.user = user.getToken;
			res.status(201).json({
				status: "success",
				data: {
					user: user.publicProfile,
				},
			});
		} else {
			throw new Error("Incorrect username or password");
		}
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.signOut = (req, res, next) => {
	if (req.session.user) {
		req.session.user = null;
		res.status(200).json({
			status: "success",
		});
	} else {
		res.status(400).json({
			status: "fail",
			message: "You are not logged in!",
		});
	}
};
