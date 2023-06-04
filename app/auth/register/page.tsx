'use client';

import { getClientComponentClient } from '@/lib/global/supabase';
import { useRouter } from 'next/navigation';

export default async function Register() {
	const supabase = getClientComponentClient();
	const router = useRouter();
	async function RegisterUser(formData: FormData) {
		const email = formData.get('email');
		const password = formData.get('password');
		const confirm = formData.get('confirm');
		if (!email || !password || !confirm) {
			throw new Error('Missing fields!');
		}
		if (password !== confirm) {
			throw new Error('Passwords do not match!');
		}
		const { error } = await supabase.auth.signUp({
			email: email.toString(),
			password: password.toString()
		});
		if (error) {
			throw error;
		}
		router.push('/results');
	}

	return (
		<form action={RegisterUser}>
			<label form="email">Email: </label>
			<input type={'text'} name={'email'} />
			<br />
			<label form="password">Password: </label>
			<input type={'password'} name={'password'} />
			<br />
			<label form="confirm">Confirm password: </label>
			<input type={'password'} name={'confirm'} />
			<br />
			<button type="submit">Register</button>
		</form>
	);
}
