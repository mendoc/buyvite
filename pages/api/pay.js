import { db } from '../../utils/DB';
import querystring from 'querystring';
import axios from 'axios';
import convert from 'xml-js';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(401).json({ message: 'Requête non autorisée' });
        return;
    }

    // Recuperation de la reference du produit et du numero de telephone
    const infos = JSON.parse(req.body);

    // On verifie que les infos sont fournies
    if (!infos || !infos.number || !infos.product) {
        res.status(400).json({ message: 'Veuillez renseigner toutes les informations' });
        return;
    }

    const number = infos.number;

    // On verifie si c'est un numero Airtel
    if (!number || number.length != 9 || !number.startsWith('07') || !(/([0-9]){9}/).test(number)) {
        res.status(400).json({ message: 'Numéro de téléphone incorrect' });
        return;
    }

    // On recupere le produit
    const snapshot = await db.collection('products').where('reference', '==', infos.product).limit(1).get();

    if (snapshot.empty) {
        res.status(400).json({ message: 'Produit introuvable' });
        return;
    }

    const product = snapshot.docs[0].data();
    const price = product.price;

    // On cree un document pour le paiement
    const today = new Date();
    const payment = {
        number: number,
        product: product.reference,
        price: price,
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

    // Preparation des informations a soumettre a PVit
    const params = {
        tel_marchand: process.env.PVIT_TEL_MARCHAND,
        montant: price,
        ref: payment.reference,
        tel_client: number,
        token: process.env.PVIT_TOKEN,
        action: 1,
        service: 'REST',
        operateur: 'AM',
        agent: 'BuyVite'
    };

    // On interroge PVit
    const resPvit = await axios.post(process.env.PVIT_URL, querystring.stringify(params));

    if (!resPvit || resPvit.status !== 200) {
        res.status(500).json({ message: 'Impossible de procéder au paiement' });
        return;
    }

    // La reponse de PVit est en XML :-( on la convertit en JSON :-)
    const dataPvit = convert.xml2json(resPvit.data, { compact: true, spaces: 4 });

    const infosPvit = JSON.parse(dataPvit);

    if (!infosPvit || !infosPvit.REPONSE) {
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la tentative de paiement' });
        return;
    }

    res.status(200).json({ message: infosPvit.REPONSE.MESSAGE._text, payment: docPayment.id });
}