import express from 'express'
import hello from '../routes/hello.js'
import cors from 'cors'
const app = express();

app.use(cors())
app.use(express.json())

app.use("/hii", hello)
app.get("/", (req, res) => res.send("welcome to Interro AI"));

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
