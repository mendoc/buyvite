import { db } from '../../utils/DB';
import axios from 'axios';

export default async function handler(req, res) {

    if (req.method !== "POST") {
        res.status(401).json({ message: "Requête non autorisée" });
        return;
    }

    // Le corps est déjà un objet JSON ou une chaîne JSON
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    console.log('Webhook reçu:', JSON.stringify(data, null, 2));

    if (!data.transaction || !data.status) {
        res.status(400).json({ message: "Format de donnée invalide" });
        return;
    }

    const reference = data.transaction.reference;
    const statusCode = data.status.code; // '200' pour succès
    const isSuccess = data.status.success === true;

    // Enregistrement des logs
    await db.collection('logs').add({ ...data, date: Date.now() });

    // Mise à jour du paiement
    const snapPayment = await db.collection('payments').where('reference', '==', reference).limit(1).get();

    if (!snapPayment.empty) {
        const docPayment = snapPayment.docs[0];
        const payment = docPayment.data();
        
        const infosUpdate = {
            updated: Date.now(),
            state: (isSuccess && statusCode === '200') ? 'paid' : 'cancel'
        };
        await docPayment.ref.update(infosUpdate);

        // Notification par email
        const userSnap = await db.collection('users').where('uuid', '==', payment.user).limit(1).get();
        if (!userSnap.empty) {
            const user = userSnap.docs[0].data();
            axios.post(process.env.EMAIL_URL, { address: user.email }).catch(console.error);
        }
    }

    res.status(200).json({ status: "success" });
}
