import express from "express"
import cors from 'cors';
import summarizeResume from './routes/summarizeResume.js'
import analyseResume from './routes/analyseResume.js'
import interviewData from './routes/interviewData.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get
app.use('/resume-details', summarizeResume)
app.use('/resume-content', analyseResume)
app.use('/interview-data', interviewData)
app.get('/', (req, res) => {
    res.status(200).send("Welcome to Interro AI");
});
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, ()=> {
//     console.log(`Server is running on ${PORT}`)
// })
export default (req, res) => {
    return app(req, res);
};
