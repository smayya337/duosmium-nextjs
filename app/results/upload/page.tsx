'use client';

import { isAdmin } from '@/lib/auth/admin';
import { getClientComponentClient } from "@/lib/global/supabase";
import { redirect } from "next/navigation";

export default async function Upload() {
	const supabase = getClientComponentClient();
	if (!(await isAdmin(supabase))) {
		redirect("/results");
	}
	return (
		<form action="/results/upload/submit" method="POST" encType="multipart/form-data">
			<label htmlFor="yaml">Upload YAML file: </label>
			<input type="file" name="yaml" id="yaml" accept=".yaml,.yml" multiple />
			<br />
			<input type="submit" value="Submit" />
		</form>
	);
}
