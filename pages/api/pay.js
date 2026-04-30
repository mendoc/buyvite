import { db } from '../../utils/DB';
import PaymentService from '../../services/PaymentService';

export default async function handler(req, res) {

    if (!db) {
        res.status(500).json({ message: 'Base de données non configurée (SERVICE_ACCOUNT manquant)' });
        return;
    }

    if (req.method !== 'POST') {
        res.status(401).json({ message: 'Requête non autorisée' });
        return;
    }

    const infos = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!infos || !infos.number || !infos.product) {
        res.status(400).json({ message: 'Veuillez renseigner toutes les informations' });
        return;
    }

    const number = infos.number;

    if (!number || number.length != 9 || !number.startsWith('07') || !(/([0-9]){9}/).test(number)) {
        res.status(400).json({ message: 'Numéro de téléphone incorrect' });
        return;
    }

    const snapshot = await db.collection('products').where('reference', '==', infos.product).limit(1).get();

    if (snapshot.empty) {
        res.status(400).json({ message: 'Produit introuvable' });
        return;
    }

    const product = snapshot.docs[0].data();

    const today = new Date();
    const payment = {
        number: number,
        product: product.reference,
        amount: product.price,
        user: product.user,
        state: 'init',
        reference: `P${today.getFullYear()}${today.getMilliseconds()}${Math.floor(Math.random() * 1000)}`,
        created: today.getTime()
    }
    const docPayment = await db.collection('payments').add(payment);

    if (!docPayment.id) {
        res.status(500).json({ message: 'Impossible d\'enregistrer le paiement' });
        return;
    }

    try {
        const result = await PaymentService.processPayment({
            amount: payment.amount,
            number: payment.number,
            reference: payment.reference
        });

        res.status(200).json({ message: 'Paiement initié avec succès', payment: docPayment.id, details: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}