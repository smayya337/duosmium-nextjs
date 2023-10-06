import AdminHome from '@/components/admin/AdminHome';
import { getServerComponentClient } from '@/lib/global/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
	const {
		data: { session }
	} = await getServerComponentClient(cookies).auth.getSession();
	if (!session || !session?.user || !session.user.user_metadata.admin) {
		redirect('/auth/login?next=/admin');
	}

	return <AdminHome />;
}
