const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
	'/signup',
	authController.signup
);
router.post(
	'/login',
	authController.login
);
router.post(
	'/forgotPassword',
	authController.forgotPassword
);
router.patch(
	'/resetPassword/:token',
	authController.resetPassword
);

//protected
router.use(authController.protect);

router.get(
	'/me',

	userController.getMe,
	userController.getOneUser
);
router.patch(
	'/updateMyPassword',

	authController.updatePassword
);
router.patch(
	'/updateMe',

	userController.updateMe
);
router.delete(
	'/deleteMe',
	userController.deleteMe
);

// restricted to admin
router.use(
	authController.restrictTo('admin')
);

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createNewUser);
router
	.route('/:id')
	.get(userController.getOneUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
