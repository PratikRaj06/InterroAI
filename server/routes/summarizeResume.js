import express from 'express';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});


router.post('/summarize', async (req, res) => {
    try {

        const idToken = req.headers.authorization?.split(' ')[1];
        const { fileUrl } = req.body;

        if (!idToken) {
            return res.status(401).json({ message: "No token provided." });
        }
        
        if (!fileUrl) {
            console.error('File URL not found.');
            return res.status(400).json({ message: 'File Not Found' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (!decodedToken) {
            console.error('Invalid token.');
            return res.status(401).json({ message: 'Invalid token.' });
        }

        const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(fileResponse.data);

        const filePart = {
            inlineData: {
                data: fileBuffer.toString("base64"), // Convert buffer to Base64
                mimeType: 'application/pdf',
            },
        };

        const result = await model.generateContent([
            filePart,
            { text: "Extract all important details from this resume for an interview from the recruiter's perspective in a detailed paragraph." }
        ])
        const summary = await result.response.text()
        res.status(200).json({ resumeContent: summary });

    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
});

export default router;
