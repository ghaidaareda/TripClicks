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
