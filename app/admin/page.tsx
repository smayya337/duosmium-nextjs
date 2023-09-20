import {getServerComponentClient} from "@/lib/global/supabase";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Page() {
    const { data: { session } } = await getServerComponentClient(cookies).auth.getSession();
    if (!session || !session?.user || !session.user.user_metadata.admin) {
        redirect('/auth/login?next=/admin');
    }
    return (
        <div className="container">
            <p>Congratulations! You are an administrator.</p>
            {/*  TODO: add a button that updates all metadata  */}
        </div>
    );
}