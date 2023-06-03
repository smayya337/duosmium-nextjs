'use client';

import { useRouter } from 'next/navigation';
import { getClientComponentClient } from "@/lib/global/supabase";

export default async function Logout() {
	const supabase = getClientComponentClient();
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
