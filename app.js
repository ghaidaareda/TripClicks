const path = require('path');
const express = require('express');
fs = require('fs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globlErrorHandlers = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const hpp = require('hpp');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const app = express();

// pug framwork:
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serve static files from folders not from server
// app.use(express.static(`${__dirname}/starter/public`));
app.use(express.static(path.join(__dirname, 'starter/public')));

// GLOBAL middleware
//security http headers
app.use(helmet());

// dev logging
if (process.env === 'development') {
	app.use(morgan('dev'));
}

//limit requests from same IP
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, // allow only 100 requests per hour for the same IP
	message:
		'too many requests per hour for the same IP , please try again after 1 hour',
});
app.use('/api', limiter);

//body parser, read data from body into req.body

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
//data sanitization against NOSQL query injection
app.use(mongoSanitize());
//data sanitization against XSS

app.use(xss());

// param. pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'ratingsQuantity',
			'ratingsAverage',
			'maxGroupSize',
			'difficulty',
			'price',
		],
	})
);

//test middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	console.log(req.cookies);
	//console.log(req.headers);
	next();
});

//Routes:
//API ROUTES:
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //middleware to connect router to this app
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', function (req, res, next) {
	// const err = new Error(
	// 	`can't find ${req.originalUrl} on this server`
	// );
	// err.status = fail;
	// err.statusCode = 404;
	next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globlErrorHandlers);

module.exports = app;
