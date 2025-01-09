/* eslint-disable */
import axios from 'axios';
import { showAlerts } from './alerts';

export const updateData = async (name, email) => {
	try {
		console.log(name, email);
		const res = await axios({
			method: 'PATCH',
			url: 'http://localhost:3000/api/v1/users/updateMe',
			data: {
				name,
				email,
			},
		});

		if (res.data.status === 'success') {
			showAlerts('success', 'updated successfully!');
		}
		console.log(res);
	} catch (err) {
		showAlerts('error', err.response.data.message);
	}
};
