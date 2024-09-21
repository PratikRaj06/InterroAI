import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import admin from 'firebase-admin'
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const upload = multer({ dest: 'pdfs/' });

router.post('/summarize', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const idToken = req.headers.authorization?.split(' ')[1];
        if (!idToken) {
            return res.status(401).json({ message: "No token provided." });
        }
        if (!file) {
            return res.status(500).json({ "message": "File Not Found" });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (!decodedToken) {
            return res.status(401).json({ message: "No token provided." });
        }
        
        const uploadResponse = await fileManager.uploadFile(`pdfs/${file.filename}`, {
            mimeType: 'application/pdf',
            displayName: file.originalname,
        });

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                }
            },
            { text: "Extract all important details from this resume for an interview from the recruiter's perspective in a detailed paragraph." },
            
        ]);

        fs.unlink(file.path, (error) => {
            if (error) return res.status(500).json({ "message": `An error occurred in deleting: ${error}` });
        });

        res.status(200).json({ "resumeContent": await result.response.text() }); 
    } catch (error) {
        res.status(500).json({ "message": `An error occurred ${error}` });
    }
});

export default router;
