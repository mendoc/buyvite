import { client } from '../../utils/DB'

const dbName = 'buyvite';

export default function handler(req, res) {

    client.connect(err => {

        if (req.method === 'POST') {
            if (err) res.status(500).json({ message: 'Impossible de se connecter à la base de données' });

            const db = client.db(dbName);

            getProducts(db, (err, products) => {

                if (err) res.status(500).json({ message: 'Impossible de récupérer les produits' });

                res.status(200).json({ products });

                client.close();
            })
        } else {
            res.status(404).json({ message: 'Requête introuvable' });
        }
    });
}

function getProducts(db, cb) {
    const collection = db.collection("products");

    collection.find().toArray((err, products) => {
        cb(err, products);
    });
}