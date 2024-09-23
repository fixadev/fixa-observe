import express from 'express';
import multer from 'multer';
import { validateParamsAndBearerToken } from '../middlewares/validate';
import { uploadFileAndAnalyze } from '../services/upload';

export const router = express.Router();

const upload = multer();

router.post('/upload', upload.single('file'), validateParamsAndBearerToken, async (req: express.Request, res: express.Response) => {
    try {
        res.status(200).json({ message: "File uploaded successfully" });
        const file = req.file;
        const transcript = req.body.transcript;
        const projectId = req.body.projectId;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        await uploadFileAndAnalyze(file, transcript, projectId);

    } catch (error) {
        console.error('Error in upload route:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
