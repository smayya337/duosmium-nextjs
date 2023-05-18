'use client';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from "next/navigation";

export default async function Login() {
	const { supabase } = useSupabase();
	const router = useRouter();
	async function LogInEmailPassword(formData: FormData) {
		const email = formData.get('email');
		const password = formData.get('password');
		if (!email || !password) {
			throw new Error('Missing fields!');
		}
		const { error } = await supabase.auth.signInWithPassword({
			email: email.toString(),
			password: password.toString()
		});
		if (error) {
			throw error;
		}
		router.push('/results');
	}
	return (
		<form action={LogInEmailPassword}>
			<label form="email">Email: </label>
			<input type={'text'} name={'email'} />
			<br />
			<label form="password">Password: </label>
			<input type={'password'} name={'password'} />
			<br />
			<button type="submit">Login</button>
		</form>
	);
}
