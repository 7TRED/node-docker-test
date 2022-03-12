const User = require("../models/userModel");

exports.authenticate = async (req, res, next) => {
	if (req.session.user) {
		const userID = req.session.user.id;
		const user = await User.findById(userID);
		if (user) {
			req.user = user;
			return next();
		}
	}

	res.status(401).json({
		status: "Unauthorized",
		message: "please sign-in to access",
	});
};
