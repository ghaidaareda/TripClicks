const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { request } = require('http');
const sendEmail = require('./../utils/email');

const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRE_IN *
					24 *
					60 *
					60 *
					1000
		),
		httpOnly: true, //browser recieve cookie ,store it & send it with every request
	};
	if (process.env.NODE_ENV === 'production')
		cookieOptions.secure = true; //only sent when secure connection "https://"
	res.cookie('JWT', token, cookieOptions);

	user.password = undefined; //remove password from output

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirmation: req.body.passwordConfirmation,
		passwordChangedAt: req.body.passwordChangedAt,
		role: req.body.role,
	});
	createSendToken(newUser, 201, res);
	// const token = signToken(newUser._id);
	// res.status(200).json({
	// 	status: 'success',
	// 	token,
	// 	data: {
	// 		user: newUser,
	// 	},
	// });
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	//1.check if email & password exists!
	if (!email || !password) {
		return next(
			new AppError('Please provide email and password', 400)
		);
	}

	//2.check if user exists && password is correct
	//user is User document s it a result of querying user model
	const user = await User.findOne({ email }).select(
		'+password'
	);
	//console.log(user);
	//3.if every thing is ok send token to client
	//instance methods are available to all documents

	if (
		!user ||
		!(await user.correctPassword(password, user.password))
	) {
		return next(
			new AppError('Incorrect email or password', 401)
		);
	}
	createSendToken(user, 200, res);
	// const token = signToken(user._id);
	// res.status(200).json({ status: 'sucess', token });
});

exports.logOut = (req, res) => {
	res.cookie('JWT', 'logout', {
		expires: new Date(Date.now() + 1 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};
exports.protect = catchAsync(async (req, res, next) => {
	//1)get token & check it is there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.JWT) {
		token = req.cookies.JWT;
	}

	if (!token) {
		return next(
			new AppError(
				'you are not logged in Please log in to get access.',
				401
			)
		);
	}
	//2)verify token
	const decoded = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);
	//3)check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError('the token is no longer valid', 401)
		);
	}
	//4)check if user change password after token was issued
	if (currentUser.changePasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				'user change password! Please log in again',
				401
			)
		);
	}
	req.user = currentUser;
	res.locals.user = currentUser;
	// acsess to protected route
	next();
});

// authentication :

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You do not have permission to perform this action',
					403
				)
			);
		}

		next();
	};
};

exports.forgotPassword = catchAsync(
	async (req, res, next) => {
		// 1) Get user based on POSTed email
		const user = await User.findOne({
			email: req.body.email,
		});
		if (!user) {
			return next(
				new AppError(
					'There is no user with email address.',
					404
				)
			);
		}

		// 2) Generate the random reset token
		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });
		// 3) Send it to user's email
		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/users/resetPassword/${resetToken}`;

		const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

		try {
			await sendEmail({
				email: user.email,
				subject:
					'Your password reset token (valid for 10 min)',
				message,
			});

			res.status(200).json({
				status: 'success',
				message: 'Token sent to email!',
			});
		} catch (err) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });

			return next(
				new AppError(
					'There was an error sending the email. Try again later!'
				),
				500
			);
		}
	}
);

exports.resetPassword = catchAsync(
	async (req, res, next) => {
		// 1) Get user based on the token
		const hashedToken = crypto
			.createHash('sha256')
			.update(req.params.token)
			.digest('hex');

		const user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		// 2)error token expire:
		if (!user) {
			return next(
				new AppError('Token is invalid or has expired', 400)
			);
		}
		user.password = req.body.password;
		user.passwordConfirmation =
			req.body.passwordconfirmation;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		createSendToken(user, 200, res);
		// const token = signToken(user._id);
		// res.status(200).json({ status: 'sucess', token });
	}
);

exports.updatePassword = catchAsync(
	async (req, res, next) => {
		// 1) Get user from collection
		const user = await User.findById(req.user.id).select(
			'+password'
		);

		// 2) Check if POSTed current password is correct
		if (
			!(await user.correctPassword(
				req.body.passwordCurrent,
				user.password
			))
		) {
			return next(
				new AppError('Your current password is wrong.', 401)
			);
		}

		// 3) If so, update password
		user.password = req.body.password;
		user.passwordConfirmation =
			req.body.passwordconfirmation;
		await user.save();

		createSendToken(user, 200, res);
	}
);

//only for renderd pages ,no errors
exports.isLogedIn = async (req, res, next) => {
	//1)get token & check it is there
	if (req.cookies.JWT) {
		//1)verify the token
		try {
			const decoded = await promisify(jwt.verify)(
				req.cookies.JWT,
				process.env.JWT_SECRET
			);
			//2)check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}
			//3)check if user change password after token was issued
			if (currentUser.changePasswordAfter(decoded.iat)) {
				return next();
			}
			//so logged in user
			res.locals.user = currentUser;
			return next();
		} catch (e) {
			return next();
		}
	}
	next();
};
