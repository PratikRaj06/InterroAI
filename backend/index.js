import express from "express"
import cors from 'cors';
import summarizeResume from './routes/summarizeResume.js'
import analyseResume from './routes/analyseResume.js'
import interviewData from './routes/interviewData.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/resume-details', summarizeResume)
app.use('/resume-content', analyseResume)
app.use('/interview-data', interviewData)

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})
