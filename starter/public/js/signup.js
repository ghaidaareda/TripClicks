/* eslint-disable */
import axios from 'axios';
import { showAlerts } from './alerts';

export const signup = async (name, email, password, passwordConfirmation) => {
	console.log(name, email, password, passwordConfirmation);
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/users/signup',
			data: { name, email, password, passwordConfirmation }, // Use camelCase
		});

		if (res.data.status === 'success') {
			showAlerts('success', 'Signup successful, please log in!');
			window.setTimeout(() => {
				location.assign('/login');
			}, 1500);
		}
		console.log(res);
	} catch (err) {
		showAlerts('error', err.response.data.message);
	}
};
