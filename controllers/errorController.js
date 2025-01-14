const AppError = require('./../utils/appError');

// Handle Mongoose CastError (invalid ObjectId)
const handleJWTError = () =>
	new AppError('invalid token ,please log in again', 401);

const handleTokenExpiredError = (err) =>
	new AppError('expired token ,please log in again', 401);

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/);

	const message = `Dublicate field value : ${value}, please ue another value !`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map(
		(el) => el.message
	);
	const message = `invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

// Send detailed error in development mode
const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong‼⁉',
		msg: err.message,
	});
};

// Send simplified error in production mode
const sendErrorProd = (err, req, res) => {
	//ApI
	if (req.originalUrl.startsWith('/api')) {
		//operational ,trusted errors
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
			//oter unknown errors
		}
		// Log detailed error for debugging
		console.error('ERROR 💥', err);
		// Send generic error message
		return res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
	//for rendered websites
	if (err.isOperational) {
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong‼⁉',
			msg: err.message,
		});
	}
	// Log detailed error for debugging
	console.error('ERROR 💥', err);
	// Send generic error message
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong‼⁉',
		msg: 'please try again later',
	});
};

// Global error-handling middleware
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		error.message = err.message;

		// Explicitly copy prototype properties for `CastError`
		if (err.name === 'CastError') {
			error = handleCastErrorDB({
				path: err.path,
				value: err.value,
			});
		}

		if (err.code === 11000)
			error = handleDuplicateFieldsDB(error);
		if (err.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (err.name === 'JsonWebTokenError')
			error = handleJWTError(error);
		if (err.name === 'TokenExpiredError')
			error = handleTokenExpiredError();
		sendErrorProd(error, req, res);
	}
};
