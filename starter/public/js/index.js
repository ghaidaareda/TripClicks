/*eslint-disable*/
import '@babel/polyfill';
import { login, logOut } from './login';
import { signup } from './signup';
import { bookTour } from './stripe';

const loginForm = document.querySelector('.login-form');
const logOutBtn = document.querySelector(
	'.nav__el--logout'
);
const signUpForm = document.querySelector('.signup-form');
const bookBtn = document.getElementById('book-tour');

console.log(bookBtn);

if (signUpForm)
	signUpForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password =
			document.getElementById('password').value;
		const name = document.getElementById('name').value;
		const passwordConfirmation = document.getElementById(
			'passwordConfirmation'
		).value;
		signup(name, email, password, passwordConfirmation);
	});

if (loginForm)
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password =
			document.getElementById('password').value;
		login(email, password);
	});

if (logOutBtn) logOutBtn.addEventListener('click', logOut);

document.addEventListener('DOMContentLoaded', () => {
	const bookBtn = document.getElementById('book-tour');
	if (bookBtn) {
		bookBtn.addEventListener('click', (e) => {
			console.log('Button clicked');
			e.target.textContent = 'Processing...';
			const tourId = e.target.dataset.tourId;
			console.log('Tour ID:', tourId);
			bookTour(tourId);
		});
	}
	console.log('Book button not found');
});
