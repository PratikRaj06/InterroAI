import express from 'express'

const router = express.Router()

router.get('/summarize', (req, res) => {
    res.status(200).send("This is your resume")
})

export default router