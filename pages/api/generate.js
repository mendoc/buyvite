import { client } from '../../utils/DB'

const dbName = process.env.DB_NAME;

export default function handler(req, res) {

    client.connect(err => {

        if (req.method === 'POST') {
            if (err) res.status(500).json({ message: 'Impossible de se connecter à la base de données' });

            let product = JSON.parse(req.body);
            product.createdAt = Date.now();

            const db = client.db(dbName);

            createProduct(db, product, (err, data) => {

                if (err) res.status(500).json({ message: 'Impossible de créer le produit' });

                res.status(200).json({ data });

                client.close();
            })
        } else {
            res.status(404).json({ message: 'Requête introuvable' });
        }
    });
}

function createProduct(db, product, cb) {
    const collection = db.collection("products");

    collection.insertOne(product, (err, data) => {
        cb(err, data);
    });
}