'use client';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

export default async function Logout() {
	const { supabase } = useSupabase();
	const router = useRouter();
	async function LogOutUser() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
		router.push('/results');
	}
	return (
		<form action={LogOutUser}>
			<button type="submit">Log Out</button>
		</form>
	);
}
