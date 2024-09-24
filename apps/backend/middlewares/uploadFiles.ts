import multer from 'multer';
import express from 'express';

const audioMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/mp3', 'audio/m4a'];
const textMimeTypes = ['text/plain'];
const maxAudioSize = 100 * 1024 * 1024; // 100MB for audio
const maxTextSize = 10 * 1024 * 1024;   // 10MB for text

const storage = multer.memoryStorage();

const fileFilter = (allowedTypes: string[]) => (
  req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      fileFilter(audioMimeTypes)(req, file, cb);
    } else if (file.fieldname === 'transcript' && typeof req.body.transcript !== 'string') {
      fileFilter(textMimeTypes)(req, file, cb);
    } else {
      cb(new Error('Unexpected field'));
    }
  },
  limits: {
    fileSize: Math.max(maxAudioSize, maxTextSize), // Use the larger size as the overall limit
  },
}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'transcript', maxCount: 1 },
]);


export const uploadFiles = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log('FILES ARE', req.files);

    const audioFile = Array.isArray(req.files) ? req.files[0] : req.files?.audio?.[0];
    const transcriptFile = Array.isArray(req.files) ? req.files[1] : req.files?.transcript?.[0];
    const transcriptText = req.body.transcript;

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    if (audioFile && audioFile.size > maxAudioSize) {
      return res.status(400).json({ error: 'Audio file size exceeds the limit' });
    }

    if (transcriptFile && transcriptFile.size > maxTextSize) {
      return res.status(400).json({ error: 'Transcript file size exceeds the limit' });
    }

    req.body.transcript = transcriptFile ? transcriptFile.buffer.toString('utf-8') : transcriptText;

    next();
  });
};