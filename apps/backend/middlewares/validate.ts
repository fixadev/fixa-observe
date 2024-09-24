import express from 'express';
import db from '../services/db';
import { validateUserOwnsProject } from '@repo/project-domain/services/project';
export async function validateParams(req: express.Request, res: express.Response, next: express.NextFunction) {

    const userId = res.locals.userId;
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

    const project = await validateUserOwnsProject(projectId, userId, db);

    console.log("PROJECT", project);

    if (!project) {
        return res.status(404).json({ error: `Project not found for user: ${userId}` });
    }

    next();
}