import admin from 'firebase-admin'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./interro-ai-firebase-adminsdk-oec0s-a172102efb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth()

export { db, auth };