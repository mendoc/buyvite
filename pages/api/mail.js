import nodemailer from 'nodemailer';

// https://serverfault.com/questions/635139/how-to-fix-send-mail-authorization-failed-534-5-7-14
// https://stackoverflow.com/questions/34433459/gmail-returns-534-5-7-14-please-log-in-via-your-web-browser

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(401).json({ message: 'Requête non autorisée' });
        return;
    }

    console.log('body', req.body);

    if (!req.body.address) {
        console.error("Adresse e-mail non renseignée");
        res.status(401).json({ message: 'Adresse e-mail non renseignée' });
        return;
    }

    const address = req.body.address || "";

    const mailOptions = {
        from: `BuyVite <${process.env.EMAIL_USER}>`,
        to: address,
        subject: 'Nouveau paiement | BuyVite',
        text: `Une personne a payé un de vos produits.`,
        html: `Une personne a payé un de vos produits.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        let message = "";
        if (error) {
            console.log(error);
            message = "Erreur : " + error.response;
        } else {
            console.log(info);
            message = 'Email envoyé: ' + info.response;
        }
        console.log(message);
    });
    res.status(200).json({ message: 'Envoi du mail initié...' });
}