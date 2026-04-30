import { db } from '../../utils/DB'

export default async function handler(req, res) {

    if (!db) {
        res.status(500).json({ message: 'Base de données non configurée (SERVICE_ACCOUNT manquant)' });
        return;
    }

    if (req.method === 'POST') {

        const today = new Date();
        let product = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        product.createdAt = today.getTime();
        product.reference = `R${today.getFullYear()}${today.getMilliseconds()}${Math.floor(Math.random() * 1000)}`;

        const usersCollection = db.collection('users');
        const userSnapshot = await usersCollection.where('email', '==', product.user).limit(1).get();

        if (userSnapshot.empty) {
            res.status(500).json({ message: 'Impossible de créer le produit' });
        } else {
            userSnapshot.forEach(doc => {
                product.user = doc.data().uuid;
            });
            
            const ret = await db.collection('products').add(product);
            if (ret.id) {
                res.status(200).json(product);
            } else {
                res.status(500).json({ message: 'Impossible de créer le produit' });
            }
        }
    } else {
        res.status(404).json({ message: 'Requête introuvable' });
        res.end();
    }
}