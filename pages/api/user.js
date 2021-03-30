import { client } from '../../utils/DB'
import { v4 as uuidv4 } from 'uuid';

const dbName = process.env.DB_NAME;

export default function handler(req, res) {

    client.connect(err => {

        if (req.method === 'POST') {
            if (err) {
                //client.close();
                res.status(500).json({ message: 'Impossible de se connecter à la base de données' });
                res.end();
                return;
            }

            let infos = JSON.parse(req.body);

            if (!infos) {
                //client.close();
                res.status(401).json({ message: 'Veuillez renseigner les informations du compte' });
                res.end();
                return;
            }

            const db = client.db(dbName);

            getUser(db, infos, (err, data) => {

                //client.close();

                if (err) {
                    res.status(500).json({ message: 'Impossible de récupérer les informations du compte' });
                    res.end();
                    return;
                }

                res.status(200).json(data);
                res.end();
            })
        } else {
            //client.close();

            res.status(405).json({ message: 'Requête introuvable' });
            res.end();
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