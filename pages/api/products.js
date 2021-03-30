import { client } from '../../utils/DB'

const dbName = process.env.DB_NAME;

export default function handler(req, res) {

    client.connect(err => {

        if (req.method === 'GET') {
            if (err) {
                res.status(500).json({ message: 'Impossible de se connecter à la base de données' });
                return;
            }

            let email = req.query.email;

            const db = client.db(dbName);

            getProducts(db, email, (err, data) => {

                if (err) {
                    res.status(500).json({ message: 'Impossible de récupérer les produits' });
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

function getProducts(db, email, cb) {
    const collection = db.collection("products");

    collection.find({ user: email }).toArray((err, products) => {
        cb(err, products);
    });
}