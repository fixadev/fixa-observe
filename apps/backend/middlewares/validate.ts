import express from 'express';
import { checkBearerToken } from "./checkAuth";

export async function validateParamsAndBearerToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!checkBearerToken(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const file = req.file;
    const transcript = req.body.transcript;
    const projectId = req.body.projectId;

    if (!file) {
        return res.status(400).json({ error: "File is required" });
    }
    
    if (!file.mimetype.startsWith("audio/")) {
        return res.status(400).json({ error: "File must be an audio file" });
    }

    if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" });
    }
    next();
}