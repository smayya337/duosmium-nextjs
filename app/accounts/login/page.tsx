'use client';
import { useSupabase } from '@/app/supabase-provider';

export default async function Login() {
	const { supabase } = useSupabase();
	async function LogInEmailPassword(formData: FormData) {
		const email = formData.get('email');
		const password = formData.get('password');
		if (!email || !password) {
			throw new Error('Missing fields!');
		}
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.toString(),
			password: password.toString()
		});
		if (error) {
			throw error;
		}
		return data;
	}
	return (
		<form action={LogInEmailPassword}>
			<label form="email">Email: </label>
			<input type={'text'} name={'email'} />
			<br />
			<label form="password">Password: </label>
			<input type={'password'} name={'password'} />
			<br />
			<button type="submit">Submit</button>
		</form>
	);
}
