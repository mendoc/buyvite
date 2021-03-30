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

                client.close();

                if (err) {
                    res.status(500).json({ message: 'Impossible de créer le produit' });
                    res.end();
                } else {
                    res.status(200).json({ ...data });
                    res.end();
                }
            })
        } else {
            res.status(404).json({ message: 'Requête introuvable' });
            res.end();
        }
    });
}

function createProduct(db, product, cb) {
    const usersCol = db.collection("users");
    const collection = db.collection("products");

    usersCol.findOne({ email: product.user }, (err, data) => {
        console.log('user', data)
        if (data) {
            product.user = data.uuid;
            collection.insertOne(product, (err, data) => {
                console.log('data', data)
                cb(null, data.ops[0]);
            });
        } else {
            console.log('error', err)
            cb(err);
        }
    });

}