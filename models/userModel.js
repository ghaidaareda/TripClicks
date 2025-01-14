const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [
			true,
			'name is required',
		],
	},
	email: {
		type: String,
		required: [
			true,
			'email is required',
		],
		unique: true,
		Lowercase: true,
		validate: [
			validator.isEmail,
			'please enter a valid email address',
		],
	},
	photo: { type: String },
	role: {
		type: String,
		enum: [
			'user',
			'guide',
			'lead-guide',
			'admin',
		],
		default: 'user',
	},
	password: {
		type: String,
		required: [
			true,
			'password is required',
		],
		minlength: 8,
		select: false,
	},
	passwordConfirmation: {
		type: String,
		required: [
			true,
			'password confirmation is required',
		],
		validate: {
			// only works on create & save not for update!!
			validator: function (el) {
				return el === this.password;
			},
			message:
				'password confirmation is not the same as password',
		},
	},
	passwordChangedAt: { type: Date },
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.pre(
	'save',
	async function (next) {
		//run this function if password is modified
		if (!this.isModified('password'))
			return next();
		//has with cost of 12
		this.password = await bcrypt.hash(
			this.password,
			12
		);
		//delete password confirm field
		this.passwordConfirmation =
			undefined;
		next();
	}
);

userSchema.pre('save', function (next) {
	if (
		!this.isModified('password') ||
		this.isNew
	)
		return next();

	this.passwordChangedAt =
		Date.now() - 1000;
	next();
});

userSchema.pre(
	/^find/,
	function (next) {
		//current quary
		this.find({
			active: { $ne: false },
		});
		next();
	}
);

userSchema.methods.correctPassword =
	async function (
		candidatePassword,
		userPassword
	) {
		return bcrypt.compare(
			candidatePassword,
			userPassword
		);
	};

userSchema.methods.changePasswordAfter =
	function (JWTTimestamp) {
		if (this.passwordChangedAt) {
			const changedTimeStamp = parseInt(
				this.passwordChangedAt.getTime() /
					1000
			);
			//console.log(changedTimeStamp, JWTTimestamp);
			return (
				JWTTimestamp < changedTimeStamp
			);
		}
		// user did not change the token after it was issued
		return false;
	};

// to reset password:
userSchema.methods.createPasswordResetToken =
	function () {
		const resetToken = crypto
			.randomBytes(32)
			.toString('hex');

		this.passwordResetToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		console.log(
			{ resetToken },
			this.passwordResetToken
		);

		this.passwordResetExpires =
			Date.now() + 10 * 60 * 1000;

		return resetToken;
	};

const User = mongoose.model(
	'User',
	userSchema
);

module.exports = User;
