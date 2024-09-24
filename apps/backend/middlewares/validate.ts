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

    if (projectId.length !== 24) {
        return res.status(400).json({ error: "Invalid project ID: must be exactly 24 characters" });
    }

    const project = await validateUserOwnsProject(projectId, userId, db);

    if (!project) {
        return res.status(404).json({ error: `Project with ID: ${projectId} not found for user: ${userId}` });
    }

    next();
}