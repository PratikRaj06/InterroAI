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

router.post('/analyse', async (req, res) => {
    try {
        const idToken = req.headers.authorization?.split(' ')[1];
        const { jobDescription, filename, fileUrl } = req.body;

        console.log('Received request:', { jobDescription, fileUrl });

        if (!idToken) {
            console.error('No token provided.');
            return res.status(401).json({ message: 'No token provided.' });
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

        // Step 1: Fetch the file data from the URI
        const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(fileResponse.data);
        console.log('File data fetched successfully.');

        // Step 2:  Convert file buffer to a GoogleGenerativeAI.Part object

        const filePart = {
            inlineData: {
                data: fileBuffer.toString("base64"), // Convert buffer to Base64
                mimeType: 'application/pdf',
            },
        };

        // Step 3: Generate content from the uploaded file using Gemini
        const result = await model.generateContent([
            filePart,
            {
                text: `Please evaluate the resume on a scale of 1 to 10, where 10 indicates an exceptional fit for a job description that is ${jobDescription}. Your evaluation should be in simple, human-friendly language and structured in the following JSON format:
            {
                "Score": [A numerical score from 1 to 10, reflecting the overall quality and effectiveness of the resume.],
                "ScoreOfEachSection": {
                    "Summary": [Score for the effectiveness of the professional summary or objective statement.],
                    "Education": [Score for the presentation and relevance of educational qualifications.],
                    "Skills": [Score for how well the skills are presented, and their relevance to the field.],
                    "Experience": [Score for the relevance and impact of professional experience.],
                    "Projects": [Score for the quality, relevance, and impact of personal or professional projects listed.],
                    "Certifications": [Score for the value and relevance of certifications included.],
                    "Formatting and Layout": [Score for formatting, consistency, and layout.],
                    "Clarity and Precision": [Score for the clarity of language and precision in presenting information.],
                    "Grammar and Spelling": [Score for grammatical and spelling accuracy.]
                },
                "Overall Impression": "A general impression of the resume, including its effectiveness in communicating the candidate's qualifications.",
                "Formatting and Layout": "Comments on the resume’s formatting, consistency, and overall visual appeal. Assess how well the layout facilitates easy reading.",
                "Professional Summary": "Assess the effectiveness of the professional summary or objective statement. Determine if it provides a compelling introduction to the candidate’s career goals and key strengths.",
                "Clarity and Precision": "Evaluate the clarity of the language used and the precision of the information presented. Identify any ambiguous or unclear statements.",
                "Skill Representation": "Examine how skills are presented, including their relevance to the field and whether they are demonstrated through specific examples.",
                "Alignment with Job Requirements": "Assess how well the resume might align with typical job requirements in the candidate’s field.",
                "Impact of Achievements": "Examine the impact and relevance of the achievements listed, including whether they are quantified and effectively highlight the candidate's capabilities.",
                "Keywords and Industry Jargon": "Evaluate the use of industry-specific keywords and jargon. Determine if the resume uses relevant terminology that could enhance its visibility in Applicant Tracking Systems (ATS).",
                "Consistency in Tone and Voice": "Analyze the consistency of the tone and voice throughout the resume. Ensure it maintains a professional and coherent narrative.",
                "Strengths": [List of key strengths identified in the resume, provided as complete sentences.],
                "Areas of Improvement": [List of areas where the resume could be enhanced, provided as complete sentences focusing on specific sections.],
                "Suggestions": [Actionable suggestions for improving the resume, provided as complete sentences.]
            }
            `}
        ]);
        console.log('Content generated successfully.');

        const cleanedData = (data) => {
            return data
                .replace(/```json|```|```/g, '')
                .trim();
        };

        let resumeData = '';
        if (result.response) {
            const rawData = await result.response.text();
            resumeData = cleanedData(rawData);
        }
        res.status(200).json({ "resumeResult": resumeData });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
});

export default router;
