import { Database } from "@/types/database.types";
import {
    createClient,
    SupabaseClient as TSupabaseClient,
} from "@supabase/supabase-js";

export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL ?? "",
	import.meta.env.VITE_SUPABASE_KEY ?? ""
);

export const SupabaseClient = <T>() => {
	return supabase as TSupabaseClient<T>;
};