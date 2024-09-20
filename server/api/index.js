import express from 'express'
import resume from '../routes/resume.js'
const app = express();

app.use('/resume', resume)
app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
