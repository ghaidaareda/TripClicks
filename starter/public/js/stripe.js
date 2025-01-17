/* eslint-disable */
import axios from 'axios';

let stripe = null;
const loadStripe = async () => {
	if (!stripe) {
		const stripeJs = await import(
			'https://js.stripe.com/v3/'
		);
		stripe = stripeJs.Stripe(
			'pk_test_51Qhu0eAIHBLWm4gzFWJhMyg39ZBAx2Q4ogyzBLmBI4VRV7dRgoP7wvvobygRC9I2e9xyTXEtTPMUPSYgg5EpfFWG00a5Qf3WS0'
		);
	}
	return stripe;
};

export const bookTour = async (tourId) => {
	try {
		// Get checkout session from server
		const session = await axios(
			`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
		);
		console.log('Checkout session:', session);

		// You can add logic here to redirect to Stripe checkout or trigger some other action
	} catch (error) {
		console.error('Error booking tour:', error);
	}
};
