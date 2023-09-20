// 'use client';

import {getServerComponentClient} from '@/lib/global/supabase';
import {redirect} from 'next/navigation';
import {cookies} from "next/headers";

export default async function Upload() {
	const { data: { session } } = await getServerComponentClient(cookies).auth.getSession();
	if (!session || !session?.user || !session.user.user_metadata.admin) {
		redirect('/auth/login?next=/admin');
	}
	return (
		<form action="/admin/upload/submit" method="POST" encType="multipart/form-data">
			<label htmlFor="yaml">Upload YAML file: </label>
			<input type="file" name="yaml" id="yaml" accept=".yaml,.yml" multiple />
			<br />
			<input type="submit" value="Submit" />
		</form>
	);
}
