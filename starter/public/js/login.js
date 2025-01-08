/* eslint-disable */
import axios from 'axios';
import { showAlerts } from './alerts';

export const login = async (email, password) => {
	console.log(email, password);
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/users/login',
			data: { email, password },
		});

		if (res.data.status === 'success') {
			showAlerts('success', 'Login successfuly');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
		console.log(res);
	} catch (err) {
		showAlerts('error', err.response.data.message);
	}
};

export const logOut = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: 'http://localhost:3000/api/v1/users/logout',
		});
		if (res.data.status === 'success') {
			location.reload(true);
		}
	} catch (err) {
		showAlerts('error', 'Error logging out , try again!');
	}
};

export const signup = async (name, email, password, passwordConfirmation) => {
	console.log(name, email, password, passwordConfirmation);
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/users/signup',
			data: { name, email, password, passwordConfirmation }, // Use camelCase
		});

		if (res.data.status === 'success') {
			showAlerts('success', 'Signup successful!');
		}
		console.log(res);
	} catch (err) {
		showAlerts('error', err.response.data.message);
	}
};
