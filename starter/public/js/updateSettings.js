/* eslint-disable */
import axios from 'axios';
import { showAlerts } from './alerts';

export const updateData = async (data, type) => {
	try {
		const url =
			type === 'password'
				? 'http://localhost:3000/api/v1/users/updateMypassword'
				: 'http://localhost:3000/api/v1/users/updateMe';
		const res = await axios({
			method: 'PATCH',
			url,
			data,
		});

		if (res.data.status === 'success') {
			showAlerts('success', `${type.toUpperCase()} updated successfully!`);
		}
		console.log(res);
	} catch (err) {
		showAlerts('error', err.response.data.message);
	}
};
