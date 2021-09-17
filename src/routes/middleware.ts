import { NextFunction, Request, Response } from "express";
import { supabaseClient } from "../config";

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    let auth = req.headers['authorization'];
    if(auth) {
        let token = auth.replace("supabase ", "");
        console.log(token);
        let rs = await supabaseClient.auth.api.getUser(token);
        
        if(rs.user) {
            console.log("User is "+ rs.user.email);
            req.supaUser = rs.user;
        }
    }
    next();
}