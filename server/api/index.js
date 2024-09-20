import express from 'express'
import resume from '../routes/resume.js'
import summarizeResume from '../routes/summarizeResume.js'
import analyseResume from '../routes/analyseResume.js'
import interviewData from '../routes/interviewData.js'
import cors from 'cors';

const app = express();

app.use(cors())
app.use(express.json())

app.use('/resume-details', summarizeResume)
app.use('/resume-content', analyseResume)
app.use('/interview-data', interviewData)

app.use('/resume', resume)
app.get("/", (req, res) => res.send("Welcome to Interro AI"));

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
