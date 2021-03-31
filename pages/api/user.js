import { db } from '../../utils/DB'
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {

    if (req.method === 'POST') {

        let infos = JSON.parse(req.body);

        if (!infos) {
            res.status(401).json({ message: 'Veuillez renseigner les informations du compte' });
            res.end();
            return;
        }

        infos.uuid = uuidv4();
        getUser(infos, (err, uuid) => {

            if (err) {
                res.status(500).json({ message: 'Impossible de récupérer les informations du compte' });
                res.end();
                return;
            }

            res.status(200).json({ uuid: uuid });
            res.end();
        })
    } else {
        res.status(405).json({ message: 'Requête introuvable' });
        res.end();
    }
}

async function getUser(infos, cb) {

    const citiesRef = db.collection('users');
    const snapshot = await citiesRef.where('email', '==', infos.email).limit(1).get();
    if (snapshot.empty) {
        await db.collection('users').add(infos);
        cb(null, infos.uuid);
    } else {
        snapshot.forEach(doc => {
            cb(null, doc.data().uuid);
        })
    }
}