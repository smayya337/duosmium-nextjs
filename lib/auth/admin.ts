import { getCurrentUser } from '@/lib/auth/helpers';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function isAdmin(supabase: SupabaseClient) {
	const user = await getCurrentUser(supabase);
	if (user === undefined) {
		return false;
	} else {
		return user.email?.endsWith('duosmium.org');
	}
}
