const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');

exports.aliasTopTours = async (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage, price';
	req.query.fields = 'name, price, difficulty';
	next();
};

// exports.getAllTours = catchAsync(
// 	async (req, res, next) => {
// 		//excute the query
// 		const features = new APIFeatures(
// 			Tour.find(),
// 			req.query
// 		)
// 			.filter()
// 			.sort()
// 			.limitFields()
// 			.paginate();
// 		const tours = await features.query;

// 		//send request
// 		res.status(200).json({
// 			status: 'success',
// 			requestedat: tours.length,
// 			data: { tours },
// 		});
// 	}
// );

exports.getAllTours = factory.getAll(Tour);
exports.createNewTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getOnetour = factory.getOne(Tour, { path: 'reviews' });

// exports.getOnetour = catchAsync(async (req, res, next) => {
// 	// const { id } = req.params;
// 	// // Validate ObjectId
// 	// if (!mongoose.Types.ObjectId.isValid(id)) {
// 	// 	return next(new AppError('Invalid ID format', 400)); // Bad request
// 	// }
// 	const tour = await Tour.findById(req.params.id).populate(
// 		'reviews'
// 	); // create new quary

// 	//Tour.finfOne({_id: req.params.id}) both works rhe same

// 	if (!tour) {
// 		return next(
// 			new AppError('No tour found with that id', 404)
// 		);
// 	}
// 	res.status(200).json({
// 		status: 'success',
// 		data: { tour },
// 	});
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
// 	// const { id } = req.params;
// 	// if (!mongoose.Types.ObjectId.isValid(id)) {
// 	// 	return next(new AppError('Invalid ID format', 400)); // Bad request
// 	// }
// 	const tour = await Tour.findByIdAndDelete(req.params.id);
// 	if (!tour) {
// 		return next(
// 			new AppError('No tour found with that id', 404)
// 		);
// 	}
// 	res.status(204).json({
// 		//no content ( null)
// 		status: 'success',
// 		data: null,
// 	});
// });

exports.getTourStats = catchAsync(async function (req, res, next) {
	const stats = await Tour.aggregate([
		{
			$match: {
				ratingsAverage: { $gte: 4.5 },
			},
		},
		{
			$group: {
				_id: {
					$toUpper: '$difficulty',
				}, //null, //group by difficulty
				numTours: { $sum: 1 }, // count documents
				numRatings: {
					$sum: '$ratingsQuantity',
				},
				averageRating: {
					$avg: '$ratingsAverage',
				},
				averagePrice: {
					$avg: '$price',
				},
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
		{
			$sort: {
				averagePrice: 1,
			},
		},
		// {
		// 	$match: { _id: { $ne: 'EASY' } },
		// },
	]);
	res.status(200).json({
		status: 'success',
		data: {
			stats,
		},
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year * 1;
	const plan = await Tour.aggregate([
		{ $unwind: '$startDates' },
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: {
					$month: '$startDates',
				},
				numTourStarts: { $sum: 1 },
				tour: { $push: '$name' },
			},
		},
		{ $addFields: { month: '$_id' } },
		{ $project: { _id: 0 } },
		{ $sort: { numTourStarts: -1 } },
		{ $limit: 6 },
	]);

	res.status(200).json({
		status: 'success',
		data: {
			plan,
		},
	});
});

//tours-within/:distance/center/:latlng/unit/:unit,
//tours-within/300/center/23,44/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');
	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		next(
			new AppError('please provide latitude and langtude in the request'),
			400
		);
	}

	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	console.log(distance, lat, lng, unit);
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			data: tours,
		},
	});
});
