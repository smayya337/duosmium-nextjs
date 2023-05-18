'use client';
import { useSupabase } from '@/app/supabase-provider';
import { createPrismaUser } from '@/app/accounts/register/server';
import { redirect } from 'next/navigation';

export default async function Register() {
	const { supabase } = useSupabase();
	async function RegisterUser(formData: FormData) {
		const email = formData.get('email');
		const username = formData.get('username');
		const password = formData.get('password');
		const confirm = formData.get('confirm');
		if (!email || !username || !password || !confirm) {
			throw new Error('Missing fields!');
		}
		if (password !== confirm) {
			throw new Error('Passwords do not match!');
		}
		const { data, error } = await supabase.auth.signUp({
			email: email.toString(),
			password: password.toString()
		});
		if (error) {
			throw error;
		}
		await createPrismaUser(data.user, username);
		redirect('/results');
	}

	return (
		<form action={RegisterUser}>
			<label form="email">Email: </label>
			<input type={'text'} name={'email'} />
			<br />
			<label form="username">Username: </label>
			<input type={'text'} name={'username'} />
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
