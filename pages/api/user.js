import { db } from '../../utils/DB'
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {

    if (req.method === 'POST') {

        let infos = JSON.parse(req.body);

        if (!infos) {
            res.status(401).json({ message: 'Veuillez renseigner les informations du compte' });
            res.end();
            return;
        }

        infos.uuid = uuidv4();
        let uuid = "";

        const collection = db.collection('users');
        const snapshot = await collection.where('email', '==', infos.email).limit(1).get();

        if (snapshot.empty) {
            await db.collection('users').add(infos);
            uuid = infos.uuid;
        } else {
            snapshot.forEach(doc => {
                console.log('le retour', doc.data().uuid);
                uuid = doc.data().uuid;
            })
        }

        console.log('uuid', uuid);

        if (uuid) {
            res.status(200).json({ uuid: uuid });
        } else {
            res.status(500).json({ message: 'Impossible de récupérer les informations du compte' });
        }
    } else {
        res.status(405).json({ message: 'Requête introuvable' });
        res.end();
    }
}