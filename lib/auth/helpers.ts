import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export async function getCurrentUser(supabase: SupabaseClient): Promise<User | undefined> {
	const ses = await supabase.auth.getSession();
	if (ses.error) {
		throw ses.error;
	}
	return ses.data.session?.user;
}

export async function getCurrentUserID(supabase: SupabaseClient) {
	const user = await getCurrentUser(supabase);
	return getUserID(user);
}

export function getUserID(user: User | undefined) {
	if (user === undefined) return null;
	else return user.id;
}
