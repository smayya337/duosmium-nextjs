'use client';
import { useSupabase } from '@/app/supabase-provider';
import { redirect } from 'next/navigation';
import prisma from "@/lib/global/prisma";

export default async function Register() {
	const { supabase } = useSupabase();
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
		const { data, error } = await supabase.auth.signUp({
			email: email.toString(),
			password: password.toString()
		});
		if (error) {
			throw error;
		}
		if (data.user) {
			const mp = prisma.membership.create({
				data: {
					userId: data.user?.id,
					organization: {
						connect: {
							orgName: "public"
						}
					}
				}
			});
			const mu = prisma.membership.create({
				data: {
					userId: data.user?.id,
					organization: {
						connect: {
							orgName: "users"
						}
					}
				}
			});
			await prisma.$transaction([mp, mu]);
		}
		redirect('/results');
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
