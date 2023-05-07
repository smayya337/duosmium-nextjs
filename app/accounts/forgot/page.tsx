import { supabase } from '@/app/lib/global/supabase';

async function sendForgotPasswordEmail(email: string) {
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${process.env.BASE_URL}/accounts/reset`
	});
	if (error) {
		throw error;
	}
	return data;
}

export default function Page() {
	return <p>TBD</p>;
}
