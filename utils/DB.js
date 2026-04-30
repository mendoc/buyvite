const admin = require('firebase-admin');

let serviceAccount;
try {
    serviceAccount = process.env.SERVICE_ACCOUNT ? JSON.parse(process.env.SERVICE_ACCOUNT) : null;
} catch (e) {
    console.error("Erreur lors du parsing de SERVICE_ACCOUNT:", e.message);
    serviceAccount = null;
}

if (!admin.apps.length && serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else if (!serviceAccount) {
    console.warn("ATTENTION: SERVICE_ACCOUNT n'est pas défini. Firebase ne fonctionnera pas.");
}

const db = admin.apps.length ? admin.firestore() : null;

exports.db = db;