import { User } from "@supabase/gotrue-js";
import { DataForm } from "./engine/page";

declare module "express-serve-static-core" {
    export interface Request {
        rawBody: string;
        schema?: DataForm;
        supaUser?: User;
    }
}