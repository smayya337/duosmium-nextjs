import { getServerComponentSupabaseClient } from "@/lib/global/supabase";
import { cookies, headers } from "next/headers";
import { getCurrentUserID } from "@/lib/auth/helpers";
import { isAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export default async function Upload() {
	const supabase = getServerComponentSupabaseClient(headers, cookies);
	const userID = await getCurrentUserID(supabase);
	if (!(await isAdmin(userID))) {
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
