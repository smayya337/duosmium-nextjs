import { supabase } from '@/lib/global/supabase';

async function changeUserPassword(password: string) {
	const { data, error } = await supabase.auth.updateUser({
		password: password
	});
	if (error) {
		throw error;
	}
	return data;
}

export default function Page() {
	return <p>TBD</p>;
}
