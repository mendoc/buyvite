import { client } from '../../utils/DB'
import { v4 as uuidv4 } from 'uuid';

const dbName = process.env.DB_NAME;

export default function handler(req, res) {

    client.connect(err => {

        if (req.method === 'POST') {
            if (err) {
                res.status(500).json({ message: 'Impossible de se connecter à la base de données' });
                return;
            }

            let infos = JSON.parse(req.body);

            const db = client.db(dbName);

            getUser(db, infos, (err, data) => {

                if (err) {
                    res.status(500).json({ message: 'Impossible de récupérer les informations du compte' });
                    return;
                }

                res.status(200).json({ data });

                client.close();
            })
        } else {
            res.status(404).json({ message: 'Requête introuvable' });
        }
    });
}

function getUser(db, infos, cb) {
    const collection = db.collection("users");

    collection.findOne({ email: infos.email }, (err, user) => {

        console.log("user", user);

        if (user) {
            cb(err, user);
        } else {
            infos.uuid = uuidv4();
            collection.insertOne({ ...infos }, (err, data) => {
                console.log("data", data);
                if (data) {
                    cb(err, infos);
                } else {
                    cb(err);
                }
            })
        }

    });
}