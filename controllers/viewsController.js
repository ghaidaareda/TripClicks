const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
	const tours = await Tour.find();

	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({
		slug: req.params.slug,
	}).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	if (!tour) {
		return next(
			new AppError('No tour found with that name', 404)
		);
	}

	res.status(200).render('tour', {
		title: `${tour.name} Tour`,
		tour,
	});
});

exports.getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account',
	});
};

exports.getSignupForm = (req, res) => {
	res.status(200).render('signup', {
		title: 'signup now...',
	});
};

exports.getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your account',
	});
};
