/* eslint-disable */
import axios from 'axios';
import { showAlerts } from './alerts';

export const updateData = async (name, email) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
			data: {
				name,
				email,
			},
		});

		if (res.data.status === 'success') {
			showAlerts('success', `${type.toUpperCase()} updated successfully!`);
		}
	} catch (err) {
		console.log(err.response.data.message);
		showAlerts('error', err.response.data.message);
	}
};
