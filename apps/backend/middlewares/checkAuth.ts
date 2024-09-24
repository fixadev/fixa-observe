import express from 'express';
import db from '../services/db';
import { getUserIdFromApiKey } from '@repo/project-domain/services/user';


const BEARER_TOKEN = "8f3Z9xK2mN7pQ1rT5vW0yA4bC6dE8gH3";

export function authenticateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (!token || token !== BEARER_TOKEN) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = getUserIdFromApiKey(token, db);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    res.locals.userId = userId;
    next();
}
