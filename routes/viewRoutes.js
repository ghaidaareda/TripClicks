const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();
const authController = require('../controllers/authController');

router.get(
	'/',
	authController.isLogedIn,
	viewsController.getOverview
);
router.get(
	'/tour/:slug',
	authController.isLogedIn,
	viewsController.getTour
);
router.get(
	'/login',
	authController.isLogedIn,
	viewsController.getLoginForm
);
router.get('/signup', viewsController.getSignupForm);
router.get(
	'/me',
	authController.protect,
	viewsController.getAccount
);

module.exports = router;
