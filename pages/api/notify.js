import { db } from '../../utils/DB';
const convert = require('xml-js');

export default async function handler(req, res) {

    if (req.method !== "POST") {
        res.status(401).json({ message: "Requête non autorisée" });
        return;
    }

    let infos = req.body;
    let data = convert.xml2json(infos, { compact: true, spaces: 4 });

    console.log(data);

    data = JSON.parse(data);
    let reponse = data.REPONSE;
    let status = reponse.STATUT._text;
    let reference = reponse.REF._text;

    await db.collection('logs').add({ ...data, date: Date.now() });

    const snapPayment = await db.collection('payments').where('reference', '==', reference).limit(1).get();

    if (!snapPayment.empty) {
        const refPayment = snapPayment.docs[0].ref;
        const payment = refPayment.data();
        const infosUpdate = {
            updated: Date.now(),
            state: status === '200' ? 'paid' : 'cancel'
        }
        await refPayment.update(infosUpdate);

        db.collection('users').where('uuid', '==', payment.user).limit(1).get().then(snap => {
            const user = snap.docs[0].data();
            axios.post('/api/mail', { address: user.email });
        }).catch(console.log);
    }

    res.status(200).json(data);
}
