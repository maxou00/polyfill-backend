import { createClient } from "@supabase/supabase-js";
import Pusher from "pusher";

export const supabaseClient = createClient(
    process.env.supabase_url || "",
    process.env.supabase_service_key || "",
);

export const pusherClient = new Pusher({
    appId: process.env.pusher_app_id || "",
    key: process.env.pusher_key || "",
    secret: process.env.pusher_secret || "",
    cluster: process.env.pusher_cluster || ""
});