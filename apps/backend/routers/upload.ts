import express from 'express';
import { authenticateRequest } from '../middlewares/authenticateRequest.ts';
import { validateParams } from '../middlewares/validateParams';
import { uploadFiles } from '../middlewares/uploadFiles';
import { analyzeConversation } from '../services/analyze';

export const router = express.Router();

router.post('/upload', authenticateRequest, uploadFiles, validateParams, async (req: express.Request, res: express.Response) => {
    try {
        res.status(200).json({ message: "File uploaded successfully!" });
        
        const audioFile = Array.isArray(req.files) ? req.files[0] : req.files?.audio?.[0];
        const transcript = req.body.transcript;
        const projectId = req.body.projectId;

        if (!audioFile) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        await analyzeConversation(audioFile, projectId, transcript);

    } catch (error) {
        console.error('Error in upload route:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
