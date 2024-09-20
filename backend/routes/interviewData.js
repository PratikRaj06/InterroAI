import express from 'express'
import admin from 'firebase-admin';
import { auth, db } from '../firebaseAdmin.js'
const router = express.Router()


router.post('/add-data', async (req, res) => {
    try {
        const idToken = req.headers.authorization?.split(' ')[1];

        if (!idToken) {
            return res.status(401).json({ message: "No Token Provided" });
        }

        const decodedToken = await auth.verifyIdToken(idToken);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        const { data, jobRole, score } = req.body;


        if(!data || !jobRole || !score) return res.status(404).json({message : "Invalid data"})

        const userData = {
            email: decodedToken.email,   
            data: JSON.stringify(data),                       
            jobRole,                    
            score,                      
            createdAt: admin.firestore.FieldValue.serverTimestamp(), 
        };

        await db.collection('interviewHistory').add(userData);

        return res.status(200).json({ message: "All ok" });

    } catch (error) {
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});


router.get('/get-data', async(req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]
    
    if(!idToken) return res.status(401).json({message: "No Token"})

    const decodedToken = await auth.verifyIdToken(idToken);

    if(!decodedToken) return res.status(401).json({message: "No Token"})
        
    try {
        const snapshot = await db.collection('interviewHistory')
            .where('email', '==', decodedToken.email)
            .select('jobRole', 'score', 'createdAt')
            .get();
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No matching documents.' });
        }
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            jobRole: doc.get('jobRole'),
            score: doc.get('score'),
            createdAt: doc.get('createdAt')
        }));
        res.status(200).json({ data: results });
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
})

router.get('/get-document/:id', async (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]
    if(!idToken) return res.status(401).json({message: "No Token"})
    const decodedToken = await auth.verifyIdToken(idToken);
    if(!decodedToken) return res.status(401).json({message: "No Token"})
    
    const docId = req.params.id;
    try {
        const docRef = db.collection('interviewHistory').doc(docId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Document not found.' });
        }
        const result = JSON.parse(doc.data().data)
        res.status(200).json({data: result});
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }

})


export default router