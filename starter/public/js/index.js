/*eslint-disable*/
import '@babel/polyfill';
import { login, logOut, signup } from './login';

const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const signUpForm = document.querySelector('.form');

if (loginForm)
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});

if (signUpForm)
	signUpForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const name = document.getElementById('name').value;
		const passwordConfirmation = document.getElementById(
			'passwordConfirmation'
		).value;
		signup(name, email, password, passwordConfirmation);
	});

if (logOutBtn) logOutBtn.addEventListener('click', logOut);
