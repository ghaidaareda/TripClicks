/*eslint-disable*/
import '@babel/polyfill';
import { login, logOut } from './login';
import { signup } from './signup';
import { updateData } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signUpForm = document.querySelector('.signup-form');
const userDataform = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

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

if (loginForm)
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});

if (logOutBtn) logOutBtn.addEventListener('click', logOut);

if (userDataform)
	userDataform.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		updateData({ name, email });
	});

if (userPasswordForm)
	userPasswordForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.btn--save-password').textContent = 'Updating...';

		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordconfirmation =
			document.getElementById('password-confirm').value;
		await updateData(
			{ passwordCurrent, password, passwordconfirmation },
			'password'
		);

		document.querySelector('.btn--save-password').textContent = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
