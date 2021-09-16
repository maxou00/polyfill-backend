import { createClient } from "@supabase/supabase-js";
import Pusher from "pusher";
import { createClient as createRedisClient} from "redis";

export const supabaseClient = createClient(
    process.env.supabase_url || "",
    process.env.supabase_service_key || "",
);

export const redisClient = createRedisClient({
    host: process.env.redis_host || "",
    port: parseInt(process.env.redis_port || '6379')
})

export const pusherClient = new Pusher({
    appId: process.env.pusher_app_id || "",
    key: process.env.pusher_key || "",
    secret: process.env.pusher_secret || "",
    cluster: process.env.pusher_cluster || ""
});