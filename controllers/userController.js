const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFileds) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFileds.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		status: 'success',
		requestedat: users.length,
		data: { users },
	});
});

exports.updateMe = async (req, res, next) => {
	//create error if user post password data
	if (req.body.password || req.body.passwordConfirmation) {
		return next(
			new AppError(
				'Thia route is not for password updates,please use updateMyPassword',
				400
			)
		);
	}
	//filter out unwanted fields
	const filteredBody = filterObj(req.body, 'name', 'email');

	//update user document
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{ new: true, runValidators: true }
	);

	res.status(200).json({
		status: 'success',
		data: { user: updatedUser },
	});
};

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, {
		active: false,
	});

	res.status(204).json({
		status: 'success',
		data: null,
	});
	//next();
});

exports.getOneUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'this route is not yet implemented',
	});
};
exports.createNewUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'this route is not yet implemented',
	});
};
//dont update user with new password with this!
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
