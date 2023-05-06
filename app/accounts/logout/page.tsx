'use client';
import { useSupabase } from '@/app/supabase-provider';

export default async function Logout() {
	const { supabase } = useSupabase();
	async function LogOutUser() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	}
	return (
		<form action={LogOutUser}>
			<button type="submit">Log Out</button>
		</form>
	);
}

