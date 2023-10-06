import {cache} from "react";
import {cookies} from "next/headers";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/lib/global/types";
import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "@/lib/global/supabase";

export const getServerComponentClient = cache(() => {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({ cookies: () => cookieStore }, {supabaseUrl: PUBLIC_SUPABASE_URL, supabaseKey: PUBLIC_SUPABASE_ANON_KEY});
});